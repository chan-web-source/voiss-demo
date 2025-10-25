"use client";

export const dynamic = 'force-dynamic';

import { Card, CardContent } from "@/components/ui/card";
import {
 DollarSign,
 Home,
 Star,
 MessageSquare,
 ArrowUpRight
} from "lucide-react";
import type { DashboardStats } from "../../../types/dashboard";

interface StatsPageProps {
 stats: DashboardStats;
}

export default function StatsPage({ stats }: StatsPageProps) {
 if (!stats) {
  return null;
 }
 return (
  <div className="bg-[#fffdf6] shadow-lg">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
     <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
       <div className="flex items-center">
        <div className="p-2 bg-green-100 rounded-lg">
         <DollarSign className="h-6 w-6 text-green-600" />
        </div>
        <div className="ml-4">
         <p className="text-sm font-medium text-gray-600">Total Revenue</p>
         <p className="text-2xl font-bold text-gray-900">£{stats?.totalRevenue?.toLocaleString()}</p>
         <p className="text-sm text-green-600 flex items-center">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          +{stats.revenueChange}%
         </p>
        </div>
       </div>
      </CardContent>
     </Card>

     <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
       <div className="flex items-center">
        <div className="p-2 bg-blue-100 rounded-lg">
         <Home className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4">
         <p className="text-sm font-medium text-gray-600">Properties</p>
         <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
         <p className="text-sm text-gray-500">Active listings</p>
        </div>
       </div>
      </CardContent>
     </Card>

     <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
       <div className="flex items-center">
        <div className="p-2 bg-yellow-100 rounded-lg">
         <Star className="h-6 w-6 text-yellow-600" />
        </div>
        <div className="ml-4">
         <p className="text-sm font-medium text-gray-600">Avg Rating</p>
         <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
         <p className="text-sm text-green-600 flex items-center">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          +{stats.ratingChange}
         </p>
        </div>
       </div>
      </CardContent>
     </Card>

     <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
       <div className="flex items-center">
        <div className="p-2 bg-purple-100 rounded-lg">
         <MessageSquare className="h-6 w-6 text-purple-600" />
        </div>
        <div className="ml-4">
         <p className="text-sm font-medium text-gray-600">Reviews</p>
         <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
         <p className="text-sm text-amber-600">{stats.pendingReviews} pending</p>
        </div>
       </div>
      </CardContent>
     </Card>
    </div>
   </div>
  </div>
 );
}
