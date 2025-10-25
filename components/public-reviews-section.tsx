"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Star,
    ChevronLeft,
    ChevronRight,
    User,
    Calendar,
    MapPin,
} from "lucide-react";
import type { NormalizedReview } from "@/types/review";

interface PublicReviewsSectionProps {
    propertyName?: string;
    maxReviews?: number;
    refreshInterval?: number; // Optional auto-refresh interval in milliseconds
}

export function PublicReviewsSection({
    propertyName,
    maxReviews = 6,
    refreshInterval = 30000, // Auto-refresh every 30 seconds by default
}: PublicReviewsSectionProps) {
    const [reviews, setReviews] = useState<NormalizedReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        async function fetchApprovedReviews() {
            try {
                // DYNAMIC APPROACH: Fetch from REAL database first
                // This automatically reflects current status changes in real-time
                const params = new URLSearchParams({
                    status: "approved", // Only get truly approved and published reviews
                });

                if (propertyName) {
                    params.append("listing", propertyName);
                }

                let response = await fetch(`/api/reviews?${params.toString()}`);
                let data = await response.json();

                if (data.success && data.data.length > 0) {
                    // Use real database data - automatically excludes rejected reviews
                    console.log(
                        `✅ Using LIVE database data: ${data.data.length} approved reviews`
                    );
                    setReviews(data.data.slice(0, maxReviews));
                } else {
                    // Only fallback to demo data if no real data exists
                    console.log(
                        "📝 No real data found, falling back to demo data"
                    );
                    response = await fetch(`/api/reviews/demo`);
                    data = await response.json();

                    if (data.success) {
                        // Filter demo data for approved reviews only
                        const approvedReviews = data.data.filter(
                            (review: NormalizedReview) =>
                                review.isApproved === true &&
                                review.status === "published"
                        );

                        const filteredReviews = propertyName
                            ? approvedReviews.filter(
                                (review: NormalizedReview) =>
                                    review.listingName
                                        .toLowerCase()
                                        .includes(propertyName.toLowerCase())
                            )
                            : approvedReviews;

                        setReviews(filteredReviews.slice(0, maxReviews));
                    }
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setReviews([]); // Ensure reviews are cleared on error
            } finally {
                setLoading(false);
            }
        }

        fetchApprovedReviews();

        // Set up auto-refresh if interval is provided
        let intervalId: NodeJS.Timeout | null = null;
        if (refreshInterval && refreshInterval > 0) {
            intervalId = setInterval(fetchApprovedReviews, refreshInterval);
        }

        // Cleanup interval on unmount
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [propertyName, maxReviews, refreshInterval]);

    const renderStars = (rating: number) => {
        const stars = Math.round(rating); // Direct 5-point scale
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < stars
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
            />
        ));
    };

    const reviewsPerPage = 6;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const currentReviews = reviews.slice(
        currentPage * reviewsPerPage,
        (currentPage + 1) * reviewsPerPage
    );

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="text-center mb-12">
                            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
                            <div className="h-6 bg-gray-200 rounded w-32 mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl h-64 shadow-sm"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (reviews.length === 0) {
        return null;
    }

    const averageRating =
        reviews.reduce((sum, review) => sum + review.overallRating, 0) /
        reviews.length;

    return (
        <section id="public-reviews" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                        What Our Guests Say
                        {refreshing && (
                            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        )}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        Real reviews from guests who have stayed at our premium
                        furnished apartments across London
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1">
                            {renderStars(averageRating)}
                            <span className="text-xl font-semibold text-gray-900 ml-2">
                                {averageRating.toFixed(1)}
                            </span>
                        </div>
                        <span className="text-gray-600">
                            · Based on {reviews.length} verified reviews
                        </span>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentReviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            {/* Review Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {review.guestName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">
                                            {review.guestName}
                                        </h3>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            {renderStars(review.overallRating)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(
                                        review.submittedAt
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="mb-4">
                                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                                    "{review.review}"
                                </p>
                            </div>

                            {/* Review Footer */}
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate max-w-[200px]">
                                        {review.listingName.split(" - ")[1] ||
                                            review.listingName}
                                    </span>
                                </div>
                                <div className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                                    {review.channel}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage(Math.max(0, currentPage - 1))
                            }
                            disabled={currentPage === 0}
                            className="h-10 px-4 text-sm bg-white border-gray-200 hover:bg-gray-50"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Button
                                    key={i}
                                    variant={
                                        currentPage === i ? "default" : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setCurrentPage(i)}
                                    className={`h-10 w-10 p-0 text-sm ${currentPage === i
                                            ? "bg-[#284E4C] hover:bg-[#1e3a38] text-white"
                                            : "hover:bg-gray-100"
                                        }`}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage(
                                    Math.min(totalPages - 1, currentPage + 1)
                                )
                            }
                            disabled={currentPage === totalPages - 1}
                            className="h-10 px-4 text-sm bg-white border-gray-200 hover:bg-gray-50"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
