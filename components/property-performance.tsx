"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Star,
    TrendingUp,
    TrendingDown,
    MapPin,
    Users,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    Clock,
    Search,
    Filter,
    BarChart3,
    Eye,
    RefreshCw,
    Bed,
    Bath,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { NormalizedReview } from "@/types/review";

interface PropertyStats {
    id: number;
    name: string;
    location: string;
    image: string;
    totalReviews: number;
    averageRating: number;
    ratingChange: number;
    approvedReviews: number;
    pendingReviews: number;
    rejectedReviews: number;
    categoryScores: {
        cleanliness: number;
        communication: number;
        location: number;
        checkin: number;
        accuracy: number;
        value: number;
    };
    monthlyTrend: { month: string; rating: number; count: number }[];
    topIssues: string[];
    revenue: string;
    occupancy: number;
    status: "Active" | "Maintenance" | "Inactive";
    lastReviewDate: Date;
    channelBreakdown: { [key: string]: number };
}

interface PropertyPerformanceProps {
    reviews: NormalizedReview[];
}

export function PropertyPerformance({ reviews }: PropertyPerformanceProps) {
    const [sortBy, setSortBy] = useState<string>("rating");
    const [filterBy, setFilterBy] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTimeRange, setSelectedTimeRange] = useState("all");
    const [apiPropertyStats, setApiPropertyStats] = useState<PropertyStats[]>(
        []
    );
    const [loading, setLoading] = useState(true);

    // Fetch property performance data from API
    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                const response = await fetch("/api/properties/performance");
                const data = await response.json();
                if (data.success) {
                    setApiPropertyStats(data.data);
                }
            } catch (error) {
                console.error("Error fetching property data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyData();
    }, []);

    // Generate property statistics from reviews (fallback)
    const propertyStats = useMemo(() => {
        const statsMap: { [key: string]: PropertyStats } = {};

        // Filter reviews by time range
        const now = new Date();
        const timeRangeMs =
            {
                "7d": 7 * 24 * 60 * 60 * 1000,
                "30d": 30 * 24 * 60 * 60 * 1000,
                "90d": 90 * 24 * 60 * 60 * 1000,
                "1y": 365 * 24 * 60 * 60 * 1000,
            }[selectedTimeRange] || 30 * 24 * 60 * 60 * 1000;

        const cutoffDate = new Date(now.getTime() - timeRangeMs);
        const filteredReviews = reviews.filter(
            (review) => review.submittedAt >= cutoffDate
        );

        filteredReviews.forEach((review) => {
            const propertyName = review.listingName;

            if (!statsMap[propertyName]) {
                statsMap[propertyName] = {
                    id: Object.keys(statsMap).length + 1,
                    name: propertyName,
                    location: getLocationFromName(propertyName),
                    image: getImageFromName(propertyName),
                    totalReviews: 0,
                    averageRating: 0,
                    ratingChange: 0,
                    approvedReviews: 0,
                    pendingReviews: 0,
                    rejectedReviews: 0,
                    categoryScores: {
                        cleanliness: 0,
                        communication: 0,
                        location: 0,
                        checkin: 0,
                        accuracy: 0,
                        value: 0,
                    },
                    monthlyTrend: [],
                    topIssues: [],
                    revenue: generateRevenue(),
                    occupancy: Math.floor(Math.random() * 20) + 80,
                    status: Math.random() > 0.1 ? "Active" : "Maintenance",
                    lastReviewDate: new Date(),
                    channelBreakdown: {},
                };
            }

            const property = statsMap[propertyName];
            property.totalReviews++;

            if (review.isApproved) {
                property.approvedReviews++;
            } else if (review.status === "published") {
                property.pendingReviews++;
            } else if (review.status === "rejected") {
                property.rejectedReviews++;
            }

            // Update channel breakdown
            property.channelBreakdown[review.channel] =
                (property.channelBreakdown[review.channel] || 0) + 1;

            if (review.submittedAt > property.lastReviewDate) {
                property.lastReviewDate = review.submittedAt;
            }
        });

        // Calculate averages and trends
        Object.values(statsMap).forEach((property) => {
            const propertyReviews = filteredReviews.filter(
                (r) => r.listingName === property.name
            );

            if (propertyReviews.length > 0) {
                property.averageRating =
                    propertyReviews.reduce(
                        (sum, r) => sum + r.overallRating,
                        0
                    ) / propertyReviews.length;

                // Calculate category scores
                Object.keys(property.categoryScores).forEach((category) => {
                    const categoryReviews = propertyReviews.filter(
                        (r) =>
                            r.categories[category as keyof typeof r.categories]
                    );
                    if (categoryReviews.length > 0) {
                        property.categoryScores[
                            category as keyof typeof property.categoryScores
                        ] =
                            categoryReviews.reduce(
                                (sum, r) =>
                                    sum +
                                    (r.categories[
                                        category as keyof typeof r.categories
                                    ] || 0),
                                0
                            ) / categoryReviews.length;
                    }
                });

                // Calculate rating change (mock for now)
                property.ratingChange = (Math.random() - 0.5) * 0.6;

                // Generate monthly trend
                property.monthlyTrend = generateMonthlyTrend(propertyReviews);

                // Identify top issues
                property.topIssues = identifyTopIssues(propertyReviews);
            }
        });

        return Object.values(statsMap);
    }, [reviews, selectedTimeRange]);

    // Use API data if available, otherwise fallback to computed stats
    const finalPropertyStats =
        apiPropertyStats.length > 0 ? apiPropertyStats : propertyStats;

    // Apply filters and sorting
    const filteredAndSortedProperties = useMemo(() => {
        let filtered = finalPropertyStats;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (property) =>
                    property.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    property.location
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (filterBy !== "all") {
            if (filterBy === "high-performing") {
                filtered = filtered.filter(
                    (property) => property.averageRating >= 4.5
                );
            } else if (filterBy === "needs-attention") {
                filtered = filtered.filter(
                    (property) =>
                        property.averageRating < 4.0 ||
                        property.pendingReviews > 5
                );
            } else if (filterBy === "pending-reviews") {
                filtered = filtered.filter(
                    (property) => property.pendingReviews > 0
                );
            } else {
                filtered = filtered.filter(
                    (property) => property.status === filterBy
                );
            }
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return b.averageRating - a.averageRating;
                case "reviews":
                    return b.totalReviews - a.totalReviews;
                case "pending":
                    return b.pendingReviews - a.pendingReviews;
                case "name":
                    return a.name.localeCompare(b.name);
                case "recent":
                    return (
                        b.lastReviewDate.getTime() - a.lastReviewDate.getTime()
                    );
                default:
                    return 0;
            }
        });

        return filtered;
    }, [finalPropertyStats, searchQuery, filterBy, sortBy]);

    const getPerformanceStatus = (property: PropertyStats) => {
        if (property.averageRating >= 4.5)
            return { label: "Excellent", color: "bg-green-500" };
        if (property.averageRating >= 4.0)
            return { label: "Good", color: "bg-blue-500" };
        if (property.averageRating >= 3.5)
            return { label: "Fair", color: "bg-yellow-500" };
        return { label: "Needs Attention", color: "bg-red-500" };
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${
                            i < Math.floor(rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm font-medium">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-6 w-6 animate-spin text-[#284E4C]" />
                    <span className="ml-2 text-gray-600">
                        Loading property data...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters and Controls */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl">
                                Property Performance
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Monitor performance across all{" "}
                                {finalPropertyStats.length} properties
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select
                                value={selectedTimeRange}
                                onValueChange={setSelectedTimeRange}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">
                                        Last 7 days
                                    </SelectItem>
                                    <SelectItem value="30d">
                                        Last 30 days
                                    </SelectItem>
                                    <SelectItem value="90d">
                                        Last 3 months
                                    </SelectItem>
                                    <SelectItem value="1y">
                                        Last year
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search properties..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterBy} onValueChange={setFilterBy}>
                            <SelectTrigger className="w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Properties
                                </SelectItem>
                                <SelectItem value="high-performing">
                                    High Performing
                                </SelectItem>
                                <SelectItem value="needs-attention">
                                    Needs Attention
                                </SelectItem>
                                <SelectItem value="pending-reviews">
                                    Pending Reviews
                                </SelectItem>
                                <SelectItem value="Active">
                                    Active Only
                                </SelectItem>
                                <SelectItem value="Maintenance">
                                    In Maintenance
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rating">
                                    By Rating
                                </SelectItem>
                                <SelectItem value="reviews">
                                    By Reviews
                                </SelectItem>
                                <SelectItem value="pending">
                                    By Pending
                                </SelectItem>
                                <SelectItem value="name">By Name</SelectItem>
                                <SelectItem value="recent">
                                    Most Recent
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Property Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAndSortedProperties.map((property) => {
                    const performance = getPerformanceStatus(property);
                    const slug = property.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "")
                        .replace(/-+/g, "-")
                        .replace(/^-|-$/g, "");

                    return (
                        <div
                            key={property.id}
                            className="group rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] bg-[#fffdf6] opacity-100"
                        >
                            <Link
                                href={`/property/${slug}`}
                                className="block w-full h-full touch-manipulation"
                            >
                                {/* Property Image Header with 16:9 aspect ratio */}
                                <div className="relative">
                                    <div className="relative pb-[56.25%]">
                                        <Image
                                            src={property.image}
                                            alt={property.name}
                                            fill
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />

                                        {/* Price Badge - Top Right */}
                                        <div className="absolute top-2 right-1">
                                            <div className="backdrop-blur-sm rounded-md shadow-lg border bg-[rgba(255,253,246,0.94)] border-[rgba(92,92,90,0.125)]">
                                                <div className="px-1.5 py-0.5">
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-baseline gap-0.5">
                                                            <span className="text-base font-bold text-[#284E4C]">
                                                                £
                                                                {Math.floor(
                                                                    Math.random() *
                                                                        200 +
                                                                        150
                                                                )}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] text-[#5c5c5a]">
                                                            per night
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold break-words hyphens-auto mb-2 text-[#333333]">
                                        {property.name}
                                    </h3>
                                    <p className="text-sm mb-3 text-[#5c5c5a]">
                                        {property.location}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-[#5c5c5a]">
                                        <div className="flex items-center gap-1">
                                            <Bed className="h-3 w-3" />
                                            <span>
                                                {Math.floor(Math.random() * 3) +
                                                    1}{" "}
                                                Bedrooms
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Bath className="h-3 w-3" />
                                            <span>
                                                {Math.floor(Math.random() * 2) +
                                                    1}{" "}
                                                Bathroom
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            <span>
                                                Up to{" "}
                                                {Math.floor(Math.random() * 4) +
                                                    2}{" "}
                                                guests
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {filteredAndSortedProperties.length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-gray-500">
                            No properties found matching your current filters.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setFilterBy("all");
                            }}
                            className="mt-4"
                        >
                            Clear Filters
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Helper functions
function getLocationFromName(name: string): string {
    if (name.toLowerCase().includes("shoreditch")) return "Shoreditch, London";
    if (name.toLowerCase().includes("canary")) return "Canary Wharf, London";
    if (name.toLowerCase().includes("fitzrovia")) return "Fitzrovia, London";
    if (name.toLowerCase().includes("paris")) return "Paris, France";
    if (name.toLowerCase().includes("algiers")) return "Algiers, Algeria";
    return "London, UK";
}

function getImageFromName(name: string): string {
    // Map property names to specific high-quality images
    const propertyImages: Record<string, string> = {
        "2B N1 A - 29 Shoreditch Heights":
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "1B E1 B - 15 Canary Wharf Tower":
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "Studio W1 C - 42 Fitzrovia Square":
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "3B SW3 A - 12 Chelsea Garden Mews":
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "2B W2 D - 8 Paddington Central":
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    };

    // Return specific image for known properties, or fallback to a default
    return (
        propertyImages[name] ||
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    );
}

function generateRevenue(): string {
    const currencies = ["£", "€", "DA"];
    const amounts = [3200, 3800, 4200, 2800, 3500, 85000];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    return `${currency}${amount.toLocaleString()}`;
}

function generateMonthlyTrend(reviews: NormalizedReview[]) {
    // Generate simple monthly trend data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
        month,
        rating: 4.0 + Math.random() * 1.5,
        count: Math.floor(Math.random() * 10) + 5,
    }));
}

function identifyTopIssues(reviews: NormalizedReview[]): string[] {
    const issues = [
        "Cleanliness could be improved",
        "Check-in process needs streamlining",
        "Communication response time",
        "Location accessibility",
        "Amenities not as described",
        "Noise levels in the area",
    ];

    const lowRatingReviews = reviews.filter((r) => r.overallRating < 4.0);
    if (lowRatingReviews.length === 0) return [];

    return issues.slice(
        0,
        Math.min(3, Math.floor(lowRatingReviews.length / 2))
    );
}
