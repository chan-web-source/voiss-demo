export interface HostawayReview {
    id: number;
    type: "host-to-guest" | "guest-to-host";
    status: "published" | "pending" | "rejected";
    rating: number | null;
    publicReview: string;
    reviewCategory: {
        category: string;
        rating: number;
    }[];
    submittedAt: string;
    guestName: string;
    listingName: string;
}

export interface NormalizedReview {
    id: number;
    type: "host-to-guest" | "guest-to-host";
    status:
    | "published"
    | "pending"
    | "rejected"
    | "PUBLISHED"
    | "PENDING"
    | "REJECTED";
    overallRating: number;
    review: string;
    categories: {
        cleanliness?: number;
        communication?: number;
        respect_house_rules?: number;
        location?: number;
        checkin?: number;
        accuracy?: number;
        value?: number;
    };
    submittedAt: Date;
    guestName: string;
    listingName: string;
    channel: "hostaway" | "google" | "airbnb" | "booking" | "direct";
    isApproved: boolean;
    managerNotes?: string;
}

export interface ReviewFilters {
    rating?: number;
    category?: string;
    channel?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    listing?: string;
}

export interface ReviewAnalytics {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
    categoryAverages: Record<string, number>;
    channelBreakdown: Record<string, number>;
    monthlyTrends: Array<{
        month: string;
        count: number;
        averageRating: number;
    }>;
    topProperties: Array<{
        name: string;
        count: number;
        averageRating: number;
    }>;
    commonIssues: Array<{
        issue: string;
        count: number;
        severity: string;
    }>;
    performanceAlerts: Array<{
        title: string;
        message: string;
        priority: string;
    }>;
}

// Kayak API Types
export interface KayakReview {
    id: string;
    localizedMonthYear: string;
    score: number;
    localizedRatingCategory: string;
    positiveComment: string;
    negativeComment: string;
    author: string;
    siteLink: string;
    siteName: string;
    siteLogo: string;
    internal: boolean;
    localizedScore: string;
}

export interface KayakReviewsResponse {
    reviewCount: number;
    reviews: KayakReview[];
}

export interface FetchKayakReviewsParams {
    travelerTypes?: string;
    months?: string;
    tagClusterName?: string;
    searchText?: string;
    reviewSources?: string;
    sortType?: string;
    includeReviewLink?: boolean;
    reviewType?: string;
    objectId?: string;
    includeObjectId?: boolean;
    startIndex?: number;
    amount?: number;
}
