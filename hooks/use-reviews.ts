"use client";

import { useState, useEffect } from "react";
import type { NormalizedReview, ReviewFilters } from "@/types/review";

interface UseReviewsOptions {
    useDemo?: boolean;
}

export function useReviews(
    filters?: ReviewFilters,
    options?: UseReviewsOptions
) {
    const [reviews, setReviews] = useState<NormalizedReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReviews() {
            try {
                setLoading(true);
                const params = new URLSearchParams();

                if (filters?.rating)
                    params.append("rating", filters.rating.toString());
                if (filters?.category)
                    params.append("category", filters.category);
                if (filters?.channel) params.append("channel", filters.channel);
                if (filters?.status) params.append("status", filters.status);
                if (filters?.listing) params.append("listing", filters.listing);

                // Use demo data if specified or if real data fails
                const endpoint = options?.useDemo
                    ? "/api/reviews/demo"
                    : "/api/reviews";
                let response = await fetch(`${endpoint}?${params.toString()}`);
                let data = await response.json();

                // Fallback to demo data if real data fails
                if (!data.success && !options?.useDemo) {
                    console.warn("Real data failed, falling back to demo data");
                    response = await fetch(
                        `/api/reviews/demo?${params.toString()}`
                    );
                    data = await response.json();
                }

                if (data.success) {
                    // Ensure dates are properly parsed
                    const processedReviews = data.data.map((review: any) => ({
                        ...review,
                        submittedAt: new Date(review.submittedAt),
                    }));
                    setReviews(processedReviews);
                    setError(null);
                } else {
                    setError(data.error || "Failed to fetch reviews");
                }
            } catch (err) {
                console.warn("Error fetching reviews, using demo data:", err);
                // Fallback to demo data on any error
                try {
                    const response = await fetch(`/api/reviews/demo`);
                    const data = await response.json();
                    if (data.success) {
                        const processedReviews = data.data.map(
                            (review: any) => ({
                                ...review,
                                submittedAt: new Date(review.submittedAt),
                            })
                        );
                        setReviews(processedReviews);
                        setError(null);
                    } else {
                        setError("Failed to fetch any review data");
                    }
                } catch (demoErr) {
                    setError("Failed to fetch review data");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, [filters, options?.useDemo]);

    const approveReview = async (
        reviewId: number,
        approved: boolean,
        managerNotes?: string
    ) => {
        try {
            const response = await fetch(`/api/reviews/${reviewId}/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ approved, managerNotes }),
            });

            const data = await response.json();

            if (data.success) {
                // Update local state
                setReviews((prev) =>
                    prev.map((review) =>
                        review.id === reviewId
                            ? { ...review, isApproved: approved, managerNotes }
                            : review
                    )
                );
                return true;
            } else {
                setError(data.error || "Failed to update review");
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            return false;
        }
    };

    return {
        reviews,
        loading,
        error,
        approveReview,
    };
}
