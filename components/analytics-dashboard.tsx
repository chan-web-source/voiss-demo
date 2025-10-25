"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { AlertTriangle, Star, Users, MessageSquare, Info } from "lucide-react";
import type { ReviewAnalytics } from "../types/review";

interface AnalyticsDashboardProps {
    analytics: ReviewAnalytics;
    isDemoData?: boolean;
    reviews?: any[]; // Add reviews data for additional calculations
}

export function AnalyticsDashboard({
    analytics,
    isDemoData = false,
    reviews = [],
}: AnalyticsDashboardProps) {
    const {
        totalReviews,
        averageRating,
        ratingDistribution,
        categoryAverages,
        channelBreakdown,
        monthlyTrends,
        topProperties,
        commonIssues,
        performanceAlerts,
    } = analytics;

    const ratingChartData = Object.entries(ratingDistribution).map(
        ([rating, count]) => ({
            rating: `${rating}★`,
            count,
        })
    );

    const categoryChartData = Object.entries(categoryAverages).map(
        ([category, average]) => ({
            category: category.replace("_", " "),
            average: Number(average.toFixed(1)),
        })
    );

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "bg-red-100 text-red-800 border-red-200";
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "low":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Key Insights Summary */}
            <Card style={{ backgroundColor: "#FFFFFF" }}>
                <CardHeader>
                    <CardTitle
                        className="flex items-center gap-2 font-sans"
                        style={{ color: "#333333" }}
                    >
                        <Star
                            className="h-5 w-5"
                            style={{ color: "#284E4C" }}
                        />
                        Key Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: "#FFF9E9",
                                borderColor: "#284E4C20",
                            }}
                        >
                            <h4
                                className="font-medium mb-1 font-sans"
                                style={{ color: "#284E4C" }}
                            >
                                Overall Performance
                            </h4>
                            <p
                                className="text-sm font-sans"
                                style={{ color: "#5C5C5A" }}
                            >
                                {averageRating >= 8.5
                                    ? "Excellent"
                                    : averageRating >= 7.5
                                        ? "Good"
                                        : averageRating >= 6.5
                                            ? "Fair"
                                            : "Needs Improvement"}
                                ({averageRating.toFixed(1)}/10)
                            </p>
                        </div>
                        <div
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: "#FFF9E9",
                                borderColor: "#284E4C20",
                            }}
                        >
                            <h4
                                className="font-medium mb-1 font-sans"
                                style={{ color: "#284E4C" }}
                            >
                                Most Common Rating
                            </h4>
                            <p
                                className="text-sm font-sans"
                                style={{ color: "#5C5C5A" }}
                            >
                                {Object.entries(ratingDistribution).sort(
                                    ([, a], [, b]) => b - a
                                )[0]?.[0] || "N/A"}
                                /10 (
                                {Object.entries(ratingDistribution).sort(
                                    ([, a], [, b]) => b - a
                                )[0]?.[1] || 0}{" "}
                                reviews)
                            </p>
                        </div>
                        <div
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: "#FFF9E9",
                                borderColor: "#284E4C20",
                            }}
                        >
                            <h4
                                className="font-medium mb-1 font-sans"
                                style={{ color: "#284E4C" }}
                            >
                                Top Strength
                            </h4>
                            <p
                                className="text-sm font-sans capitalize"
                                style={{ color: "#5C5C5A" }}
                            >
                                {Object.entries(categoryAverages)
                                    .sort(([, a], [, b]) => b - a)[0]?.[0]
                                    ?.replace("_", " ") || "N/A"}
                                (
                                {Object.entries(categoryAverages)
                                    .sort(([, a], [, b]) => b - a)[0]?.[1]
                                    ?.toFixed(1) || 0}
                                /10)
                            </p>
                        </div>
                        <div
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: "#FFF9E9",
                                borderColor: "#284E4C20",
                            }}
                        >
                            <h4
                                className="font-medium mb-1 font-sans"
                                style={{ color: "#284E4C" }}
                            >
                                Review Platform
                            </h4>
                            <p
                                className="text-sm font-sans"
                                style={{ color: "#5C5C5A" }}
                            >
                                The Flex (100%)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card style={{ backgroundColor: "#FFFFFF" }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle
                            className="text-sm font-medium font-sans"
                            style={{ color: "#333333" }}
                        >
                            Total Reviews
                        </CardTitle>
                        <MessageSquare
                            className="h-4 w-4"
                            style={{ color: "#5C5C5A" }}
                        />
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold font-sans"
                            style={{ color: "#284E4C" }}
                        >
                            {totalReviews}
                        </div>
                        <p
                            className="text-xs font-sans"
                            style={{ color: "#5C5C5A" }}
                        >
                            Across all properties
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ backgroundColor: "#FFFFFF" }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle
                            className="text-sm font-medium font-sans"
                            style={{ color: "#333333" }}
                        >
                            Average Rating
                        </CardTitle>
                        <Star
                            className="h-4 w-4"
                            style={{ color: "#5C5C5A" }}
                        />
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold font-sans"
                            style={{ color: "#284E4C" }}
                        >
                            {averageRating.toFixed(1)}/10
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < Math.floor(averageRating / 2)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                    style={{
                                        fill:
                                            i < Math.floor(averageRating / 2)
                                                ? "#fbbf24"
                                                : "transparent",
                                        color:
                                            i < Math.floor(averageRating / 2)
                                                ? "#fbbf24"
                                                : "#d1d5db",
                                    }}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card style={{ backgroundColor: "#FFFFFF" }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle
                            className="text-sm font-medium font-sans"
                            style={{ color: "#333333" }}
                        >
                            Platform
                        </CardTitle>
                        <Users
                            className="h-4 w-4"
                            style={{ color: "#5C5C5A" }}
                        />
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold font-sans"
                            style={{ color: "#284E4C" }}
                        >
                            The Flex
                        </div>
                        <p
                            className="text-xs font-sans"
                            style={{ color: "#5C5C5A" }}
                        >
                            {totalReviews} reviews
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ backgroundColor: "#FFFFFF" }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle
                            className="text-sm font-medium font-sans"
                            style={{ color: "#333333" }}
                        >
                            Issues Detected
                        </CardTitle>
                        <AlertTriangle
                            className="h-4 w-4"
                            style={{ color: "#5C5C5A" }}
                        />
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold font-sans"
                            style={{ color: "#284E4C" }}
                        >
                            {commonIssues.length}
                        </div>
                        <p
                            className="text-xs font-sans"
                            style={{ color: "#5C5C5A" }}
                        >
                            {
                                commonIssues.filter(
                                    (i) => i.severity === "high"
                                ).length
                            }{" "}
                            high priority
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Alerts */}
            {performanceAlerts && performanceAlerts.length > 0 && (
                <Card style={{ backgroundColor: "#FFFFFF" }}>
                    <CardHeader>
                        <CardTitle
                            className="flex items-center gap-2 font-sans"
                            style={{ color: "#333333" }}
                        >
                            <AlertTriangle
                                className="h-5 w-5"
                                style={{ color: "#284E4C" }}
                            />
                            Performance Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {performanceAlerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg border-l-4 ${alert.priority === "high"
                                        ? "border-red-500"
                                        : alert.priority === "medium"
                                            ? "border-amber-500"
                                            : "border-blue-500"
                                        }`}
                                    style={{
                                        backgroundColor:
                                            alert.priority === "high"
                                                ? "#fef2f2"
                                                : alert.priority === "medium"
                                                    ? "#fffbeb"
                                                    : "#eff6ff",
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4
                                                className="font-medium text-sm font-sans"
                                                style={{ color: "#333333" }}
                                            >
                                                {alert.title}
                                            </h4>
                                            <p
                                                className="text-xs mt-1 font-sans"
                                                style={{ color: "#5C5C5A" }}
                                            >
                                                {alert.message}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                alert.priority === "high"
                                                    ? "destructive"
                                                    : "secondary"
                                            }
                                            className="text-xs font-sans"
                                        >
                                            {alert.priority}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rating Distribution */}
                <Card style={{ backgroundColor: "#FFFFFF" }}>
                    <CardHeader>
                        <CardTitle
                            className="font-sans"
                            style={{ color: "#333333" }}
                        >
                            Rating Distribution
                        </CardTitle>
                        <p
                            className="text-sm font-sans"
                            style={{ color: "#5C5C5A" }}
                        >
                            Distribution of guest ratings across 1-10 scale
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ratingChartData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="rating"
                                    style={{
                                        fontSize: "12px",
                                        fontFamily: "sans-serif",
                                        fill: "#5C5C5A",
                                    }}
                                />
                                <YAxis
                                    label={{
                                        value: "Number of Reviews",
                                        angle: -90,
                                        position: "insideLeft",
                                        style: {
                                            textAnchor: "middle",
                                            fontSize: "12px",
                                            fontFamily: "sans-serif",
                                            fill: "#5C5C5A",
                                        },
                                    }}
                                    style={{
                                        fontSize: "12px",
                                        fontFamily: "sans-serif",
                                        fill: "#5C5C5A",
                                    }}
                                />
                                <Tooltip
                                    formatter={(value, name) => [
                                        value,
                                        "Reviews",
                                    ]}
                                    labelFormatter={(label) =>
                                        `Rating: ${label}`
                                    }
                                    contentStyle={{
                                        backgroundColor: "#FFFFFF",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        color: "#333333",
                                        fontFamily: "sans-serif",
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#284E4C"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Monthly Trends */}
                <Card style={{ backgroundColor: "#FFFFFF" }}>
                    <CardHeader>
                        <CardTitle
                            className="font-sans"
                            style={{ color: "#333333" }}
                        >
                            Monthly Trends
                        </CardTitle>
                        <p
                            className="text-sm font-sans"
                            style={{ color: "#5C5C5A" }}
                        >
                            Review volume and average ratings over time
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyTrends}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="month"
                                    style={{
                                        fontSize: "12px",
                                        fontFamily: "sans-serif",
                                        fill: "#5C5C5A",
                                    }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    label={{
                                        value: "Review Count",
                                        angle: -90,
                                        position: "insideLeft",
                                        style: {
                                            textAnchor: "middle",
                                            fontSize: "12px",
                                            fontFamily: "sans-serif",
                                            fill: "#5C5C5A",
                                        },
                                    }}
                                    style={{
                                        fontSize: "12px",
                                        fontFamily: "sans-serif",
                                        fill: "#5C5C5A",
                                    }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    label={{
                                        value: "Average Rating",
                                        angle: 90,
                                        position: "insideRight",
                                        style: {
                                            textAnchor: "middle",
                                            fontSize: "12px",
                                            fontFamily: "sans-serif",
                                            fill: "#5C5C5A",
                                        },
                                    }}
                                    style={{
                                        fontSize: "12px",
                                        fontFamily: "sans-serif",
                                        fill: "#5C5C5A",
                                    }}
                                />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === "Review Count"
                                            ? value
                                            : `${value}/10`,
                                        name,
                                    ]}
                                    contentStyle={{
                                        backgroundColor: "#FFFFFF",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        color: "#333333",
                                        fontFamily: "sans-serif",
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="line"
                                    wrapperStyle={{
                                        fontSize: "12px",
                                        fontFamily: "sans-serif",
                                        color: "#5C5C5A",
                                    }}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#284E4C"
                                    strokeWidth={3}
                                    dot={{
                                        fill: "#284E4C",
                                        strokeWidth: 2,
                                        r: 4,
                                    }}
                                    name="Review Count"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="averageRating"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    dot={{
                                        fill: "#f59e0b",
                                        strokeWidth: 2,
                                        r: 4,
                                    }}
                                    name="Average Rating"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Performance */}
                <Card style={{ backgroundColor: "#FFFFFF" }}>
                    <CardHeader>
                        <CardTitle
                            className="font-sans"
                            style={{ color: "#333333" }}
                        >
                            Category Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {categoryChartData.map((category) => (
                            <div key={category.category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-sm font-medium capitalize font-sans"
                                        style={{ color: "#333333" }}
                                    >
                                        {category.category}
                                    </span>
                                    <span
                                        className="text-sm font-sans"
                                        style={{ color: "#5C5C5A" }}
                                    >
                                        {category.average}/10
                                    </span>
                                </div>
                                <Progress
                                    value={(category.average / 10) * 100}
                                    className="h-2"
                                    style={{ backgroundColor: "#e5e7eb" }}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Top Properties */}
                <Card style={{ backgroundColor: "#FFFFFF" }}>
                    <CardHeader>
                        <CardTitle
                            className="font-sans"
                            style={{ color: "#333333" }}
                        >
                            Top Performing Properties
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topProperties.map((property, index) => (
                            <div
                                key={property.name}
                                className="flex items-center justify-between p-3 rounded-lg border"
                                style={{ borderColor: "#e5e7eb" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold font-sans"
                                        style={{
                                            backgroundColor: "#FFF9E9",
                                            color: "#284E4C",
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p
                                            className="font-medium text-sm truncate max-w-48 font-sans"
                                            style={{ color: "#333333" }}
                                        >
                                            {property.name}
                                        </p>
                                        <p
                                            className="text-xs font-sans"
                                            style={{ color: "#5C5C5A" }}
                                        >
                                            {property.count} reviews
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star
                                        className="h-3 w-3"
                                        style={{
                                            fill: "#fbbf24",
                                            color: "#fbbf24",
                                        }}
                                    />
                                    <span
                                        className="text-sm font-semibold font-sans"
                                        style={{ color: "#284E4C" }}
                                    >
                                        {property.averageRating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Common Issues */}
            {commonIssues.length > 0 && (
                <Card style={{ backgroundColor: "#FFFFFF" }}>
                    <CardHeader>
                        <CardTitle
                            className="flex items-center gap-2 font-sans"
                            style={{ color: "#333333" }}
                        >
                            <AlertTriangle
                                className="h-5 w-5"
                                style={{ color: "#284E4C" }}
                            />
                            Common Issues Detected
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {commonIssues.map((issue) => (
                                <div
                                    key={issue.issue}
                                    className="p-4 rounded-lg border"
                                    style={{ borderColor: "#e5e7eb" }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4
                                            className="font-medium capitalize font-sans"
                                            style={{ color: "#333333" }}
                                        >
                                            {issue.issue}
                                        </h4>
                                        <Badge
                                            className={getSeverityColor(
                                                issue.severity
                                            )}
                                        >
                                            {issue.severity}
                                        </Badge>
                                    </div>
                                    <p
                                        className="text-sm font-sans"
                                        style={{ color: "#5C5C5A" }}
                                    >
                                        {issue.count} mentions in low-rated
                                        reviews
                                    </p>
                                    <div className="mt-2">
                                        <Progress
                                            value={
                                                (issue.count / totalReviews) *
                                                100
                                            }
                                            className="h-2"
                                            style={{
                                                backgroundColor: "#e5e7eb",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Platform Performance */}
            <Card style={{ backgroundColor: "#FFFFFF" }}>
                <CardHeader>
                    <CardTitle
                        className="font-sans"
                        style={{ color: "#333333" }}
                    >
                        Platform Performance
                    </CardTitle>
                    <p
                        className="text-sm font-sans"
                        style={{ color: "#5C5C5A" }}
                    >
                        Review performance on The Flex platform
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div
                            className="text-center p-6 rounded-lg border"
                            style={{
                                borderColor: "#e5e7eb",
                                backgroundColor: "#FFF9E9",
                            }}
                        >
                            <div
                                className="text-3xl font-bold mb-1 font-sans"
                                style={{ color: "#284E4C" }}
                            >
                                {totalReviews}
                            </div>
                            <div
                                className="text-sm font-medium mb-2 font-sans"
                                style={{ color: "#333333" }}
                            >
                                The Flex
                            </div>
                            <div className="flex items-center justify-center gap-1 mb-2">
                                <Star
                                    className="h-3 w-3"
                                    style={{
                                        fill: "#fbbf24",
                                        color: "#fbbf24",
                                    }}
                                />
                                <span
                                    className="text-sm font-sans"
                                    style={{ color: "#5C5C5A" }}
                                >
                                    {averageRating.toFixed(1)}/10
                                </span>
                            </div>
                            <div className="mt-3">
                                <Progress
                                    value={100}
                                    className="h-2"
                                    style={{
                                        backgroundColor: "#e5e7eb",
                                    }}
                                />
                                <p
                                    className="text-xs mt-1 font-sans"
                                    style={{ color: "#5C5C5A" }}
                                >
                                    100% of total reviews
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
