"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Star,
    User,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    MessageSquare,
    Globe,
    Clock,
    Filter,
    RefreshCw,
} from "lucide-react";
import type { NormalizedReview } from "@/types/review";

interface PropertyReviewManagementProps {
    propertySlug: string;
    propertyName: string;
    showApprovalActions?: boolean;
}

type ReviewStatus = "all" | "approved" | "pending" | "rejected";

// Helper function to normalize status values for consistent comparison
const normalizeStatus = (status: string): string => {
    return status.toLowerCase();
};

export function PropertyReviewManagement({
    propertySlug,
    propertyName,
    showApprovalActions = true,
}: PropertyReviewManagementProps) {
    const [reviews, setReviews] = useState<NormalizedReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<ReviewStatus>("all");
    const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

    const reviewsPerPage = 6;

    // Filter reviews based on status
    const filteredReviews = reviews.filter((review) => {
        if (statusFilter === "all") return true;
        const reviewStatus = normalizeStatus(review.status);
        if (statusFilter === "approved")
            return review.isApproved && reviewStatus === "published";
        if (statusFilter === "pending")
            return !review.isApproved && reviewStatus === "pending";
        if (statusFilter === "rejected") return reviewStatus === "rejected";
        return true;
    });

    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
    const startIndex = currentPage * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = filteredReviews.slice(startIndex, endIndex);

    useEffect(() => {
        fetchAllReviews();
    }, [propertySlug]);

    useEffect(() => {
        setCurrentPage(0); // Reset to first page when filter changes
    }, [statusFilter]);

    const fetchAllReviews = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch ALL reviews for this property (not just approved)
            const response = await fetch(
                `/api/properties/${propertySlug}/reviews/all`
            );
            const data = await response.json();

            if (data.success && data.data && Array.isArray(data.data)) {
                setReviews(data.data);
            } else {
                setReviews([]);
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError("Failed to load reviews");
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveReview = async (reviewId: number) => {
        setProcessingIds((prev) => new Set(prev).add(reviewId));

        try {
            const response = await fetch(`/api/reviews/${reviewId}/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    approved: true,
                    updatedBy: "admin",
                }),
            });

            if (response.ok) {
                // Update the review in local state
                setReviews((prev) =>
                    prev.map((review) =>
                        review.id === reviewId
                            ? {
                                  ...review,
                                  isApproved: true,
                                  status: "PUBLISHED" as const,
                              }
                            : review
                    )
                );
            } else {
                throw new Error("Failed to approve review");
            }
        } catch (err) {
            console.error("Error approving review:", err);
            setError("Failed to approve review");
        } finally {
            setProcessingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(reviewId);
                return newSet;
            });
        }
    };

    const handleRejectReview = async (reviewId: number) => {
        setProcessingIds((prev) => new Set(prev).add(reviewId));

        try {
            const response = await fetch(`/api/reviews/${reviewId}/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    approved: false,
                    updatedBy: "admin",
                }),
            });

            if (response.ok) {
                // Update the review in local state
                setReviews((prev) =>
                    prev.map((review) =>
                        review.id === reviewId
                            ? {
                                  ...review,
                                  isApproved: false,
                                  status: "REJECTED" as const,
                              }
                            : review
                    )
                );
            } else {
                throw new Error("Failed to reject review");
            }
        } catch (err) {
            console.error("Error rejecting review:", err);
            setError("Failed to reject review");
        } finally {
            setProcessingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(reviewId);
                return newSet;
            });
        }
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
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

    const getStatusBadge = (review: NormalizedReview) => {
        const reviewStatus = normalizeStatus(review.status);
        if (review.isApproved && reviewStatus === "published") {
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Approved
                </Badge>
            );
        } else if (reviewStatus === "rejected") {
            return (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    Rejected
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    Pending
                </Badge>
            );
        }
    };

    const getStatusCounts = () => {
        const approved = reviews.filter(
            (r) => r.isApproved && normalizeStatus(r.status) === "published"
        ).length;
        const pending = reviews.filter(
            (r) => !r.isApproved && normalizeStatus(r.status) === "pending"
        ).length;
        const rejected = reviews.filter(
            (r) => normalizeStatus(r.status) === "rejected"
        ).length;

        return { approved, pending, rejected, total: reviews.length };
    };

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    if (loading) {
        return (
            <section className="py-8" style={{ backgroundColor: "#FFFDF6" }}>
                <div className="container mx-auto px-4">
                    <Card className="bg-white">
                        <CardContent className="p-6">
                            <div className="text-center py-8">
                                <RefreshCw
                                    className="h-8 w-8 animate-spin mx-auto mb-4"
                                    style={{ color: "#5C5C5A" }}
                                />
                                <h3
                                    className="text-lg font-medium mb-2"
                                    style={{ color: "#333333" }}
                                >
                                    Loading Reviews
                                </h3>
                                <p style={{ color: "#5C5C5A" }}>
                                    Fetching review data...
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        );
    }

    if (reviews.length === 0) {
        return (
            <section className="py-8" style={{ backgroundColor: "#FFFDF6" }}>
                <div className="container mx-auto px-4">
                    <Card className="bg-white">
                        <CardContent className="p-6">
                            <div className="text-center py-8">
                                <MessageSquare
                                    className="h-12 w-12 mx-auto mb-4"
                                    style={{ color: "#5C5C5A" }}
                                />
                                <h3
                                    className="text-lg font-medium mb-2"
                                    style={{ color: "#333333" }}
                                >
                                    No Reviews Yet
                                </h3>
                                <p
                                    className="mb-4"
                                    style={{ color: "#5C5C5A" }}
                                >
                                    This property hasn't received any reviews
                                    yet
                                </p>
                                <Button
                                    onClick={fetchAllReviews}
                                    className="flex items-center gap-2"
                                    style={{
                                        backgroundColor: "#284E4C",
                                        color: "white",
                                    }}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Refresh Reviews
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        );
    }

    const statusCounts = getStatusCounts();

    return (
        <section className="py-8" style={{ backgroundColor: "#FFFDF6" }}>
            <div className="container mx-auto px-4">
                <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <MessageSquare
                                    className="h-6 w-6"
                                    style={{ color: "#284E4C" }}
                                />
                                <div>
                                    <h3
                                        className="text-xl font-semibold"
                                        style={{ color: "#333333" }}
                                    >
                                        Review Management
                                    </h3>
                                    <p style={{ color: "#5C5C5A" }}>
                                        Manage reviews for {propertyName}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={fetchAllReviews}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                style={{
                                    borderColor: "#284E4C",
                                    color: "#284E4C",
                                }}
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </Button>
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[
                                {
                                    key: "all",
                                    label: "All",
                                    count: statusCounts.total,
                                },
                                {
                                    key: "approved",
                                    label: "Approved",
                                    count: statusCounts.approved,
                                },
                                {
                                    key: "pending",
                                    label: "Pending",
                                    count: statusCounts.pending,
                                },
                                {
                                    key: "rejected",
                                    label: "Rejected",
                                    count: statusCounts.rejected,
                                },
                            ].map(({ key, label, count }) => (
                                <Button
                                    key={key}
                                    onClick={() =>
                                        setStatusFilter(key as ReviewStatus)
                                    }
                                    variant={
                                        statusFilter === key
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    className="flex items-center gap-1"
                                    style={
                                        statusFilter === key
                                            ? {
                                                  backgroundColor: "#284E4C",
                                                  color: "white",
                                              }
                                            : {
                                                  borderColor: "#284E4C",
                                                  color: "#284E4C",
                                              }
                                    }
                                >
                                    <Filter className="h-3 w-3" />
                                    {label} ({count})
                                </Button>
                            ))}
                        </div>

                        {/* Reviews Grid */}
                        {filteredReviews.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare
                                    className="h-8 w-8 mx-auto mb-4"
                                    style={{ color: "#5C5C5A" }}
                                />
                                <p style={{ color: "#5C5C5A" }}>
                                    No reviews found for the selected filter
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {currentReviews.map((review) => (
                                        <Card
                                            key={review.id}
                                            className="border shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <CardContent className="p-4">
                                                {/* Review Header */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className="w-8 h-8 rounded-full flex items-center justify-center"
                                                            style={{
                                                                backgroundColor:
                                                                    "#284E4C",
                                                            }}
                                                        >
                                                            <User className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <h4
                                                                className="font-medium text-sm"
                                                                style={{
                                                                    color: "#333333",
                                                                }}
                                                            >
                                                                {
                                                                    review.guestName
                                                                }
                                                            </h4>
                                                            <div className="flex items-center space-x-1">
                                                                {renderStars(
                                                                    review.overallRating
                                                                )}
                                                                <span
                                                                    className="text-xs ml-1"
                                                                    style={{
                                                                        color: "#5C5C5A",
                                                                    }}
                                                                >
                                                                    {review.overallRating.toFixed(
                                                                        1
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        {getStatusBadge(review)}
                                                        <span
                                                            className="text-xs"
                                                            style={{
                                                                color: "#5C5C5A",
                                                            }}
                                                        >
                                                            {review.channel.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Review Text */}
                                                <blockquote
                                                    className="text-sm mb-3 italic"
                                                    style={{ color: "#5C5C5A" }}
                                                >
                                                    "
                                                    {review.review.length > 120
                                                        ? review.review.substring(
                                                              0,
                                                              120
                                                          ) + "..."
                                                        : review.review}
                                                    "
                                                </blockquote>

                                                {/* Date and Actions */}
                                                <div className="flex items-center justify-between">
                                                    <div
                                                        className="flex items-center text-xs gap-1"
                                                        style={{
                                                            color: "#5C5C5A",
                                                        }}
                                                    >
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(
                                                            review.submittedAt
                                                        )}
                                                    </div>

                                                    {showApprovalActions && (
                                                        <div className="flex gap-2">
                                                            {(!review.isApproved ||
                                                                normalizeStatus(
                                                                    review.status
                                                                ) !==
                                                                    "published") && (
                                                                <Button
                                                                    onClick={() =>
                                                                        handleApproveReview(
                                                                            review.id
                                                                        )
                                                                    }
                                                                    disabled={processingIds.has(
                                                                        review.id
                                                                    )}
                                                                    size="sm"
                                                                    className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white"
                                                                >
                                                                    <Check className="w-3 h-3" />
                                                                </Button>
                                                            )}
                                                            {normalizeStatus(
                                                                review.status
                                                            ) !==
                                                                "rejected" && (
                                                                <Button
                                                                    onClick={() =>
                                                                        handleRejectReview(
                                                                            review.id
                                                                        )
                                                                    }
                                                                    disabled={processingIds.has(
                                                                        review.id
                                                                    )}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 px-3 border-red-300 text-red-600 hover:bg-red-50"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4">
                                        <Button
                                            onClick={prevPage}
                                            disabled={currentPage === 0}
                                            variant="outline"
                                            size="sm"
                                            style={{
                                                borderColor: "#284E4C",
                                                color: "#284E4C",
                                            }}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </Button>

                                        <span
                                            className="text-sm"
                                            style={{ color: "#5C5C5A" }}
                                        >
                                            Page {currentPage + 1} of{" "}
                                            {totalPages}
                                        </span>

                                        <Button
                                            onClick={nextPage}
                                            disabled={
                                                currentPage === totalPages - 1
                                            }
                                            variant="outline"
                                            size="sm"
                                            style={{
                                                borderColor: "#284E4C",
                                                color: "#284E4C",
                                            }}
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Quick Actions */}
                        <div className="mt-6 pt-6 border-t flex justify-center">
                            <Button
                                className="flex items-center gap-2"
                                style={{
                                    backgroundColor: "#284E4C",
                                    color: "white",
                                }}
                            >
                                <Globe className="h-4 w-4" />
                                View Public Reviews
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
