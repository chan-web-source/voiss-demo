"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, AlertCircle } from "lucide-react"

interface GoogleReviewsIntegrationProps {
  onReviewsImported?: (reviews: any[]) => void
}

export function GoogleReviewsIntegration({ onReviewsImported }: GoogleReviewsIntegrationProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/reviews/google?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch Google reviews")
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleImportReviews = () => {
    if (results?.result && onReviewsImported) {
      onReviewsImported(results.result)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Google Reviews Integration
          </CardTitle>
          <CardDescription>
            Search for your property on Google to import reviews. Currently disabled for demo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for property (e.g., 'Flex Living Shoreditch London')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              disabled={true} // Disabled for demo
            />
            <Button onClick={handleSearch} disabled={true}>
              Search (Demo Mode)
            </Button>
          </div>

          {results && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{results.metadata.place_name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-medium">{results.metadata.overall_rating}</span>
                    </div>
                    <Badge variant="secondary">{results.metadata.total_reviews} total reviews</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Found {results.result.length} recent reviews to import
                  </p>
                  <Button onClick={handleImportReviews} className="w-full">
                    Import {results.result.length} Google Reviews
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h4 className="font-medium">Preview of Reviews:</h4>
                {results.result.slice(0, 3).map((review: any, index: number) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{review.guestName}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{review.publicReview}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  )
}
