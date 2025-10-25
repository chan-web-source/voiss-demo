"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink, RefreshCw } from 'lucide-react';
import { useKayakReviews } from '../hooks/use-kayak-reviews';
import { convertKayakReviewsToInternal } from '../lib/kayak-utils';
import type { FetchKayakReviewsParams } from '../types/review';

interface KayakReviewsDemoProps {
 propertyName?: string;
}

export default function KayakReviewsDemo({ propertyName = "Sample Property" }: KayakReviewsDemoProps) {
 const [params, setParams] = useState<FetchKayakReviewsParams>({
  objectId: '12222',
  amount: 10,
  startIndex: 0,
  reviewSources: 'BOOKING,AGODA,PRICELINE,HOTELSCOMBINED,KAYAK',
  sortType: 'recent',
  includeReviewLink: true,
  reviewType: 'hotel'
 });

 const { data, loading, error, refetch } = useKayakReviews(params);

 const handleObjectIdChange = (value: string) => {
  setParams(prev => ({ ...prev, objectId: value }));
 };

 const handleAmountChange = (value: string) => {
  setParams(prev => ({ ...prev, amount: parseInt(value) || 10 }));
 };

 const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
   <Star
    key={i}
    className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
   />
  ));
 };

 const convertedReviews = data ? convertKayakReviewsToInternal(data.reviews, propertyName) : [];

 return (
  <div className="space-y-6">
   <Card>
    <CardHeader>
     <CardTitle className="flex items-center gap-2">
      <ExternalLink className="h-5 w-5" />
      Kayak Reviews API Demo
     </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
       <label className="text-sm font-medium text-gray-700">Object ID</label>
       <Input
        value={params.objectId || ''}
        onChange={(e) => handleObjectIdChange(e.target.value)}
        placeholder="Enter object ID"
        className="mt-1"
       />
      </div>
      <div>
       <label className="text-sm font-medium text-gray-700">Amount</label>
       <Input
        type="number"
        value={params.amount || 10}
        onChange={(e) => handleAmountChange(e.target.value)}
        placeholder="Number of reviews"
        className="mt-1"
       />
      </div>
     </div>

     <Button onClick={refetch} disabled={loading} className="w-full">
      {loading ? (
       <>
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        Loading...
       </>
      ) : (
       <>
        <RefreshCw className="h-4 w-4 mr-2" />
        Fetch Reviews
       </>
      )}
     </Button>
    </CardContent>
   </Card>

   {error && (
    <Card className="border-red-200 bg-red-50">
     <CardContent className="pt-6">
      <p className="text-red-600">Error: {error}</p>
     </CardContent>
    </Card>
   )}

   {data && (
    <div className="space-y-4">
     <Card>
      <CardHeader>
       <CardTitle>API Response Summary</CardTitle>
      </CardHeader>
      <CardContent>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
         <div className="text-2xl font-bold text-blue-600">{data.reviewCount}</div>
         <div className="text-sm text-gray-600">Total Reviews</div>
        </div>
        <div className="text-center">
         <div className="text-2xl font-bold text-green-600">{data.reviews.length}</div>
         <div className="text-sm text-gray-600">Fetched Reviews</div>
        </div>
        <div className="text-center">
         <div className="text-2xl font-bold text-purple-600">{convertedReviews.length}</div>
         <div className="text-sm text-gray-600">Converted Reviews</div>
        </div>
       </div>
      </CardContent>
     </Card>

     <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.reviews.map((review) => (
       <Card key={review.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
         <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
           <h4 className="font-semibold text-gray-900 mb-1">{review.author}</h4>
           <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center space-x-1">
             {renderStars((review.score / 100) * 5)}
            </div>
            <Badge variant="outline" className="text-xs">
             {review.localizedRatingCategory}
            </Badge>
           </div>
          </div>
          <div className="text-right">
           <div className="text-sm font-bold text-blue-600">{review.score}/100</div>
           <div className="text-xs text-gray-500">{review.localizedMonthYear}</div>
          </div>
         </div>

         {review.positiveComment && (
          <div className="mb-3">
           <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
            <strong>Positive:</strong> {review.positiveComment}
           </p>
          </div>
         )}

         {review.negativeComment && (
          <div className="mb-3">
           <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
            <strong>Negative:</strong> {review.negativeComment}
           </p>
          </div>
         )}

         <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{review.siteName}</span>
          <a
           href={review.siteLink}
           target="_blank"
           rel="noopener noreferrer"
           className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
           View Original
           <ExternalLink className="w-3 h-3" />
          </a>
         </div>
        </CardContent>
       </Card>
      ))}
     </div>
    </div>
   )}
  </div>
 );
}
