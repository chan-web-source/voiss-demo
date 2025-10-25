"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, User, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { NormalizedReview } from "@/types/review";

interface PropertyApprovedReviewsProps {
    propertySlug: string;
    propertyName: string;
    maxReviews?: number;
    showPagination?: boolean;
}

export function PropertyApprovedReviews({
    propertySlug,
    propertyName,
    maxReviews = 6,
    showPagination = true,
}: PropertyApprovedReviewsProps) {
    const [reviews, setReviews] = useState<NormalizedReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const reviewsPerPage = 3;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const startIndex = currentPage * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = reviews.slice(startIndex, endIndex);

    useEffect(() => {
        async function fetchApprovedReviews() {
            try {
                setLoading(true);
                setError(null);

                // Fetch approved reviews for this specific property using the new endpoint
                const params = new URLSearchParams();
                if (maxReviews) {
                    params.append("limit", maxReviews.toString());
                }

                const response = await fetch(
                    `/api/properties/${propertySlug}/reviews?${params.toString()}`
                );
                const data = await response.json();

                if (data.success && data.data && Array.isArray(data.data)) {
                    setReviews(data.data);
                } else {
                    setReviews([]);
                }
            } catch (err) {
                console.error("Error fetching approved reviews:", err);
                setError("Failed to load reviews");
                setReviews([]);
            } finally {
                setLoading(false);
            }
        }

        fetchApprovedReviews();
    }, [propertySlug, maxReviews]);

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
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : i < rating
                        ? "text-yellow-400 fill-current opacity-50"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    // Don't render the section if there are no approved reviews
    if (!loading && reviews.length === 0) {
        return null;
    }

    if (loading) {
        return (
            <section className="py-16" style={{ backgroundColor: "#FFFDF6" }}>
                <div className="container mx-auto px-4">
                    <h2
                        className="text-3xl font-bold text-center mb-12"
                        style={{ color: "#333333" }}
                    >
                        Guest Reviews
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }, (_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16" style={{ backgroundColor: "#FFFDF6" }}>
                <div className="container mx-auto px-4">
                    <h2
                        className="text-3xl font-bold text-center mb-12"
                        style={{ color: "#333333" }}
                    >
                        Guest Reviews
                    </h2>
                    <div className="text-center" style={{ color: "#5C5C5A" }}>
                        <p>{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="py-16"
            style={{ backgroundColor: "#FFFDF6" }}
            id="reviews"
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1"></div>
                        <h2
                            className="text-3xl font-bold"
                            style={{ color: "#333333" }}
                        >
                            Guest Reviews
                        </h2>
                        <div className="flex-1 flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-2 hover:bg-gray-50 transition-colors"
                                style={{
                                    borderColor: "#284E4C",
                                    color: "#284E4C",
                                    minWidth: "120px",
                                }}
                                onClick={() =>
                                    window.open(
                                        `/property/${propertySlug}/reviews`,
                                        "_blank"
                                    )
                                }
                            >
                                Manage Reviews
                            </Button>
                        </div>
                    </div>
                    <p
                        className="max-w-2xl mx-auto"
                        style={{ color: "#5C5C5A" }}
                    >
                        See what our guests have to say about their experience
                        at {propertyName}
                    </p>
                    <div className="flex items-center justify-center mt-4">
                        <div className="flex items-center space-x-2">
                            {renderStars(
                                reviews.reduce(
                                    (acc, review) => acc + review.overallRating,
                                    0
                                ) / reviews.length
                            )}
                            <span
                                className="text-lg font-semibold"
                                style={{ color: "#333333" }}
                            >
                                {(
                                    reviews.reduce(
                                        (acc, review) =>
                                            acc + review.overallRating,
                                        0
                                    ) / reviews.length
                                ).toFixed(1)}
                            </span>
                            <span style={{ color: "#5C5C5A" }}>
                                ({reviews.length} review
                                {reviews.length !== 1 ? "s" : ""})
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentReviews.map((review) => (
                        <Card
                            key={review.id}
                            className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden"
                        >
                            <CardContent className="p-6">
                                {/* Header with rating and guest name */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{
                                                backgroundColor: "#284E4C",
                                            }}
                                        >
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4
                                                className="font-semibold"
                                                style={{ color: "#333333" }}
                                            >
                                                {review.guestName}
                                            </h4>
                                            <div className="flex items-center space-x-1">
                                                {renderStars(
                                                    review.overallRating
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="text-xs px-2 py-1 rounded-full uppercase tracking-wide"
                                        style={{
                                            color: "#5C5C5A",
                                            backgroundColor: "#F5F5F5",
                                        }}
                                    >
                                        {review.channel}
                                    </div>
                                </div>

                                {/* Review text */}
                                <blockquote
                                    className="text-sm leading-relaxed mb-4 italic"
                                    style={{ color: "#5C5C5A" }}
                                >
                                    "{review.review}"
                                </blockquote>

                                {/* Date and additional info */}
                                <div
                                    className="flex items-center justify-between text-xs"
                                    style={{ color: "#5C5C5A" }}
                                >
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            {formatDate(review.submittedAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                        <span>
                                            {review.overallRating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Category ratings (if available) */}
                                {review.categories &&
                                    Object.values(review.categories).some(
                                        (val) => val !== undefined
                                    ) && (
                                        <div
                                            className="mt-4 pt-4 border-t"
                                            style={{ borderColor: "#F5F5F5" }}
                                        >
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {review.categories
                                                    .cleanliness && (
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            style={{
                                                                color: "#5C5C5A",
                                                            }}
                                                        >
                                                            Cleanliness
                                                        </span>
                                                        <span
                                                            className="font-medium"
                                                            style={{
                                                                color: "#333333",
                                                            }}
                                                        >
                                                            {review.categories.cleanliness.toFixed(
                                                                1
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                {review.categories
                                                    .communication && (
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            style={{
                                                                color: "#5C5C5A",
                                                            }}
                                                        >
                                                            Communication
                                                        </span>
                                                        <span
                                                            className="font-medium"
                                                            style={{
                                                                color: "#333333",
                                                            }}
                                                        >
                                                            {review.categories.communication.toFixed(
                                                                1
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                {review.categories.location && (
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            style={{
                                                                color: "#5C5C5A",
                                                            }}
                                                        >
                                                            Location
                                                        </span>
                                                        <span
                                                            className="font-medium"
                                                            style={{
                                                                color: "#333333",
                                                            }}
                                                        >
                                                            {review.categories.location.toFixed(
                                                                1
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                {review.categories.value && (
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            style={{
                                                                color: "#5C5C5A",
                                                            }}
                                                        >
                                                            Value
                                                        </span>
                                                        <span
                                                            className="font-medium"
                                                            style={{
                                                                color: "#333333",
                                                            }}
                                                        >
                                                            {review.categories.value.toFixed(
                                                                1
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            className="flex items-center space-x-2"
                            style={{ borderColor: "#284E4C", color: "#284E4C" }}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </Button>

                        <div className="flex items-center space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                                        currentPage === i
                                            ? "text-white shadow-lg"
                                            : "bg-white hover:bg-gray-100 border"
                                    }`}
                                    style={
                                        currentPage === i
                                            ? { backgroundColor: "#284E4C" }
                                            : {
                                                  color: "#5C5C5A",
                                                  borderColor: "#284E4C",
                                              }
                                    }
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextPage}
                            disabled={currentPage === totalPages - 1}
                            className="flex items-center space-x-2"
                            style={{ borderColor: "#284E4C", color: "#284E4C" }}
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
