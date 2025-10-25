"use client";

import { Input } from "@/components/ui/input";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReviewData } from "../../../types/dashboard";

export const dynamic = 'force-dynamic';

interface ReviewsFiltersProps {
 reviews: ReviewData[];
 searchQuery: string;
 selectedProperty: string;
 selectedStatus: string;
 sortBy: string;
 sortOrder: "asc" | "desc";
 showOnlyPublic: boolean;
 showAllReviews: boolean;
 onSearchChange: (value: string) => void;
 onPropertyChange: (value: string) => void;
 onStatusChange: (value: string) => void;
 onSortByChange: (value: string) => void;
 onSortOrderChange: () => void;
 onShowOnlyPublicChange: (checked: boolean) => void;
 onShowAllReviewsChange: (checked: boolean) => void;
}

export default function ReviewsFilters({
 reviews,
 searchQuery,
 selectedProperty,
 selectedStatus,
 sortBy,
 sortOrder,
 showOnlyPublic,
 showAllReviews,
 onSearchChange,
 onPropertyChange,
 onStatusChange,
 onSortByChange,
 onSortOrderChange,
 onShowOnlyPublicChange,
 onShowAllReviewsChange,
}: ReviewsFiltersProps) {
 const uniqueProperties = Array.from(new Set((reviews || []).map(r => r.propertyName)));

 return (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div className="flex flex-col sm:flex-row gap-4">
     <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
       placeholder="Search reviews..."
       value={searchQuery}
       onChange={(e) => onSearchChange(e.target.value)}
       className="pl-10 w-full sm:w-64"
      />
     </div>

     <Select value={selectedProperty} onValueChange={onPropertyChange}>
      <SelectTrigger className="w-full sm:w-48">
       <SelectValue placeholder="Property" />
      </SelectTrigger>
      <SelectContent>
       <SelectItem value="all">All Properties</SelectItem>
       {uniqueProperties.map((property) => (
        <SelectItem key={property} value={property}>
         {property}
        </SelectItem>
       ))}
      </SelectContent>
     </Select>

     <Select value={selectedStatus} onValueChange={onStatusChange}>
      <SelectTrigger className="w-full sm:w-40">
       <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
       <SelectItem value="all">All Status</SelectItem>
       <SelectItem value="approved">Approved</SelectItem>
       <SelectItem value="pending">Pending</SelectItem>
      </SelectContent>
     </Select>
    </div>

    <div className="flex items-center gap-4">
     <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <Select value={sortBy} onValueChange={onSortByChange}>
       <SelectTrigger className="w-32">
        <SelectValue />
       </SelectTrigger>
       <SelectContent>
        <SelectItem value="date">Date</SelectItem>
        <SelectItem value="rating">Rating</SelectItem>
        <SelectItem value="property">Property</SelectItem>
       </SelectContent>
      </Select>
     </div>

     <Button
      variant="outline"
      size="sm"
      onClick={onSortOrderChange}
     >
      {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
     </Button>
    </div>
   </div>

   <div className="flex items-center gap-4 mt-4">
    <div className="flex items-center gap-2">
     <Checkbox
      id="show-only-public"
      checked={showOnlyPublic}
      onCheckedChange={(checked) => onShowOnlyPublicChange(checked === true)}
     />
     <label htmlFor="show-only-public" className="text-sm text-gray-600">
      Show only public reviews
     </label>
    </div>
    <div className="flex items-center gap-2">
     <Checkbox
      id="show-all-reviews"
      checked={showAllReviews}
      onCheckedChange={(checked) => onShowAllReviewsChange(checked === true)}
     />
     <label htmlFor="show-all-reviews" className="text-sm text-gray-600">
      Show all reviews (admin view)
     </label>
    </div>
   </div>
  </div>
 );
}
