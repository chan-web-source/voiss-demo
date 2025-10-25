"use client";

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import {
 Search,
 MapPin,
 Star,
 TrendingUp,
 TrendingDown,
 SortAsc,
 SortDesc,
} from "lucide-react";
import type { PropertyData } from "../../../types/dashboard";

interface PropertiesPageProps {
 properties: PropertyData[];
 searchQuery: string;
 selectedCity: string;
 selectedPropertyType: string;
 sortBy: string;
 sortOrder: "asc" | "desc";
 onSearchChange: (value: string) => void;
 onCityChange: (value: string) => void;
 onPropertyTypeChange: (value: string) => void;
 onSortByChange: (value: string) => void;
 onSortOrderChange: () => void;
}

export default function PropertiesPage({
 properties,
 searchQuery,
 selectedCity,
 selectedPropertyType,
 sortBy,
 sortOrder,
 onSearchChange,
 onCityChange,
 onPropertyTypeChange,
 onSortByChange,
 onSortOrderChange,
}: PropertiesPageProps) {
 if (!properties || properties.length === 0) {
  return (
   <div className="bg-[#fffdf6]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
     <div className="text-center py-12">
      <p className="text-gray-500">No properties found</p>
     </div>
    </div>
   </div>
  );
 }

 return (
  <div className="bg-[#fffdf6]">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Filters and Search */}
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
       <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
         placeholder="Search properties..."
         value={searchQuery}
         onChange={(e) => onSearchChange(e.target.value)}
         className="pl-10 w-full sm:w-64"
        />
       </div>

       <Select value={selectedCity} onValueChange={onCityChange}>
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

       <Select value={selectedPropertyType} onValueChange={onPropertyTypeChange}>
        <SelectTrigger className="w-full sm:w-40">
         <SelectValue placeholder="Type" />
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
        <Select value={sortBy} onValueChange={onSortByChange}>
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
        onClick={onSortOrderChange}
       >
        {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
       </Button>
      </div>
     </div>
    </div>

    {/* Properties Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
     {properties.map((property) => (
      <Card key={property.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
       <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
         <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
           {property.name}
          </CardTitle>
          <div className="flex items-center text-sm text-gray-600 mb-2">
           <MapPin className="h-4 w-4 mr-1" />
           {property.location}
          </div>
          <div className="flex items-center gap-2">
           <Badge variant="outline" className="text-xs">
            {property.city}
           </Badge>
           <Badge variant="outline" className="text-xs">
            {property.type}
           </Badge>
           <Badge
            variant={property.status === 'Active' ? 'default' : 'secondary'}
            className="text-xs"
           >
            {property.status}
           </Badge>
          </div>
         </div>
         <div className="text-right">
          <div className="flex items-center text-yellow-600">
           <Star className="h-4 w-4 fill-current mr-1" />
           <span className="font-semibold">{property.rating}</span>
          </div>
          <p className="text-xs text-gray-500">{property.totalReviews} reviews</p>
         </div>
        </div>
       </CardHeader>
       <CardContent>
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
         <div>
          <p className="text-xs text-gray-500">Total Bookings</p>
          <p className="font-semibold text-gray-900">{property.totalBookings}</p>
          <p className={`text-xs flex items-center ${property.bookingsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
           {property.bookingsChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
           {Math.abs(property.bookingsChange)}%
          </p>
         </div>
         <div>
          <p className="text-xs text-gray-500">Cancellations</p>
          <p className="font-semibold text-gray-900">{property.cancellations}</p>
          <p className="text-xs text-gray-500">{property.cancellationRate}% rate</p>
         </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
         <div>
          <p className="text-xs text-gray-500">Net Profit</p>
          <p className="font-semibold text-gray-900">£{property.netProfit.toLocaleString()}</p>
          <p className="text-xs text-green-600">{property.profitMargin}% margin</p>
         </div>
         <div>
          <p className="text-xs text-gray-500">Avg Stay</p>
          <p className="font-semibold text-gray-900">{property.averageStayLength} days</p>
          <p className="text-xs text-gray-500">per booking</p>
         </div>
        </div>

        {/* Category Ratings */}
        <div className="mb-4">
         <p className="text-xs text-gray-500 mb-2">Category Ratings</p>
         <div className="grid grid-cols-2 gap-2">
          <div className="flex justify-between items-center">
           <span className="text-xs text-gray-600">Cleanliness</span>
           <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.cleanliness}/10</span>
          </div>
          <div className="flex justify-between items-center">
           <span className="text-xs text-gray-600">Communication</span>
           <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.communication}/10</span>
          </div>
          <div className="flex justify-between items-center">
           <span className="text-xs text-gray-600">Location</span>
           <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.location}/10</span>
          </div>
          <div className="flex justify-between items-center">
           <span className="text-xs text-gray-600">Check-in</span>
           <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.checkin}/10</span>
          </div>
          <div className="flex justify-between items-center">
           <span className="text-xs text-gray-600">Accuracy</span>
           <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.accuracy}/10</span>
          </div>
          <div className="flex justify-between items-center">
           <span className="text-xs text-gray-600">Value</span>
           <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.value}/10</span>
          </div>
         </div>
        </div>

        <div className="flex items-center justify-between">
         <div className="text-sm text-gray-600">
          Next: {new Date(property.nextBooking).toLocaleDateString()}
         </div>
         <Button variant="outline" size="sm">
          View Details
         </Button>
        </div>
       </CardContent>
      </Card>
     ))}
    </div>
   </div>
  </div>
 );
}
