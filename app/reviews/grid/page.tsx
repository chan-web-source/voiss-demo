"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, EyeOff, CheckCircle, XCircle, Calendar, User } from "lucide-react";
import type { ReviewData } from "../../../types/dashboard";

export const dynamic = 'force-dynamic';

interface ReviewsGridProps {
  reviews: ReviewData[];
  onReviewToggle: (reviewId: string, isPublic: boolean) => void;
  onReviewApprove: (reviewId: string, approved: boolean) => void;
}

export default function ReviewsGrid({ reviews = [], onReviewToggle, onReviewApprove }: ReviewsGridProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : i < rating ? "text-yellow-400 fill-current opacity-50" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
      {reviews.map((review) => (
        <Card key={review.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#284E4C] flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 truncate">{review.guestName}</h4>
                  <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                </div>
              </div>
              <div className="text-xs px-2 py-1 rounded-full uppercase tracking-wide bg-gray-100 text-gray-600 flex-shrink-0 ml-2">{review.channel}</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
              <h5 className="font-medium text-gray-900 text-sm truncate">{review.propertyName}</h5>
              <Badge variant="outline" className="text-xs flex-shrink-0">{review.category}</Badge>
            </div>

            <blockquote className="text-sm leading-relaxed mb-4 italic text-gray-600 break-words">"{review.comment}"</blockquote>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(review.submittedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{review.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-4 border-t border-gray-100">
              <Button variant="outline" size="sm" onClick={() => onReviewToggle(review.id, !review.isPublic)} className="flex-1 min-w-0">
                {review.isPublic ? <Eye className="h-4 w-4 mr-1 flex-shrink-0" /> : <EyeOff className="h-4 w-4 mr-1 flex-shrink-0" />}
                <span className="truncate">{review.isPublic ? "Public" : "Private"}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => onReviewApprove(review.id, !review.isApproved)} className="flex-1 min-w-0">
                {review.isApproved ? <CheckCircle className="h-4 w-4 mr-1 flex-shrink-0" /> : <XCircle className="h-4 w-4 mr-1 flex-shrink-0" />}
                <span className="truncate">{review.isApproved ? "Approved" : "Pending"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
