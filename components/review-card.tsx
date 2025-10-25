"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Star,
    Calendar,
    MapPin,
    User,
    MessageSquare,
    Check,
    X,
} from "lucide-react";
import type { NormalizedReview } from "@/types/review";

interface ReviewCardProps {
    review: NormalizedReview;
    onApprove: (
        reviewId: number,
        approved: boolean,
        managerNotes?: string
    ) => Promise<boolean>;
}

export function ReviewCard({ review, onApprove }: ReviewCardProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [managerNotes, setManagerNotes] = useState(review.managerNotes || "");
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState<
        "approve" | "reject" | null
    >(null);

    const handleApproval = async (approved: boolean) => {
        setIsApproving(true);
        const success = await onApprove(review.id, approved, managerNotes);
        setIsApproving(false);
        if (success) {
            setShowApprovalDialog(false);
            setPendingAction(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200";
            case "pending":
                return "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200";
            case "rejected":
                return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200";
            default:
                return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200";
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 ${i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <Card className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardHeader className="relative pb-4 bg-gradient-to-r from-slate-50 via-white to-slate-50">
                <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-lg">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-slate-900 text-lg">
                                        {review.guestName}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-xs border-indigo-200 text-indigo-700 bg-indigo-50 font-medium"
                                    >
                                        {review.channel}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <MapPin className="h-3 w-3" />
                                    <span className="font-medium">
                                        {review.listingName}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {review.submittedAt
                                        ? new Date(
                                            review.submittedAt
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                        : "Date not available"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <Badge
                            className={`${getStatusColor(
                                review.status
                            )} font-medium px-3 py-1`}
                        >
                            {review.status === "published" && review.isApproved
                                ? "Approved"
                                : review.status}
                        </Badge>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 mb-1">
                                {renderStars(review.overallRating)}
                            </div>
                            <span className="text-lg font-bold text-slate-900">
                                {review.overallRating}/10
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative space-y-6 p-6">
                {/* Review Text */}
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed font-medium text-base">
                        {review.review}
                    </p>
                </div>

                {/* Category Ratings */}
                {Object.keys(review.categories).length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                            Category Ratings
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(review.categories).map(
                                ([category, rating]) => (
                                    <div
                                        key={category}
                                        className="group bg-gradient-to-r from-slate-50 to-slate-100 hover:from-indigo-50 hover:to-purple-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="capitalize font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                                                {category.replace("_", " ")}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <div className="flex items-center">
                                                    {renderStars(rating || 0)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 ml-1">
                                                    {rating}/10
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Manager Notes */}
                {review.managerNotes && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <MessageSquare className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-amber-800">
                                Manager Notes
                            </span>
                        </div>
                        <p className="text-sm text-amber-900 leading-relaxed">
                            {review.managerNotes}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <Dialog
                        open={showApprovalDialog}
                        onOpenChange={setShowApprovalDialog}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`flex-1 transition-all duration-200 ${review.isApproved
                                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100"
                                        : "bg-white border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-200 hover:text-green-700"
                                    }`}
                                onClick={() => {
                                    setPendingAction("approve");
                                    setShowApprovalDialog(true);
                                }}
                                disabled={review.isApproved}
                            >
                                <Check className="h-4 w-4 mr-2" />
                                {review.isApproved ? "Approved" : "Approve"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-slate-900">
                                    {pendingAction === "approve"
                                        ? "Approve"
                                        : "Reject"}{" "}
                                    Review
                                </DialogTitle>
                                <DialogDescription className="text-slate-600">
                                    {pendingAction === "approve"
                                        ? "This review will be displayed on the public website."
                                        : "This review will be hidden from the public website."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="notes"
                                        className="text-slate-900 font-medium"
                                    >
                                        Manager Notes (Optional)
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Add any internal notes about this review..."
                                        value={managerNotes}
                                        onChange={(e) =>
                                            setManagerNotes(e.target.value)
                                        }
                                        className="mt-1 border-slate-200 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowApprovalDialog(false)}
                                    disabled={isApproving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleApproval(
                                            pendingAction === "approve"
                                        )
                                    }
                                    disabled={isApproving}
                                    className={
                                        pendingAction === "approve"
                                            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                            : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                                    }
                                >
                                    {isApproving
                                        ? "Processing..."
                                        : pendingAction === "approve"
                                            ? "Approve"
                                            : "Reject"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="outline"
                        size="sm"
                        className={`flex-1 transition-all duration-200 ${review.status === "rejected"
                                ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100"
                                : "bg-white border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:border-red-200 hover:text-red-700"
                            }`}
                        onClick={() => {
                            setPendingAction("reject");
                            setShowApprovalDialog(true);
                        }}
                        disabled={review.status === "rejected"}
                    >
                        <X className="h-4 w-4 mr-2" />
                        {review.status === "rejected" ? "Rejected" : "Reject"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
