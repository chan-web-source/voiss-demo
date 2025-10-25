"use client";

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, EyeOff, MessageSquare } from "lucide-react";
import type { ReviewData } from "../../../types/dashboard";

interface ReviewsPageProps {
 reviews: ReviewData[];
 onReviewToggle: (reviewId: string, isPublic: boolean) => void;
}

export default function ReviewsPage({ reviews = [], onReviewToggle }: ReviewsPageProps) {
 const approvedReviews = (reviews || []).filter(review => review.isApproved);

 return (
  <div className="bg-[#fffdf6]">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <Card className="bg-white">
     <CardHeader>
      <CardTitle className="flex items-center gap-2">
       <MessageSquare className="h-5 w-5 text-blue-600" />
       Select Reviews for Public Display
      </CardTitle>
      <p className="text-sm text-gray-600 mt-1">Choose which approved reviews should be displayed on the public website</p>
     </CardHeader>
     <CardContent>
      <div className="space-y-4">
       {approvedReviews.map((review) => (
        <div key={review.id} className="bg-white shadow-lg rounded-lg p-4">
         <div className="flex items-start justify-between">
          <div className="flex-1">
           <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">{review.propertyName}</h4>
            <Badge variant="outline" className="text-xs">
             {review.channel}
            </Badge>
            <Badge variant="outline" className="text-xs">
             {review.category}
            </Badge>
           </div>
           <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-yellow-600">
             <Star className="h-4 w-4 fill-current mr-1" />
             <span className="font-medium">{review.rating}</span>
            </div>
            <span className="text-sm text-gray-600">by {review.guestName}</span>
            <span className="text-sm text-gray-500">
             {new Date(review.submittedAt).toLocaleDateString()}
            </span>
           </div>
           <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
           <Button
            variant="outline"
            size="sm"
            onClick={() => onReviewToggle(review.id, !review.isPublic)}
           >
            {review.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {review.isPublic ? 'Public' : 'Private'}
           </Button>
          </div>
         </div>
        </div>
       ))}

       {approvedReviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
         <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
         <p>No approved reviews available for public display</p>
         <p className="text-sm">Approve reviews first to make them available for selection</p>
        </div>
       )}
      </div>
     </CardContent>
    </Card>
   </div>
  </div>
 );
}
