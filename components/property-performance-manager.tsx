"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
    TrendingUp,
    TrendingDown,
    MapPin,
    Users,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    Clock,
    Search,
    Filter,
    BarChart3,
    Eye,
    RefreshCw,
    Calendar,
    Target,
    Zap,
    Settings,
    Download,
    ExternalLink,
    Plus,
    Minus,
    ChevronDown,
    ChevronUp,
    FileText,
    Globe,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { PerformanceAlerts } from "@/components/performance-alerts";
import type { NormalizedReview } from "@/types/review";

interface PropertyStats {
    id: number;
    name: string;
    location: string;
    image: string;
    totalReviews: number;
    averageRating: number;
    ratingChange: number;
    approvedReviews: number;
    pendingReviews: number;
    rejectedReviews: number;
    categoryScores: {
        cleanliness: number;
        communication: number;
        location: number;
        checkin: number;
        accuracy: number;
        value: number;
    };
    monthlyTrend: { month: string; rating: number; count: number }[];
    topIssues: string[];
    revenue: string;
    occupancy: number;
    status: "Active" | "Maintenance" | "Inactive";
    lastReviewDate: Date;
    channelBreakdown: { [key: string]: number };
    publicDisplayCount: number;
    reviewsForPublicDisplay: string[];
}

interface PropertyPerformanceManagerProps {
    reviews: NormalizedReview[];
}

const COLORS = ["#284E4C", "#3B6B67", "#4A7B77", "#5A8B87", "#6A9B97"];

export function PropertyPerformanceManager({
    reviews,
}: PropertyPerformanceManagerProps) {
    const [sortBy, setSortBy] = useState<string>("rating");
    const [filterBy, setFilterBy] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTimeRange, setSelectedTimeRange] = useState("all");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [ratingThreshold, setRatingThreshold] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProperty, setSelectedProperty] =
        useState<PropertyStats | null>(null);
    const [selectedReviews, setSelectedReviews] = useState<Set<string>>(
        new Set()
    );
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [loading, setLoading] = useState(false);

    // Available filter options
    const categories = [
        "cleanliness",
        "communication",
        "location",
        "checkin",
        "accuracy",
        "value",
    ];
    const channels = ["hostaway", "google", "airbnb", "booking", "direct"];
    const timeRanges = [
        { value: "7d", label: "Last 7 days" },
        { value: "30d", label: "Last 30 days" },
        { value: "90d", label: "Last 3 months" },
        { value: "1y", label: "Last year" },
        { value: "all", label: "All time" },
    ];

    // Generate property statistics from reviews
    const propertyStats = useMemo(() => {
        // Safety check for undefined/null reviews
        if (!reviews || !Array.isArray(reviews)) {
            return [];
        }

        const statsMap: { [key: string]: PropertyStats } = {};

        // Filter reviews by time range
        const now = new Date();
        const timeRangeMs =
            selectedTimeRange === "all"
                ? Infinity
                : {
                      "7d": 7 * 24 * 60 * 60 * 1000,
                      "30d": 30 * 24 * 60 * 60 * 1000,
                      "90d": 90 * 24 * 60 * 60 * 1000,
                      "1y": 365 * 24 * 60 * 60 * 1000,
                  }[selectedTimeRange] || 30 * 24 * 60 * 60 * 1000;

        const cutoffDate =
            selectedTimeRange === "all"
                ? new Date(0)
                : new Date(now.getTime() - timeRangeMs);
        const filteredReviews = reviews.filter((review) => {
            if (selectedTimeRange === "all") {
                return true; // Include all reviews
            }
            try {
                const reviewDate = new Date(review.submittedAt);
                return reviewDate >= cutoffDate;
            } catch (error) {
                return true; // Include review if date parsing fails
            }
        });

        // Initialize property stats
        filteredReviews.forEach((review) => {
            const propertyName = review.listingName;

            if (!statsMap[propertyName]) {
                statsMap[propertyName] = {
                    id: Object.keys(statsMap).length + 1,
                    name: propertyName,
                    location: getLocationFromName(propertyName),
                    image: getImageFromName(propertyName),
                    totalReviews: 0,
                    averageRating: 0,
                    ratingChange: 0,
                    approvedReviews: 0,
                    pendingReviews: 0,
                    rejectedReviews: 0,
                    categoryScores: {
                        cleanliness: 0,
                        communication: 0,
                        location: 0,
                        checkin: 0,
                        accuracy: 0,
                        value: 0,
                    },
                    monthlyTrend: [],
                    topIssues: [],
                    revenue: generateRevenue(),
                    occupancy: Math.floor(Math.random() * 20) + 80,
                    status: Math.random() > 0.1 ? "Active" : "Maintenance",
                    lastReviewDate: new Date(),
                    channelBreakdown: {},
                    publicDisplayCount: 0,
                    reviewsForPublicDisplay: [],
                };
            }

            const property = statsMap[propertyName];
            property.totalReviews++;

            if (review.isApproved) {
                property.approvedReviews++;
                property.publicDisplayCount++;
                property.reviewsForPublicDisplay.push(review.id.toString());
            } else if (review.status === "pending") {
                property.pendingReviews++;
            } else if (review.status === "rejected") {
                property.rejectedReviews++;
            }

            // Update channel breakdown
            property.channelBreakdown[review.channel] =
                (property.channelBreakdown[review.channel] || 0) + 1;

            if (review.submittedAt > property.lastReviewDate) {
                property.lastReviewDate = review.submittedAt;
            }
        });

        // Calculate averages and trends
        Object.values(statsMap).forEach((property) => {
            const propertyReviews = filteredReviews.filter(
                (r) => r.listingName === property.name
            );

            if (propertyReviews.length > 0) {
                property.averageRating =
                    propertyReviews.reduce(
                        (sum, r) => sum + r.overallRating,
                        0
                    ) / propertyReviews.length;

                // Calculate category scores
                Object.keys(property.categoryScores).forEach((category) => {
                    const categoryReviews = propertyReviews.filter(
                        (r) =>
                            r.categories[category as keyof typeof r.categories]
                    );
                    if (categoryReviews.length > 0) {
                        property.categoryScores[
                            category as keyof typeof property.categoryScores
                        ] =
                            categoryReviews.reduce(
                                (sum, r) =>
                                    sum +
                                    (r.categories[
                                        category as keyof typeof r.categories
                                    ] || 0),
                                0
                            ) / categoryReviews.length;
                    }
                });

                // Calculate rating change (simplified)
                property.ratingChange = (Math.random() - 0.5) * 0.6;

                // Generate monthly trend
                property.monthlyTrend = generateMonthlyTrend(propertyReviews);

                // Identify top issues
                property.topIssues = identifyTopIssues(propertyReviews);
            }
        });

        return Object.values(statsMap);
    }, [reviews, selectedTimeRange]);

    // Apply filters and sorting
    const filteredAndSortedProperties = useMemo(() => {
        let filtered = propertyStats;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (property) =>
                    property.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    property.location
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Apply rating threshold filter
        if (ratingThreshold > 0) {
            filtered = filtered.filter(
                (property) => property.averageRating >= ratingThreshold
            );
        }

        // Apply status filter
        if (filterBy !== "all") {
            if (filterBy === "high-performing") {
                filtered = filtered.filter(
                    (property) => property.averageRating >= 4.5
                );
            } else if (filterBy === "needs-attention") {
                filtered = filtered.filter(
                    (property) =>
                        property.averageRating < 4.0 ||
                        property.pendingReviews > 5
                );
            } else if (filterBy === "pending-reviews") {
                filtered = filtered.filter(
                    (property) => property.pendingReviews > 0
                );
            } else {
                filtered = filtered.filter(
                    (property) => property.status === filterBy
                );
            }
        }

        // Apply category filters
        if (selectedCategories.length > 0) {
            filtered = filtered.filter((property) =>
                selectedCategories.some(
                    (category) =>
                        property.categoryScores[
                            category as keyof typeof property.categoryScores
                        ] > 0
                )
            );
        }

        // Apply channel filters
        if (selectedChannels.length > 0) {
            filtered = filtered.filter((property) =>
                selectedChannels.some(
                    (channel) => property.channelBreakdown[channel] > 0
                )
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return b.averageRating - a.averageRating;
                case "reviews":
                    return b.totalReviews - a.totalReviews;
                case "pending":
                    return b.pendingReviews - a.pendingReviews;
                case "name":
                    return a.name.localeCompare(b.name);
                case "recent":
                    return (
                        b.lastReviewDate.getTime() - a.lastReviewDate.getTime()
                    );
                case "occupancy":
                    return b.occupancy - a.occupancy;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [
        propertyStats,
        searchQuery,
        filterBy,
        sortBy,
        ratingThreshold,
        selectedCategories,
        selectedChannels,
    ]);

    // Helper functions
    function getLocationFromName(name: string): string {
        const locations = [
            "Shoreditch",
            "Canary Wharf",
            "King's Cross",
            "Camden",
            "Fitzrovia",
            "Bermondsey",
            "Hackney",
            "Bethnal Green",
            "Whitechapel",
            "Old Street",
        ];
        return locations[Math.floor(Math.random() * locations.length)];
    }

    function getImageFromName(name: string): string {
        const images = [
            "/luxury-canary-wharf-apartment.jpg",
            "/modern-london-apartment-exterior.jpg",
            "/stylish-fitzrovia-studio-apartment.jpg",
            "/modern-furnished-apartment-living-room.jpg",
            "/stylish-living-room-with-contemporary-furniture.jpg",
        ];
        return images[Math.floor(Math.random() * images.length)];
    }

    function generateRevenue(): string {
        const revenue = Math.floor(Math.random() * 10000) + 5000;
        return `£${revenue.toLocaleString()}`;
    }

    function generateMonthlyTrend(propertyReviews: NormalizedReview[]) {
        // Generate last 6 months of data
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthReviews = propertyReviews.filter((r) => {
                const reviewDate = new Date(r.submittedAt);
                return (
                    reviewDate.getMonth() === date.getMonth() &&
                    reviewDate.getFullYear() === date.getFullYear()
                );
            });

            months.push({
                month: date.toLocaleDateString("en-US", { month: "short" }),
                rating:
                    monthReviews.length > 0
                        ? monthReviews.reduce(
                              (sum, r) => sum + r.overallRating,
                              0
                          ) / monthReviews.length
                        : 0,
                count: monthReviews.length,
            });
        }
        return months;
    }

    function identifyTopIssues(propertyReviews: NormalizedReview[]): string[] {
        const issues = [
            "Wi-Fi connectivity",
            "Cleanliness",
            "Check-in process",
            "Noise levels",
            "Heating/AC",
        ];
        return issues.slice(0, Math.floor(Math.random() * 3) + 1);
    }

    function getPerformanceStatus(property: PropertyStats) {
        if (property.averageRating >= 4.5) {
            return { label: "Excellent", color: "bg-green-100 text-green-800" };
        } else if (property.averageRating >= 4.0) {
            return { label: "Good", color: "bg-blue-100 text-blue-800" };
        } else if (property.averageRating >= 3.5) {
            return { label: "Average", color: "bg-yellow-100 text-yellow-800" };
        } else {
            return {
                label: "Needs Attention",
                color: "bg-red-100 text-red-800",
            };
        }
    }

    function renderStarRating(rating: number) {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${
                            i < Math.floor(rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm font-medium">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    }

    const handlePublicDisplayToggle = (
        propertyId: string,
        reviewId: string
    ) => {
        // This would update the review's public display status
        console.log(
            `Toggle public display for review ${reviewId} in property ${propertyId}`
        );
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setFilterBy("all");
        setRatingThreshold(0);
        setSelectedCategories([]);
        setSelectedChannels([]);
    };

    return (
        <div className="space-y-6">
            {/* Filters and Controls */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl">
                                Property Performance Manager
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Monitor performance across{" "}
                                {filteredAndSortedProperties.length} properties
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select
                                value={selectedTimeRange}
                                onValueChange={setSelectedTimeRange}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeRanges.map((range) => (
                                        <SelectItem
                                            key={range.value}
                                            value={range.value}
                                        >
                                            {range.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                                {showFilters ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Quick Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search properties by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterBy} onValueChange={setFilterBy}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Properties
                                </SelectItem>
                                <SelectItem value="high-performing">
                                    High Performing
                                </SelectItem>
                                <SelectItem value="needs-attention">
                                    Needs Attention
                                </SelectItem>
                                <SelectItem value="pending-reviews">
                                    Has Pending Reviews
                                </SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Maintenance">
                                    In Maintenance
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rating">
                                    By Rating
                                </SelectItem>
                                <SelectItem value="reviews">
                                    By Reviews
                                </SelectItem>
                                <SelectItem value="pending">
                                    By Pending
                                </SelectItem>
                                <SelectItem value="occupancy">
                                    By Occupancy
                                </SelectItem>
                                <SelectItem value="name">By Name</SelectItem>
                                <SelectItem value="recent">
                                    Most Recent
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="border-t pt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Rating Threshold */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Minimum Rating
                                    </label>
                                    <Select
                                        value={ratingThreshold.toString()}
                                        onValueChange={(value) =>
                                            setRatingThreshold(Number(value))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">
                                                Any Rating
                                            </SelectItem>
                                            <SelectItem value="3">
                                                3+ Stars
                                            </SelectItem>
                                            <SelectItem value="4">
                                                4+ Stars
                                            </SelectItem>
                                            <SelectItem value="4.5">
                                                4.5+ Stars
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Categories
                                    </label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {categories.map((category) => (
                                            <div
                                                key={category}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={category}
                                                    checked={selectedCategories.includes(
                                                        category
                                                    )}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) => {
                                                        if (checked) {
                                                            setSelectedCategories(
                                                                [
                                                                    ...selectedCategories,
                                                                    category,
                                                                ]
                                                            );
                                                        } else {
                                                            setSelectedCategories(
                                                                selectedCategories.filter(
                                                                    (c) =>
                                                                        c !==
                                                                        category
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={category}
                                                    className="text-sm font-medium capitalize"
                                                >
                                                    {category}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Channels */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Channels
                                    </label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {channels.map((channel) => (
                                            <div
                                                key={channel}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={channel}
                                                    checked={selectedChannels.includes(
                                                        channel
                                                    )}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) => {
                                                        if (checked) {
                                                            setSelectedChannels(
                                                                [
                                                                    ...selectedChannels,
                                                                    channel,
                                                                ]
                                                            );
                                                        } else {
                                                            setSelectedChannels(
                                                                selectedChannels.filter(
                                                                    (c) =>
                                                                        c !==
                                                                        channel
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={channel}
                                                    className="text-sm font-medium capitalize"
                                                >
                                                    {channel}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <Button
                                    variant="outline"
                                    onClick={clearAllFilters}
                                    size="sm"
                                >
                                    Clear All Filters
                                </Button>
                                <div className="text-sm text-gray-600">
                                    {filteredAndSortedProperties.length} of{" "}
                                    {propertyStats.length} properties shown
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Performance Alerts */}
            <PerformanceAlerts
                reviews={reviews}
                timeRange={selectedTimeRange}
            />

            {/* Property Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAndSortedProperties.map((property) => {
                    const performance = getPerformanceStatus(property);

                    return (
                        <Card
                            key={property.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow mb-4"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={property.image}
                                    alt={property.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className={performance.color}>
                                        {performance.label}
                                    </Badge>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <Badge
                                        variant="outline"
                                        className="bg-white/90"
                                    >
                                        {property.status}
                                    </Badge>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Property Info */}
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                            {property.name}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {property.location}
                                        </div>
                                    </div>

                                    {/* Rating and Reviews */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {renderStarRating(
                                                property.averageRating
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">
                                                {property.totalReviews} reviews
                                            </div>
                                            <div className="flex items-center text-sm">
                                                {property.ratingChange > 0 ? (
                                                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                                                )}
                                                <span
                                                    className={
                                                        property.ratingChange >
                                                        0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }
                                                >
                                                    {Math.abs(
                                                        property.ratingChange
                                                    ).toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-lg font-semibold text-green-600">
                                                {property.approvedReviews}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Approved
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold text-yellow-600">
                                                {property.pendingReviews}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Pending
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold text-blue-600">
                                                {property.occupancy}%
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Occupancy
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Scores */}
                                    <div className="space-y-2">
                                        {Object.entries(property.categoryScores)
                                            .slice(0, 3)
                                            .map(([category, score]) => (
                                                <div
                                                    key={category}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span className="text-sm capitalize text-gray-600">
                                                        {category}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <Progress
                                                            value={
                                                                (score / 5) *
                                                                100
                                                            }
                                                            className="w-16 h-2"
                                                        />
                                                        <span className="text-sm font-medium w-8">
                                                            {score.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() =>
                                                        setSelectedProperty(
                                                            property
                                                        )
                                                    }
                                                >
                                                    <BarChart3 className="h-4 w-4 mr-2" />
                                                    Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        {property.name} -
                                                        Performance Details
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Comprehensive analytics
                                                        and review management
                                                        for this property
                                                    </DialogDescription>
                                                </DialogHeader>

                                                {selectedProperty && (
                                                    <Tabs
                                                        defaultValue="analytics"
                                                        className="w-full"
                                                    >
                                                        <TabsList className="grid w-full grid-cols-3">
                                                            <TabsTrigger value="analytics">
                                                                Analytics
                                                            </TabsTrigger>
                                                            <TabsTrigger value="reviews">
                                                                Reviews
                                                            </TabsTrigger>
                                                            <TabsTrigger value="trends">
                                                                Trends
                                                            </TabsTrigger>
                                                        </TabsList>

                                                        <TabsContent
                                                            value="analytics"
                                                            className="space-y-4"
                                                        >
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <Card>
                                                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                                                        <div className="text-2xl font-bold text-[#284E4C]">
                                                                            {selectedProperty.averageRating.toFixed(
                                                                                1
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">
                                                                            Avg
                                                                            Rating
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                                <Card>
                                                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                                                        <div className="text-2xl font-bold text-blue-600">
                                                                            {
                                                                                selectedProperty.totalReviews
                                                                            }
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">
                                                                            Total
                                                                            Reviews
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                                <Card>
                                                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                                                        <div className="text-2xl font-bold text-green-600">
                                                                            {
                                                                                selectedProperty.occupancy
                                                                            }
                                                                            %
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">
                                                                            Occupancy
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                                <Card>
                                                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                                                        <div className="text-2xl font-bold text-purple-600">
                                                                            {
                                                                                selectedProperty.revenue
                                                                            }
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">
                                                                            Revenue
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            </div>

                                                            {/* Category Breakdown */}
                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle className="text-lg">
                                                                        Category
                                                                        Performance
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="space-y-3">
                                                                        {Object.entries(
                                                                            selectedProperty.categoryScores
                                                                        ).map(
                                                                            ([
                                                                                category,
                                                                                score,
                                                                            ]) => (
                                                                                <div
                                                                                    key={
                                                                                        category
                                                                                    }
                                                                                    className="flex items-center justify-between"
                                                                                >
                                                                                    <span className="text-sm capitalize font-medium">
                                                                                        {
                                                                                            category
                                                                                        }
                                                                                    </span>
                                                                                    <div className="flex items-center gap-3">
                                                                                        <Progress
                                                                                            value={
                                                                                                (score /
                                                                                                    5) *
                                                                                                100
                                                                                            }
                                                                                            className="w-24 h-3"
                                                                                        />
                                                                                        <span className="text-sm font-semibold w-10">
                                                                                            {score.toFixed(
                                                                                                1
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>

                                                            {/* Channel Breakdown */}
                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle className="text-lg">
                                                                        Review
                                                                        Sources
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="h-64">
                                                                        <ResponsiveContainer
                                                                            width="100%"
                                                                            height="100%"
                                                                        >
                                                                            <PieChart>
                                                                                <Pie
                                                                                    data={Object.entries(
                                                                                        selectedProperty.channelBreakdown
                                                                                    ).map(
                                                                                        ([
                                                                                            channel,
                                                                                            count,
                                                                                        ]) => ({
                                                                                            name: channel,
                                                                                            value: count,
                                                                                        })
                                                                                    )}
                                                                                    cx="50%"
                                                                                    cy="50%"
                                                                                    labelLine={
                                                                                        false
                                                                                    }
                                                                                    label={({
                                                                                        name,
                                                                                        percent,
                                                                                    }: any) =>
                                                                                        `${name} ${(
                                                                                            percent *
                                                                                            100
                                                                                        ).toFixed(
                                                                                            0
                                                                                        )}%`
                                                                                    }
                                                                                    outerRadius={
                                                                                        80
                                                                                    }
                                                                                    fill="#8884d8"
                                                                                    dataKey="value"
                                                                                >
                                                                                    {Object.entries(
                                                                                        selectedProperty.channelBreakdown
                                                                                    ).map(
                                                                                        (
                                                                                            entry,
                                                                                            index
                                                                                        ) => (
                                                                                            <Cell
                                                                                                key={`cell-${index}`}
                                                                                                fill={
                                                                                                    COLORS[
                                                                                                        index %
                                                                                                            COLORS.length
                                                                                                    ]
                                                                                                }
                                                                                            />
                                                                                        )
                                                                                    )}
                                                                                </Pie>
                                                                                <Tooltip />
                                                                            </PieChart>
                                                                        </ResponsiveContainer>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </TabsContent>

                                                        <TabsContent
                                                            value="reviews"
                                                            className="space-y-4"
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <h3 className="text-lg font-semibold">
                                                                    Review
                                                                    Management
                                                                </h3>
                                                                <div className="flex gap-2">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-green-700 border-green-200"
                                                                    >
                                                                        {
                                                                            selectedProperty.publicDisplayCount
                                                                        }{" "}
                                                                        Public
                                                                    </Badge>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-yellow-700 border-yellow-200"
                                                                    >
                                                                        {
                                                                            selectedProperty.pendingReviews
                                                                        }{" "}
                                                                        Pending
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                            <Card>
                                                                <CardContent className="p-4">
                                                                    <div className="text-center py-8">
                                                                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                                            Review
                                                                            Management
                                                                        </h3>
                                                                        <p className="text-gray-600 mb-4">
                                                                            Manage
                                                                            which
                                                                            reviews
                                                                            are
                                                                            displayed
                                                                            publicly
                                                                            for
                                                                            this
                                                                            property
                                                                        </p>
                                                                        <Link
                                                                            href={`/dashboard/reviews?property=${encodeURIComponent(
                                                                                selectedProperty.name
                                                                            )}`}
                                                                        >
                                                                            <Button>
                                                                                <Globe className="h-4 w-4 mr-2" />
                                                                                Manage
                                                                                Public
                                                                                Reviews
                                                                            </Button>
                                                                        </Link>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>

                                                            {selectedProperty
                                                                .topIssues
                                                                .length > 0 && (
                                                                <Card>
                                                                    <CardHeader>
                                                                        <CardTitle className="text-lg flex items-center gap-2">
                                                                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                                                                            Common
                                                                            Issues
                                                                        </CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent>
                                                                        <div className="space-y-2">
                                                                            {selectedProperty.topIssues.map(
                                                                                (
                                                                                    issue,
                                                                                    index
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="flex items-center gap-2"
                                                                                    >
                                                                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                                                                        <span className="text-sm">
                                                                                            {
                                                                                                issue
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            )}
                                                        </TabsContent>

                                                        <TabsContent
                                                            value="trends"
                                                            className="space-y-4"
                                                        >
                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle className="text-lg">
                                                                        Rating
                                                                        Trends
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="h-64">
                                                                        <ResponsiveContainer
                                                                            width="100%"
                                                                            height="100%"
                                                                        >
                                                                            <LineChart
                                                                                data={
                                                                                    selectedProperty.monthlyTrend
                                                                                }
                                                                            >
                                                                                <CartesianGrid strokeDasharray="3 3" />
                                                                                <XAxis dataKey="month" />
                                                                                <YAxis
                                                                                    domain={[
                                                                                        0,
                                                                                        5,
                                                                                    ]}
                                                                                />
                                                                                <Tooltip />
                                                                                <Line
                                                                                    type="monotone"
                                                                                    dataKey="rating"
                                                                                    stroke="#284E4C"
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                />
                                                                            </LineChart>
                                                                        </ResponsiveContainer>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>

                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle className="text-lg">
                                                                        Review
                                                                        Volume
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="h-64">
                                                                        <ResponsiveContainer
                                                                            width="100%"
                                                                            height="100%"
                                                                        >
                                                                            <BarChart
                                                                                data={
                                                                                    selectedProperty.monthlyTrend
                                                                                }
                                                                            >
                                                                                <CartesianGrid strokeDasharray="3 3" />
                                                                                <XAxis dataKey="month" />
                                                                                <YAxis />
                                                                                <Tooltip />
                                                                                <Bar
                                                                                    dataKey="count"
                                                                                    fill="#284E4C"
                                                                                />
                                                                            </BarChart>
                                                                        </ResponsiveContainer>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </TabsContent>
                                                    </Tabs>
                                                )}
                                            </DialogContent>
                                        </Dialog>

                                        <Link
                                            href={`/property/${property.name
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`}
                                        >
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                        </Link>

                                        {property.pendingReviews > 0 && (
                                            <Link
                                                href={`/dashboard/reviews?property=${encodeURIComponent(
                                                    property.name
                                                )}`}
                                            >
                                                <Button
                                                    size="sm"
                                                    className="bg-[#284E4C] hover:bg-[#1a3531]"
                                                >
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    Review
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredAndSortedProperties.length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No properties found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            No properties match your current filters. Try
                            adjusting your search criteria.
                        </p>
                        <Button variant="outline" onClick={clearAllFilters}>
                            Clear All Filters
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
