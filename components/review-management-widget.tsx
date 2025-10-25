"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CheckCircle,
    XCircle,
    Eye,
    Star,
    Clock,
    MessageSquare,
    Filter,
    ArrowRight,
    User,
    Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { NormalizedReview } from "@/types/review";

interface ReviewManagementWidgetProps {
    reviews: NormalizedReview[];
    onReviewApproval?: (
        reviewId: number,
        approved: boolean,
        notes?: string
    ) => Promise<boolean>;
}

export function ReviewManagementWidget({
    reviews,
    onReviewApproval,
}: ReviewManagementWidgetProps) {
    const [filterStatus, setFilterStatus] = useState<string>("pending");
    const [selectedReview, setSelectedReview] =
        useState<NormalizedReview | null>(null);
    const [managerNotes, setManagerNotes] = useState("");
    const [isApproving, setIsApproving] = useState(false);

    // Filter reviews based on status
    const filteredReviews = reviews.filter((review) => {
        switch (filterStatus) {
            case "pending":
                return !review.isApproved && review.status === "pending";
            case "approved":
                return review.isApproved;
            case "rejected":
                return review.status === "rejected";
            case "low-rated":
                return review.overallRating < 4.0;
            case "recent":
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return review.submittedAt >= sevenDaysAgo;
            default:
                return true;
        }
    });

    const handleApproval = async (
        review: NormalizedReview,
        approved: boolean
    ) => {
        if (!onReviewApproval) return;

        setIsApproving(true);
        try {
            const success = await onReviewApproval(
                review.id,
                approved,
                managerNotes
            );
            if (success) {
                setSelectedReview(null);
                setManagerNotes("");
            }
        } catch (error) {
            console.error("Error approving review:", error);
        } finally {
            setIsApproving(false);
        }
    };

    const getStatusColor = (review: NormalizedReview) => {
        if (review.isApproved) return "bg-green-100 text-green-800";
        if (review.status === "rejected") return "bg-red-100 text-red-800";
        return "bg-yellow-100 text-yellow-800";
    };

    const getStatusLabel = (review: NormalizedReview) => {
        if (review.isApproved) return "Approved";
        if (review.status === "rejected") return "Rejected";
        return "Pending";
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-3 w-3 ${
                            i < Math.floor(rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                        }`}
                    />
                ))}
                <span className="ml-1 text-sm font-medium">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
            Math.ceil((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
            "day"
        );
    };

    const pendingCount = reviews.filter(
        (r) => !r.isApproved && r.status === "pending"
    ).length;
    const approvedCount = reviews.filter((r) => r.isApproved).length;
    const rejectedCount = reviews.filter((r) => r.status === "rejected").length;
    const lowRatedCount = reviews.filter((r) => r.overallRating < 4.0).length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">
                            Review Management
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                            Approve reviews for public display
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/reviews">
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View All
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-700">
                            {pendingCount}
                        </div>
                        <div className="text-xs text-yellow-600">Pending</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-700">
                            {approvedCount}
                        </div>
                        <div className="text-xs text-green-600">Approved</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-700">
                            {rejectedCount}
                        </div>
                        <div className="text-xs text-red-600">Rejected</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-700">
                            {lowRatedCount}
                        </div>
                        <div className="text-xs text-orange-600">Low Rated</div>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">
                                Pending Reviews ({pendingCount})
                            </SelectItem>
                            <SelectItem value="approved">
                                Approved ({approvedCount})
                            </SelectItem>
                            <SelectItem value="rejected">
                                Rejected ({rejectedCount})
                            </SelectItem>
                            <SelectItem value="low-rated">
                                Low Rated ({lowRatedCount})
                            </SelectItem>
                            <SelectItem value="recent">
                                Recent (7 days)
                            </SelectItem>
                            <SelectItem value="all">All Reviews</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Reviews List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredReviews.slice(0, 5).map((review) => (
                        <div
                            key={review.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="relative w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-sm truncate">
                                                {review.guestName}
                                            </h4>
                                            <Badge
                                                className={`text-xs ${getStatusColor(
                                                    review
                                                )}`}
                                            >
                                                {getStatusLabel(review)}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-1">
                                            {review.listingName}
                                        </p>
                                        <div className="flex items-center gap-2 mb-2">
                                            {renderStars(review.overallRating)}
                                            <span className="text-xs text-gray-500">
                                                {formatDate(review.submittedAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 line-clamp-2">
                                            {review.review}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                    {!review.isApproved &&
                                        review.status === "published" && (
                                            <>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setSelectedReview(
                                                                    review
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Review Details
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        {selectedReview && (
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="text-sm font-medium text-gray-700">
                                                                            Guest
                                                                        </label>
                                                                        <p className="text-sm">
                                                                            {
                                                                                selectedReview.guestName
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-sm font-medium text-gray-700">
                                                                            Property
                                                                        </label>
                                                                        <p className="text-sm">
                                                                            {
                                                                                selectedReview.listingName
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-sm font-medium text-gray-700">
                                                                            Rating
                                                                        </label>
                                                                        <div className="mt-1">
                                                                            {renderStars(
                                                                                selectedReview.overallRating
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-sm font-medium text-gray-700">
                                                                            Date
                                                                        </label>
                                                                        <p className="text-sm">
                                                                            {selectedReview.submittedAt.toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <label className="text-sm font-medium text-gray-700">
                                                                        Review
                                                                    </label>
                                                                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">
                                                                        {
                                                                            selectedReview.review
                                                                        }
                                                                    </p>
                                                                </div>

                                                                {Object.keys(
                                                                    selectedReview.categories
                                                                ).length >
                                                                    0 && (
                                                                    <div>
                                                                        <label className="text-sm font-medium text-gray-700">
                                                                            Category
                                                                            Scores
                                                                        </label>
                                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                                            {Object.entries(
                                                                                selectedReview.categories
                                                                            ).map(
                                                                                ([
                                                                                    category,
                                                                                    score,
                                                                                ]) => {
                                                                                    if (
                                                                                        !score
                                                                                    )
                                                                                        return null;
                                                                                    return (
                                                                                        <div
                                                                                            key={
                                                                                                category
                                                                                            }
                                                                                            className="flex justify-between text-sm"
                                                                                        >
                                                                                            <span className="capitalize text-gray-600">
                                                                                                {category.replace(
                                                                                                    "_",
                                                                                                    " "
                                                                                                )}
                                                                                            </span>
                                                                                            <span className="font-medium">
                                                                                                {score.toFixed(
                                                                                                    1
                                                                                                )}
                                                                                            </span>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <label className="text-sm font-medium text-gray-700">
                                                                        Manager
                                                                        Notes
                                                                        (Optional)
                                                                    </label>
                                                                    <Textarea
                                                                        value={
                                                                            managerNotes
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setManagerNotes(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="Add notes about this review..."
                                                                        className="mt-1"
                                                                        rows={3}
                                                                    />
                                                                </div>

                                                                <div className="flex items-center gap-3 pt-4 border-t">
                                                                    <Button
                                                                        onClick={() =>
                                                                            handleApproval(
                                                                                selectedReview,
                                                                                true
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isApproving
                                                                        }
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        onClick={() =>
                                                                            handleApproval(
                                                                                selectedReview,
                                                                                false
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isApproving
                                                                        }
                                                                    >
                                                                        <XCircle className="h-4 w-4 mr-2" />
                                                                        Reject
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            setSelectedReview(
                                                                                null
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isApproving
                                                                        }
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                            </>
                                        )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredReviews.length === 0 && (
                    <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                            {filterStatus === "pending"
                                ? "No pending reviews. Great job staying on top of things!"
                                : "No reviews found for the selected filter."}
                        </p>
                    </div>
                )}

                {filteredReviews.length > 5 && (
                    <div className="text-center pt-3 border-t">
                        <Link
                            href={`/dashboard/reviews?status=${filterStatus}`}
                        >
                            <Button variant="outline" size="sm">
                                View All {filteredReviews.length} Reviews
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
