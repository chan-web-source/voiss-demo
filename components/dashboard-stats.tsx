"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import type { NormalizedReview } from "@/types/review";

interface DashboardStatsProps {
    reviews: NormalizedReview[];
}

export function DashboardStats({ reviews }: DashboardStatsProps) {
    const totalReviews = reviews.length;
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.overallRating, 0) /
              reviews.length
            : 0;

    const approvedReviews = reviews.filter(
        (review) => review.isApproved
    ).length;
    const pendingReviews = reviews.filter(
        (review) => !review.isApproved && review.status === "pending"
    ).length;
    const lowRatingReviews = reviews.filter(
        (review) => review.overallRating < 7
    ).length;

    const propertyStats = reviews.reduce((acc, review) => {
        const property = review.listingName;
        if (!acc[property]) {
            acc[property] = { count: 0, totalRating: 0, averageRating: 0 };
        }
        acc[property].count++;
        acc[property].totalRating += review.overallRating;
        acc[property].averageRating =
            acc[property].totalRating / acc[property].count;
        return acc;
    }, {} as Record<string, { count: number; totalRating: number; averageRating: number }>);

    const topProperty = Object.entries(propertyStats).sort(
        ([, a], [, b]) => b.averageRating - a.averageRating
    )[0];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                }`}
            />
        ));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#020817]">
                        Total Reviews
                    </CardTitle>
                    <Star className="h-4 w-4 text-[#4B5563]" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-[#020817]">
                        {totalReviews}
                    </div>
                    <p className="text-xs text-[#4B5563]">
                        {approvedReviews} approved for display
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#020817]">
                        Average Rating
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-[#4B5563]" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[#020817]">
                            {averageRating.toFixed(1)}
                        </span>
                        <div className="flex">{renderStars(averageRating)}</div>
                    </div>
                    <p className="text-xs text-[#4B5563]">
                        ({totalReviews} reviews)
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#020817]">
                        Pending Reviews
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-[#4B5563]" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-[#020817]">
                        {pendingReviews}
                    </div>
                    <p className="text-xs text-[#4B5563]">
                        Require manager approval
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#020817]">
                        Top Property
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-[#4B5563]" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {topProperty ? (
                            <>
                                <div className="text-sm font-medium truncate text-[#020817]">
                                    {topProperty[0]}
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-lg font-bold text-[#020817]">
                                        {topProperty[1].averageRating.toFixed(
                                            1
                                        )}
                                    </span>
                                    <div className="flex">
                                        {renderStars(
                                            topProperty[1].averageRating
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-[#4B5563]">
                                    {topProperty[1].count} reviews
                                </p>
                            </>
                        ) : (
                            <div className="text-sm text-[#4B5563]">
                                No data
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {lowRatingReviews > 0 && (
                <Card className="md:col-span-2 lg:col-span-4 border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Attention Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-orange-700">
                            {lowRatingReviews} reviews have ratings below 7/10.
                            Consider reviewing these for potential issues.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
