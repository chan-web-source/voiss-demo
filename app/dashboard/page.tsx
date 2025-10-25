"use client";

import { useState } from "react";

export const dynamic = 'force-dynamic';
import { FlexHeader } from "@/components/flex-header";
import { FlexPanel } from "@/components/flex-panel";
import { FlexFooter } from "@/components/flex-footer";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Download } from "lucide-react";
import StatsPage from "./stats/page";
import InsightsPage from "./insights/page";
import PropertiesPage from "./properties/page";
import ReviewsPage from "./reviews/page";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { mockProperties, mockReviews, mockDashboardStats } from "../../lib/mock-dashboard-data";
import type { PropertyData, ReviewData, DashboardStats } from "../../types/dashboard";
import { mockAnalyticsData } from "../../lib/mock-analytics-data";
import { toast } from "@/hooks/use-toast";

export default function ManagerDashboard() {
    const [timeRange, setTimeRange] = useState("all");
    const [activeTab, setActiveTab] = useState("properties");
    const [properties, setProperties] = useState<PropertyData[]>(mockProperties);
    const [reviews, setReviews] = useState<ReviewData[]>(mockReviews);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats>(mockDashboardStats);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState<string>("all");
    const [selectedPropertyType, setSelectedPropertyType] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("rating");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Performance section filter states (separate from header)
    const [performanceTimeRange, setPerformanceTimeRange] = useState("all");
    const [performanceCity, setPerformanceCity] = useState<string>("all");
    const [performancePropertyType, setPerformancePropertyType] = useState<string>("all");
    const [performanceSortBy, setPerformanceSortBy] = useState<string>("rating");
    const [performanceSortOrder, setPerformanceSortOrder] = useState<"asc" | "desc">("desc");

    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Filter and sort properties
    const filteredProperties = properties
        .filter((property) => {
            const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = selectedCity === "all" || property.city === selectedCity;
            const matchesType = selectedPropertyType === "all" || property.type === selectedPropertyType;
            return matchesSearch && matchesCity && matchesType;
        })
        .sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case "rating":
                    aValue = a.rating;
                    bValue = b.rating;
                    break;
                case "revenue":
                    aValue = a.revenue;
                    bValue = b.revenue;
                    break;
                case "occupancy":
                    aValue = a.occupancyRate;
                    bValue = b.occupancyRate;
                    break;
                case "reviews":
                    aValue = a.totalReviews;
                    bValue = b.totalReviews;
                    break;
                default:
                    aValue = a.rating;
                    bValue = b.rating;
            }

            if (sortOrder === "asc") {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });

    const handleRefresh = () => {
        setRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const handleReviewToggle = (reviewId: string, isPublic: boolean) => {
        //TODO: Set API Update handling when API is ready
        setReviews(prev => prev.map(review =>
            review.id === reviewId ? { ...review, isPublic } : review
        ));
    };

    const handleReviewApprove = (reviewId: string, approved: boolean) => {
        setReviews(prev => prev.map(review =>
            review.id === reviewId ? { ...review, isApproved: approved } : review
        ));
    };

    return (
        <div className="min-h-screen bg-[#FFFDF6]">
            <FlexHeader onMenuToggle={toggleSidebar} />

            <div className="flex">
                {/* Sidebar */}
                <FlexPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />

                {/* Main Content */}
                <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0 md:ml-64 lg:ml-64' : 'ml-0'
                    }`}>
                    {/* Dashboard Header */}
                    <div className="bg-[#fffdf6] shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Property Management Dashboard</h1>
                                    <p className="text-sm text-gray-600 mt-1">Monitor and manage your property portfolio</p>
                                </div>
                                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                    <Select value={timeRange} onValueChange={setTimeRange}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Time range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All time</SelectItem>
                                            <SelectItem value="7d">Last 7 days</SelectItem>
                                            <SelectItem value="30d">Last 30 days</SelectItem>
                                            <SelectItem value="90d">Last 3 months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        onClick={handleRefresh}
                                        disabled={refreshing}
                                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                                        Refresh
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <StatsPage stats={dashboardStats} />


                    {/* Analytics Dashboard */}
                    <div className="bg-[#fffdf6]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <AnalyticsDashboard
                                analytics={mockAnalyticsData}
                                reviews={reviews}
                            />
                        </div>
                    </div>

                    {/* Per-Property Performance Section */}
                    <div className="bg-[#fffdf6]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Per-Property Performance</h2>
                                <p className="text-sm text-gray-600">See per-property performance - Filter or sort by rating, category, channel, or time</p>
                            </div>

                            {/* Performance Filters */}
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Select value={performanceTimeRange} onValueChange={setPerformanceTimeRange}>
                                            <SelectTrigger className="w-full sm:w-40">
                                                <SelectValue placeholder="Time Range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Time</SelectItem>
                                                <SelectItem value="7d">Last 7 days</SelectItem>
                                                <SelectItem value="30d">Last 30 days</SelectItem>
                                                <SelectItem value="90d">Last 3 months</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={performanceCity} onValueChange={setPerformanceCity}>
                                            <SelectTrigger className="w-full sm:w-40">
                                                <SelectValue placeholder="City" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Cities</SelectItem>
                                                <SelectItem value="London">London</SelectItem>
                                                <SelectItem value="Paris">Paris</SelectItem>
                                                <SelectItem value="Algiers">Algiers</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={performancePropertyType} onValueChange={setPerformancePropertyType}>
                                            <SelectTrigger className="w-full sm:w-40">
                                                <SelectValue placeholder="Property Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="Apartment">Apartment</SelectItem>
                                                <SelectItem value="Studio">Studio</SelectItem>
                                                <SelectItem value="House">House</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Sort by:</span>
                                            <Select value={performanceSortBy} onValueChange={setPerformanceSortBy}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="rating">Rating</SelectItem>
                                                    <SelectItem value="revenue">Revenue</SelectItem>
                                                    <SelectItem value="occupancy">Occupancy</SelectItem>
                                                    <SelectItem value="reviews">Reviews</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPerformanceSortOrder(performanceSortOrder === "asc" ? "desc" : "asc")}
                                        >
                                            {performanceSortOrder === "asc" ? "↑" : "↓"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Revenue Performance Chart */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Performance</h3>
                                    <div className="h-64 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-blue-600 mb-2">£{filteredProperties.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}</div>
                                            <div className="text-sm text-gray-600">Total Revenue ({filteredProperties.length} properties)</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Distribution Chart */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                                    <div className="h-64 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-green-600 mb-2">{(filteredProperties.reduce((sum, p) => sum + p.rating, 0) / filteredProperties.length).toFixed(1)}</div>
                                            <div className="text-sm text-gray-600">Average Rating</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics Table */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="px-6 py-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredProperties.map((property) => (
                                                <tr key={property.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{property.name}</div>
                                                            <div className="text-sm text-gray-500">{property.location}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="text-sm font-medium text-gray-900">{property.rating}</span>
                                                            <span className="text-xs text-gray-500 ml-1">/5</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        £{property.revenue.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {property.occupancyRate}%
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {property.totalReviews}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${property.status === 'Active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {property.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Insights Section */}
                    <InsightsPage />

                    {/* Properties Section */}
                    <PropertiesPage
                        properties={filteredProperties}
                        searchQuery={searchQuery}
                        selectedCity={selectedCity}
                        selectedPropertyType={selectedPropertyType}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSearchChange={setSearchQuery}
                        onCityChange={setSelectedCity}
                        onPropertyTypeChange={setSelectedPropertyType}
                        onSortByChange={setSortBy}
                        onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    />

                    {/* Review Selection */}
                    <ReviewsPage
                        reviews={reviews}
                        onReviewToggle={handleReviewToggle}
                    />

                    <FlexFooter />
                </div>
            </div>
        </div>
    );
}