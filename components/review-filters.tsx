"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import type { ReviewFilters as ReviewFiltersType } from "@/types/review";

interface ReviewFiltersProps {
    filters: ReviewFiltersType;
    onFiltersChange: (filters: ReviewFiltersType) => void;
    totalReviews: number;
    filteredReviews: number;
}

export function ReviewFiltersComponent({
    filters,
    onFiltersChange,
    totalReviews,
    filteredReviews,
}: ReviewFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const updateFilter = (
        key: keyof ReviewFiltersType,
        value: string | undefined
    ) => {
        onFiltersChange({
            ...filters,
            [key]: value || undefined,
        });
    };

    const clearFilters = () => {
        onFiltersChange({});
    };

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    return (
        <Card className="mb-8 border-0 shadow-lg bg-white">
            <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 via-white to-slate-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-lg">
                            <Filter className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-slate-900">
                                Filter Reviews
                            </CardTitle>
                            <p className="text-sm text-slate-600 mt-1">
                                Narrow down reviews by various criteria
                            </p>
                        </div>
                        {activeFiltersCount > 0 && (
                            <Badge
                                variant="secondary"
                                className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200 font-medium"
                            >
                                {activeFiltersCount} active
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-full font-medium">
                            <span className="font-semibold text-slate-900">
                                {filteredReviews}
                            </span>{" "}
                            of {totalReviews} reviews
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="bg-white border-[#284E4C]/20 text-[#284E4C] hover:bg-[#284E4C] hover:text-white shadow-sm hover:shadow-lg transition-all duration-200"
                        >
                            {isExpanded ? "Hide Filters" : "Show Filters"}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-3">
                            <Label
                                htmlFor="rating"
                                className="text-sm font-semibold text-slate-900 flex items-center gap-2"
                            >
                                <div className="w-1 h-4 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full"></div>
                                Minimum Rating
                            </Label>
                            <Select
                                value={filters.rating?.toString() || "any"}
                                onValueChange={(value) =>
                                    updateFilter("rating", value)
                                }
                            >
                                <SelectTrigger className="bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
                                    <SelectValue placeholder="Any rating" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="any">
                                        Any rating
                                    </SelectItem>
                                    <SelectItem value="9">
                                        9+ stars ⭐
                                    </SelectItem>
                                    <SelectItem value="8">
                                        8+ stars ⭐
                                    </SelectItem>
                                    <SelectItem value="7">
                                        7+ stars ⭐
                                    </SelectItem>
                                    <SelectItem value="6">
                                        6+ stars ⭐
                                    </SelectItem>
                                    <SelectItem value="5">
                                        5+ stars ⭐
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label
                                htmlFor="status"
                                className="text-sm font-semibold text-slate-900 flex items-center gap-2"
                            >
                                <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                                Status
                            </Label>
                            <Select
                                value={filters.status || "any"}
                                onValueChange={(value) =>
                                    updateFilter("status", value)
                                }
                            >
                                <SelectTrigger className="bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
                                    <SelectValue placeholder="Any status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="any">
                                        Any status
                                    </SelectItem>
                                    <SelectItem value="published">
                                        ✅ Published
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        ⏳ Pending
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        ❌ Rejected
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label
                                htmlFor="channel"
                                className="text-sm font-semibold text-slate-900 flex items-center gap-2"
                            >
                                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full"></div>
                                Channel
                            </Label>
                            <Select
                                value={filters.channel || "any"}
                                onValueChange={(value) =>
                                    updateFilter("channel", value)
                                }
                            >
                                <SelectTrigger className="bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
                                    <SelectValue placeholder="Any channel" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="any">
                                        Any channel
                                    </SelectItem>
                                    <SelectItem value="hostaway">
                                        🏠 Hostaway
                                    </SelectItem>
                                    <SelectItem value="google">
                                        🔍 Google
                                    </SelectItem>
                                    <SelectItem value="airbnb">
                                        🏡 Airbnb
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label
                                htmlFor="listing"
                                className="text-sm font-semibold text-slate-900 flex items-center gap-2"
                            >
                                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                                Property
                            </Label>
                            <Input
                                id="listing"
                                placeholder="Search properties..."
                                value={filters.listing || ""}
                                onChange={(e) =>
                                    updateFilter("listing", e.target.value)
                                }
                                className="bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {activeFiltersCount > 0 && (
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <div className="flex flex-wrap gap-2">
                                {filters.rating && (
                                    <Badge
                                        variant="outline"
                                        className="gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                                    >
                                        Rating: {filters.rating}+
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-yellow-900 transition-colors"
                                            onClick={() =>
                                                updateFilter(
                                                    "rating",
                                                    undefined
                                                )
                                            }
                                        />
                                    </Badge>
                                )}
                                {filters.status && (
                                    <Badge
                                        variant="outline"
                                        className="gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:bg-green-100"
                                    >
                                        Status: {filters.status}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-green-900 transition-colors"
                                            onClick={() =>
                                                updateFilter(
                                                    "status",
                                                    undefined
                                                )
                                            }
                                        />
                                    </Badge>
                                )}
                                {filters.channel && (
                                    <Badge
                                        variant="outline"
                                        className="gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                    >
                                        Channel: {filters.channel}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-blue-900 transition-colors"
                                            onClick={() =>
                                                updateFilter(
                                                    "channel",
                                                    undefined
                                                )
                                            }
                                        />
                                    </Badge>
                                )}
                                {filters.listing && (
                                    <Badge
                                        variant="outline"
                                        className="gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                                    >
                                        Property: {filters.listing}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-purple-900 transition-colors"
                                            onClick={() =>
                                                updateFilter(
                                                    "listing",
                                                    undefined
                                                )
                                            }
                                        />
                                    </Badge>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-[#5C5C5A] hover:text-[#284E4C] hover:bg-[#FFF9E9] font-medium transition-all duration-200"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}

export { ReviewFiltersComponent as ReviewFilters };
