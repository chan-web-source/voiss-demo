export interface PropertyData {
 id: string;
 name: string;
 location: string;
 city: 'London' | 'Paris' | 'Algiers';
 type: 'Apartment' | 'Studio' | 'House';
 bedrooms: number;
 bathrooms: number;
 rating: number;
 totalReviews: number;
 occupancyRate: number;
 revenue: number;
 revenueChange: number;
 lastUpdated: string;
 status: 'Active' | 'Maintenance' | 'Vacant';
 image: string;
 // New rental performance metrics
 totalBookings: number;
 bookingsChange: number;
 cancellations: number;
 cancellationRate: number;
 averageStayLength: number;
 cleaningFees: number;
 maintenanceCosts: number;
 netProfit: number;
 profitMargin: number;
 lastBooking: string;
 nextBooking: string;
 categoryRatings: {
  cleanliness: number;
  communication: number;
  location: number;
  checkin: number;
  accuracy: number;
  value: number;
 };
}

export interface ReviewData {
 id: string;
 propertyId: string;
 propertyName: string;
 guestName: string;
 rating: number;
 comment: string;
 channel: 'The Flex';
 category: 'Cleanliness' | 'Location' | 'Value' | 'Communication' | 'Check-in';
 submittedAt: string;
 isApproved: boolean;
 isPublic: boolean;
 managerNotes?: string;
}

export interface DashboardStats {
 totalRevenue: number;
 revenueChange: number;
 totalProperties: number;
 propertiesChange: number;
 totalReviews: number;
 reviewsChange: number;
 averageRating: number;
 ratingChange: number;
 occupancyRate: number;
 occupancyChange: number;
 responseRate: number;
 responseChange: number;
 pendingReviews: number;
 approvedReviews: number;
 rejectedReviews: number;
}
