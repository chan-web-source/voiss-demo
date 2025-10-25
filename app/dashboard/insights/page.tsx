"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
 TrendingUp as TrendingUpIcon,
 BookOpen,
 Calendar,
 Clock,
 AlertCircle,
 AlertTriangle,
 X,
 Zap,
 Activity,
 Target,
 TrendingUp,
 DollarSign,
} from "lucide-react";

export default function InsightsPage() {
 return (
  <div className="bg-[#fffdf6] shadow-lg">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
     {/* Booking Trends */}
     <Card className="bg-white shadow-lg">
      <CardHeader>
       <CardTitle className="flex items-center gap-2">
        <TrendingUpIcon className="h-5 w-5 text-blue-600" />
        Booking Trends
       </CardTitle>
       <p className="text-sm text-gray-600">Most popular booking patterns and channels</p>
      </CardHeader>
      <CardContent>
       <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
         <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
           <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
           <p className="font-medium text-gray-900">Airbnb Dominance</p>
           <p className="text-sm text-gray-600">Highest booking channel</p>
          </div>
         </div>
         <div className="text-right">
          <p className="text-lg font-bold text-blue-600">68%</p>
          <p className="text-xs text-gray-500">of bookings</p>
         </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
         <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
           <Calendar className="h-4 w-4 text-green-600" />
          </div>
          <div>
           <p className="font-medium text-gray-900">Weekend Bookings</p>
           <p className="text-sm text-gray-600">Peak booking days</p>
          </div>
         </div>
         <div className="text-right">
          <p className="text-lg font-bold text-green-600">Fri-Sun</p>
          <p className="text-xs text-gray-500">peak days</p>
         </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
         <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
           <Clock className="h-4 w-4 text-purple-600" />
          </div>
          <div>
           <p className="font-medium text-gray-900">Short Stays</p>
           <p className="text-sm text-gray-600">Average booking length</p>
          </div>
         </div>
         <div className="text-right">
          <p className="text-lg font-bold text-purple-600">3.2 days</p>
          <p className="text-xs text-gray-500">average</p>
         </div>
        </div>
       </div>
      </CardContent>
     </Card>

     {/* Recurring Issues */}
     <Card className="bg-white shadow-lg">
      <CardHeader>
       <CardTitle className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        Recurring Issues
       </CardTitle>
       <p className="text-sm text-gray-600">Common problems and maintenance needs</p>
      </CardHeader>
      <CardContent>
       <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg shadow-sm">
         <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
           <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div>
           <p className="font-medium text-gray-900">Wi-Fi Issues</p>
           <p className="text-sm text-gray-600">Most reported problem</p>
          </div>
         </div>
         <div className="text-right">
          <p className="text-lg font-bold text-amber-600">12</p>
          <p className="text-xs text-gray-500">reports</p>
         </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg shadow-sm">
         <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
           <X className="h-4 w-4 text-red-600" />
          </div>
          <div>
           <p className="font-medium text-gray-900">Cleaning Delays</p>
           <p className="text-sm text-gray-600">Turnover issues</p>
          </div>
         </div>
         <div className="text-right">
          <p className="text-lg font-bold text-red-600">8</p>
          <p className="text-xs text-gray-500">incidents</p>
         </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg shadow-sm">
         <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
           <Zap className="h-4 w-4 text-orange-600" />
          </div>
          <div>
           <p className="font-medium text-gray-900">Power Outages</p>
           <p className="text-sm text-gray-600">Infrastructure issues</p>
          </div>
         </div>
         <div className="text-right">
          <p className="text-lg font-bold text-orange-600">5</p>
          <p className="text-xs text-gray-500">outages</p>
         </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg shadow-sm">
         <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
           <Activity className="h-4 w-4 text-blue-600" />
          </div>
          <div>
           <p className="font-medium text-gray-900">Maintenance Requests</p>
           <p className="text-sm text-gray-600">Regular upkeep needed</p>
          </div>
         </div>
         <div className="text-right">
          <p className="text-lg font-bold text-blue-600">23</p>
          <p className="text-xs text-gray-500">pending</p>
         </div>
        </div>
       </div>
      </CardContent>
     </Card>
    </div>

    {/* Performance Insights */}
    <Card className="bg-white shadow-lg mb-8">
     <CardHeader>
      <CardTitle className="flex items-center gap-2">
       <Target className="h-5 w-5 text-green-600" />
       Performance Insights
      </CardTitle>
      <p className="text-sm text-gray-600">Key metrics and recommendations for optimization</p>
     </CardHeader>
     <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
         <TrendingUp className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Top Performer</h3>
        <p className="text-sm text-gray-600 mb-2">Canary Wharf Tower</p>
        <p className="text-xs text-green-600">92% occupancy rate</p>
       </div>

       <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
         <DollarSign className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Revenue Leader</h3>
        <p className="text-sm text-gray-600 mb-2">Champs-Élysées Flat</p>
        <p className="text-xs text-blue-600">£18,750 monthly revenue</p>
       </div>

       <div className="text-center p-4 bg-amber-50 rounded-lg">
        <div className="p-3 bg-amber-100 rounded-full w-fit mx-auto mb-3">
         <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Needs Attention</h3>
        <p className="text-sm text-gray-600 mb-2">Fitzrovia Studio</p>
        <p className="text-xs text-amber-600">13.5% cancellation rate</p>
       </div>
      </div>
     </CardContent>
    </Card>
   </div>
  </div>
 );
}
