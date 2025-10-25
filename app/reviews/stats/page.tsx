"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import type { ReviewData } from "../../../types/dashboard";

export const dynamic = 'force-dynamic';

interface ReviewsStatsProps {
 reviews: ReviewData[];
}

export default function ReviewsStats({ reviews = [] }: ReviewsStatsProps) {
 const totalReviews = reviews?.length || 0;
 const approvedReviews = reviews?.filter(r => r.isApproved)?.length || 0;
 const pendingReviews = reviews?.filter(r => !r.isApproved)?.length || 0;
 const publicReviews = reviews?.filter(r => r.isPublic)?.length || 0;

 return (
  <Card className="bg-white">
   <CardHeader>
    <CardTitle className="flex items-center gap-2">
     <MessageSquare className="h-5 w-5 text-blue-600" />
     Review Statistics
    </CardTitle>
   </CardHeader>
   <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
     <div className="text-center">
      <div className="text-2xl font-bold text-gray-900">{totalReviews}</div>
      <div className="text-sm text-gray-600">Total Reviews</div>
     </div>
     <div className="text-center">
      <div className="text-2xl font-bold text-green-600">{approvedReviews}</div>
      <div className="text-sm text-gray-600">Approved</div>
     </div>
     <div className="text-center">
      <div className="text-2xl font-bold text-amber-600">{pendingReviews}</div>
      <div className="text-sm text-gray-600">Pending</div>
     </div>
     <div className="text-center">
      <div className="text-2xl font-bold text-blue-600">{publicReviews}</div>
      <div className="text-sm text-gray-600">Public</div>
     </div>
    </div>
   </CardContent>
  </Card>
 );
}
