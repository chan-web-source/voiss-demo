"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertTriangle,
    TrendingDown,
    Clock,
    MessageSquare,
    Star,
    Users,
    Target,
    Zap,
    CheckCircle,
    XCircle,
    Info,
    ArrowRight,
    Calendar,
} from "lucide-react";
import Link from "next/link";
import type { NormalizedReview } from "@/types/review";

interface PerformanceAlert {
    id: string;
    type:
        | "rating"
        | "volume"
        | "trend"
        | "issue"
        | "maintenance"
        | "opportunity";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    propertyName: string;
    metric: string;
    value: string | number;
    threshold?: string | number;
    trend?: "up" | "down" | "stable";
    actionable: boolean;
    actionText?: string;
    actionUrl?: string;
    createdAt: Date;
    category: string;
}

interface PerformanceAlertsProps {
    reviews: NormalizedReview[];
    timeRange?: string;
}

export function PerformanceAlerts({
    reviews,
    timeRange = "30d",
}: PerformanceAlertsProps) {
    // Generate alerts based on review data analysis
    const alerts = useMemo(() => {
        // Safety check for undefined/null reviews
        if (!reviews || !Array.isArray(reviews)) {
            return [];
        }

        const alertsArray: PerformanceAlert[] = [];

        // Filter reviews by time range
        const now = new Date();
        const timeRangeMs =
            {
                "7d": 7 * 24 * 60 * 60 * 1000,
                "30d": 30 * 24 * 60 * 60 * 1000,
                "90d": 90 * 24 * 60 * 60 * 1000,
                "1y": 365 * 24 * 60 * 60 * 1000,
            }[timeRange] || 30 * 24 * 60 * 60 * 1000;

        const cutoffDate = new Date(now.getTime() - timeRangeMs);
        const filteredReviews = reviews.filter(
            (review) => review.submittedAt >= cutoffDate
        );

        // Group reviews by property
        const propertiesMap = new Map<string, NormalizedReview[]>();
        filteredReviews.forEach((review) => {
            if (!propertiesMap.has(review.listingName)) {
                propertiesMap.set(review.listingName, []);
            }
            propertiesMap.get(review.listingName)!.push(review);
        });

        propertiesMap.forEach((propertyReviews, propertyName) => {
            // Calculate metrics
            const totalReviews = propertyReviews.length;
            const approvedReviews = propertyReviews.filter((r) => r.isApproved);
            const pendingReviews = propertyReviews.filter(
                (r) => !r.isApproved && r.status === "pending"
            );
            const avgRating =
                approvedReviews.length > 0
                    ? approvedReviews.reduce(
                          (sum, r) => sum + r.overallRating,
                          0
                      ) / approvedReviews.length
                    : 0;

            // Alert 1: Low Rating
            if (avgRating < 4.0 && approvedReviews.length >= 3) {
                alertsArray.push({
                    id: `${propertyName}-low-rating`,
                    type: "rating",
                    priority: avgRating < 3.5 ? "high" : "medium",
                    title: "Low Average Rating",
                    description: `${propertyName} has an average rating of ${avgRating.toFixed(
                        1
                    )}, which is below the recommended 4.0 threshold.`,
                    propertyName,
                    metric: "Average Rating",
                    value: avgRating.toFixed(1),
                    threshold: "4.0",
                    trend: "down",
                    actionable: true,
                    actionText: "View Reviews",
                    actionUrl: `/dashboard/reviews?property=${encodeURIComponent(
                        propertyName
                    )}`,
                    createdAt: new Date(),
                    category: "Performance",
                });
            }

            // Alert 2: High Pending Reviews
            if (pendingReviews.length > 5) {
                alertsArray.push({
                    id: `${propertyName}-pending-reviews`,
                    type: "volume",
                    priority: pendingReviews.length > 10 ? "high" : "medium",
                    title: "High Pending Reviews",
                    description: `${propertyName} has ${pendingReviews.length} reviews awaiting approval.`,
                    propertyName,
                    metric: "Pending Reviews",
                    value: pendingReviews.length,
                    threshold: 5,
                    trend: "up",
                    actionable: true,
                    actionText: "Approve Reviews",
                    actionUrl: `/dashboard/reviews?property=${encodeURIComponent(
                        propertyName
                    )}&status=pending`,
                    createdAt: new Date(),
                    category: "Operations",
                });
            }

            // Alert 3: Rating Trend Analysis
            if (approvedReviews.length >= 6) {
                const recentReviews = approvedReviews
                    .sort(
                        (a, b) =>
                            b.submittedAt.getTime() - a.submittedAt.getTime()
                    )
                    .slice(0, 3);
                const olderReviews = approvedReviews
                    .sort(
                        (a, b) =>
                            b.submittedAt.getTime() - a.submittedAt.getTime()
                    )
                    .slice(3, 6);

                const recentAvg =
                    recentReviews.reduce((sum, r) => sum + r.overallRating, 0) /
                    recentReviews.length;
                const olderAvg =
                    olderReviews.reduce((sum, r) => sum + r.overallRating, 0) /
                    olderReviews.length;
                const trendDiff = recentAvg - olderAvg;

                if (trendDiff < -0.5) {
                    alertsArray.push({
                        id: `${propertyName}-declining-trend`,
                        type: "trend",
                        priority: trendDiff < -1.0 ? "high" : "medium",
                        title: "Declining Rating Trend",
                        description: `${propertyName} shows a declining trend with recent ratings averaging ${recentAvg.toFixed(
                            1
                        )} vs ${olderAvg.toFixed(1)} previously.`,
                        propertyName,
                        metric: "Rating Trend",
                        value: `${trendDiff.toFixed(1)} decline`,
                        trend: "down",
                        actionable: true,
                        actionText: "Investigate Issues",
                        actionUrl: `/dashboard/properties?property=${encodeURIComponent(
                            propertyName
                        )}`,
                        createdAt: new Date(),
                        category: "Performance",
                    });
                }
            }

            // Alert 4: Category-specific Issues
            const categoryThreshold = 3.5;
            const categoryIssues: string[] = [];
            approvedReviews.forEach((review) => {
                Object.entries(review.categories).forEach(
                    ([category, score]) => {
                        if (score && score < categoryThreshold) {
                            categoryIssues.push(category);
                        }
                    }
                );
            });

            const commonIssues = categoryIssues.reduce((acc, issue) => {
                acc[issue] = (acc[issue] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const significantIssues = Object.entries(commonIssues)
                .filter(([_, count]) => count >= 2)
                .sort(([_, a], [__, b]) => b - a);

            if (significantIssues.length > 0) {
                const [topIssue, count] = significantIssues[0];
                alertsArray.push({
                    id: `${propertyName}-category-issue`,
                    type: "issue",
                    priority: count >= 3 ? "high" : "medium",
                    title: "Recurring Category Issue",
                    description: `${propertyName} has recurring low scores in ${topIssue} (${count} instances).`,
                    propertyName,
                    metric: `${topIssue} Score`,
                    value: `${count} low ratings`,
                    actionable: true,
                    actionText: "Review Details",
                    actionUrl: `/dashboard/reviews?property=${encodeURIComponent(
                        propertyName
                    )}&category=${topIssue}`,
                    createdAt: new Date(),
                    category: "Quality",
                });
            }

            // Alert 5: Low Review Volume
            if (totalReviews < 2 && timeRange === "30d") {
                alertsArray.push({
                    id: `${propertyName}-low-volume`,
                    type: "volume",
                    priority: "low",
                    title: "Low Review Volume",
                    description: `${propertyName} has received only ${totalReviews} review(s) in the last 30 days.`,
                    propertyName,
                    metric: "Review Volume",
                    value: totalReviews,
                    threshold: 3,
                    trend: "down",
                    actionable: true,
                    actionText: "Boost Engagement",
                    actionUrl: `/dashboard/properties?property=${encodeURIComponent(
                        propertyName
                    )}`,
                    createdAt: new Date(),
                    category: "Engagement",
                });
            }

            // Alert 6: High Performance Opportunity
            if (avgRating >= 4.7 && approvedReviews.length >= 5) {
                alertsArray.push({
                    id: `${propertyName}-high-performer`,
                    type: "opportunity",
                    priority: "low",
                    title: "High Performance Property",
                    description: `${propertyName} is performing excellently with a ${avgRating.toFixed(
                        1
                    )} average rating. Consider featuring this property.`,
                    propertyName,
                    metric: "Average Rating",
                    value: avgRating.toFixed(1),
                    trend: "up",
                    actionable: true,
                    actionText: "Feature Property",
                    actionUrl: `/dashboard/public-reviews?property=${encodeURIComponent(
                        propertyName
                    )}`,
                    createdAt: new Date(),
                    category: "Opportunity",
                });
            }
        });

        // Sort alerts by priority and date
        return alertsArray.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
    }, [reviews, timeRange]);

    const getAlertIcon = (type: PerformanceAlert["type"]) => {
        switch (type) {
            case "rating":
                return Star;
            case "volume":
                return MessageSquare;
            case "trend":
                return TrendingDown;
            case "issue":
                return AlertTriangle;
            case "maintenance":
                return Clock;
            case "opportunity":
                return Target;
            default:
                return Info;
        }
    };

    const getAlertColor = (
        priority: PerformanceAlert["priority"],
        type: PerformanceAlert["type"]
    ) => {
        if (type === "opportunity") {
            return "border-green-200 bg-green-50";
        }

        switch (priority) {
            case "high":
                return "border-red-200 bg-red-50";
            case "medium":
                return "border-yellow-200 bg-yellow-50";
            case "low":
                return "border-blue-200 bg-blue-50";
            default:
                return "border-gray-200 bg-gray-50";
        }
    };

    const getBadgeColor = (
        priority: PerformanceAlert["priority"],
        type: PerformanceAlert["type"]
    ) => {
        if (type === "opportunity") {
            return "bg-green-100 text-green-800";
        }

        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "low":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const alertsByCategory = alerts.reduce((acc, alert) => {
        if (!acc[alert.category]) {
            acc[alert.category] = [];
        }
        acc[alert.category].push(alert);
        return acc;
    }, {} as Record<string, PerformanceAlert[]>);

    const priorityStats = alerts.reduce((acc, alert) => {
        acc[alert.priority] = (acc[alert.priority] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (alerts.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        All Systems Running Smoothly
                    </h3>
                    <p className="text-gray-600">
                        No performance alerts detected for the selected time
                        period.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Alert Summary */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            Performance Alerts
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {priorityStats.high && (
                                <Badge className="bg-red-100 text-red-800">
                                    {priorityStats.high} High Priority
                                </Badge>
                            )}
                            {priorityStats.medium && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                    {priorityStats.medium} Medium
                                </Badge>
                            )}
                            {priorityStats.low && (
                                <Badge className="bg-blue-100 text-blue-800">
                                    {priorityStats.low} Low Priority
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600">
                        {alerts.length} alert(s) found across{" "}
                        {Object.keys(alertsByCategory).length} categories.
                        Review and take action on high-priority items to
                        maintain optimal performance.
                    </p>
                </CardContent>
            </Card>

            {/* Alerts by Category */}
            {Object.entries(alertsByCategory).map(
                ([category, categoryAlerts]) => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {category} ({categoryAlerts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {categoryAlerts.map((alert) => {
                                    const Icon = getAlertIcon(alert.type);

                                    return (
                                        <div
                                            key={alert.id}
                                            className={`p-4 rounded-lg border-l-4 ${getAlertColor(
                                                alert.priority,
                                                alert.type
                                            )}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <Icon className="h-5 w-5 text-gray-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-medium text-gray-900">
                                                                {alert.title}
                                                            </h4>
                                                            <Badge
                                                                className={getBadgeColor(
                                                                    alert.priority,
                                                                    alert.type
                                                                )}
                                                            >
                                                                {alert.priority}{" "}
                                                                priority
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-700 mb-3">
                                                            {alert.description}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>
                                                                    {alert.createdAt.toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Users className="h-3 w-3" />
                                                                <span>
                                                                    {
                                                                        alert.propertyName
                                                                    }
                                                                </span>
                                                            </div>
                                                            {alert.threshold && (
                                                                <div className="flex items-center gap-1">
                                                                    <Target className="h-3 w-3" />
                                                                    <span>
                                                                        {
                                                                            alert.metric
                                                                        }
                                                                        :{" "}
                                                                        {
                                                                            alert.value
                                                                        }
                                                                        (threshold:{" "}
                                                                        {
                                                                            alert.threshold
                                                                        }
                                                                        )
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    {alert.actionable &&
                                                        alert.actionUrl && (
                                                            <Link
                                                                href={
                                                                    alert.actionUrl
                                                                }
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                >
                                                                    {
                                                                        alert.actionText
                                                                    }
                                                                    <ArrowRight className="h-4 w-4 ml-2" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    );
}
