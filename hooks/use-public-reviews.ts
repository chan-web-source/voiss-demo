"use client";

import { useState, useEffect, useCallback } from "react";
import type { NormalizedReview } from "@/types/review";

interface PublicReviewFilters {
    search?: string;
    property?: string;
    rating?: string;
    channel?: string;
    public?: string;
}

interface UsePublicReviewsReturn {
    reviews: NormalizedReview[];
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    stats: {
        total: number;
        displayed: number;
        hidden: number;
        averageRating: number;
    };
    properties: string[];
    channels: string[];
    refreshReviews: () => Promise<void>;
    updateReviewVisibility: (
        reviewIds: number[],
        isPubliclyDisplayed: boolean
    ) => Promise<boolean>;
    fetchReviews: (filters?: PublicReviewFilters) => Promise<void>;
}

export function usePublicReviews(
    initialFilters?: PublicReviewFilters
): UsePublicReviewsReturn {
    const [reviews, setReviews] = useState<NormalizedReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch reviews from the API
    const fetchReviews = useCallback(async (filters?: PublicReviewFilters) => {
        try {
            setError(null);
            const params = new URLSearchParams();

            if (filters?.search) params.append("search", filters.search);
            if (filters?.property && filters.property !== "all")
                params.append("property", filters.property);
            if (filters?.rating && filters.rating !== "all")
                params.append("rating", filters.rating);
            if (filters?.channel && filters.channel !== "all")
                params.append("channel", filters.channel);
            if (filters?.public) params.append("public", filters.public);

            const response = await fetch(
                `/api/reviews/public-visibility?${params.toString()}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch reviews");
            }

            if (data.success) {
                // Ensure dates are properly parsed
                const processedReviews = data.data.map((review: any) => ({
                    ...review,
                    submittedAt: new Date(review.submittedAt),
                }));
                setReviews(processedReviews);
            } else {
                throw new Error(data.error || "Failed to fetch reviews");
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError(err instanceof Error ? err.message : "Unknown error");

            // Fallback to empty array on error
            setReviews([]);
        }
    }, []);

    // Refresh reviews (with loading state)
    const refreshReviews = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchReviews(initialFilters);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, [fetchReviews, initialFilters]);

    // Update review public visibility
    const updateReviewVisibility = useCallback(
        async (
            reviewIds: number[],
            isPubliclyDisplayed: boolean
        ): Promise<boolean> => {
            try {
                const response = await fetch("/api/reviews/public-visibility", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reviewIds,
                        isPubliclyDisplayed,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to update review visibility"
                    );
                }

                if (data.success) {
                    // Update local state
                    setReviews((prevReviews) =>
                        prevReviews.map((review) =>
                            reviewIds.includes(review.id)
                                ? { ...review, isApproved: isPubliclyDisplayed }
                                : review
                        )
                    );
                    return true;
                } else {
                    throw new Error(
                        data.error || "Failed to update review visibility"
                    );
                }
            } catch (err) {
                console.error("Error updating review visibility:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to update review visibility"
                );
                return false;
            }
        },
        []
    );

    // Calculate stats
    const stats = {
        total: reviews.length,
        displayed: reviews.filter((r) => r.isApproved).length,
        hidden: reviews.filter((r) => !r.isApproved).length,
        averageRating:
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.overallRating, 0) /
                  reviews.length
                : 0,
    };

    // Get unique properties
    const properties = [...new Set(reviews.map((r) => r.listingName))];

    // Get unique channels
    const channels = [...new Set(reviews.map((r) => r.channel))];

    // Initial load
    useEffect(() => {
        refreshReviews();
    }, [refreshReviews]);

    return {
        reviews,
        loading,
        error,
        refreshing,
        stats,
        properties,
        channels,
        refreshReviews,
        updateReviewVisibility,
        fetchReviews,
    };
}
