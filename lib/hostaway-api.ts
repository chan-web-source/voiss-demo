import type { HostawayReview, NormalizedReview } from "@/types/review";

const HOSTAWAY_API_BASE = "https://api.hostaway.com/v1";
const ACCOUNT_ID = "61148";
const API_KEY =
    "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152";

// Mock data for development since the sandbox API has no reviews
const MOCK_REVIEWS: HostawayReview[] = [
    {
        id: 7453,
        type: "guest-to-host",
        status: "published",
        rating: null,
        publicReview:
            "Amazing stay! The apartment was spotless and exactly as described. Great location in Shoreditch with easy access to everything. Would definitely stay again!",
        reviewCategory: [
            { category: "cleanliness", rating: 10 },
            { category: "communication", rating: 9 },
            { category: "respect_house_rules", rating: 10 },
            { category: "location", rating: 10 },
            { category: "checkin", rating: 9 },
            { category: "accuracy", rating: 10 },
            { category: "value", rating: 8 },
        ],
        submittedAt: "2024-01-15 14:30:22",
        guestName: "Sarah Johnson",
        listingName: "2B N1 A - 29 Shoreditch Heights",
    },
    {
        id: 7454,
        type: "guest-to-host",
        status: "published",
        rating: null,
        publicReview:
            "Good location but the apartment could use some updates. The bed was comfortable and check-in was smooth.",
        reviewCategory: [
            { category: "cleanliness", rating: 7 },
            { category: "communication", rating: 8 },
            { category: "respect_house_rules", rating: 9 },
            { category: "location", rating: 9 },
            { category: "checkin", rating: 9 },
            { category: "accuracy", rating: 6 },
            { category: "value", rating: 7 },
        ],
        submittedAt: "2024-01-12 09:15:33",
        guestName: "Michael Chen",
        listingName: "2B N1 A - 29 Shoreditch Heights",
    },
    {
        id: 7455,
        type: "guest-to-host",
        status: "published",
        rating: null,
        publicReview:
            "Exceptional experience from start to finish. The property exceeded our expectations and the host was incredibly responsive.",
        reviewCategory: [
            { category: "cleanliness", rating: 10 },
            { category: "communication", rating: 10 },
            { category: "respect_house_rules", rating: 10 },
            { category: "location", rating: 9 },
            { category: "checkin", rating: 10 },
            { category: "accuracy", rating: 10 },
            { category: "value", rating: 9 },
        ],
        submittedAt: "2024-01-10 16:45:12",
        guestName: "Emma Williams",
        listingName: "1B E1 B - 15 Canary Wharf Tower",
    },
    {
        id: 7456,
        type: "guest-to-host",
        status: "pending",
        rating: null,
        publicReview:
            "The apartment was nice but there were some cleanliness issues upon arrival. The location is fantastic though.",
        reviewCategory: [
            { category: "cleanliness", rating: 5 },
            { category: "communication", rating: 8 },
            { category: "respect_house_rules", rating: 9 },
            { category: "location", rating: 10 },
            { category: "checkin", rating: 7 },
            { category: "accuracy", rating: 8 },
            { category: "value", rating: 6 },
        ],
        submittedAt: "2024-01-08 11:20:45",
        guestName: "David Rodriguez",
        listingName: "1B E1 B - 15 Canary Wharf Tower",
    },
    {
        id: 7457,
        type: "guest-to-host",
        status: "published",
        rating: null,
        publicReview:
            "Perfect for a business trip. Modern amenities, great WiFi, and close to transport links. Highly recommend!",
        reviewCategory: [
            { category: "cleanliness", rating: 9 },
            { category: "communication", rating: 9 },
            { category: "respect_house_rules", rating: 10 },
            { category: "location", rating: 10 },
            { category: "checkin", rating: 8 },
            { category: "accuracy", rating: 9 },
            { category: "value", rating: 9 },
        ],
        submittedAt: "2024-01-05 13:55:18",
        guestName: "Lisa Thompson",
        listingName: "Studio W1 C - 42 Fitzrovia Square",
    },
    {
        id: 7458,
        type: "guest-to-host",
        status: "published",
        rating: null,
        publicReview:
            "Lovely apartment with beautiful views! Everything was clean and well-maintained. The host was very helpful with local recommendations.",
        reviewCategory: [
            { category: "cleanliness", rating: 9 },
            { category: "communication", rating: 10 },
            { category: "respect_house_rules", rating: 10 },
            { category: "location", rating: 8 },
            { category: "checkin", rating: 9 },
            { category: "accuracy", rating: 9 },
            { category: "value", rating: 8 },
        ],
        submittedAt: "2024-01-03 18:22:15",
        guestName: "James Wilson",
        listingName: "1B E1 B - 15 Canary Wharf Tower",
    },
    {
        id: 7459,
        type: "guest-to-host",
        status: "pending",
        rating: null,
        publicReview:
            "The location is great but the apartment had some maintenance issues. The shower pressure was very low and the heating took a while to work.",
        reviewCategory: [
            { category: "cleanliness", rating: 8 },
            { category: "communication", rating: 7 },
            { category: "respect_house_rules", rating: 9 },
            { category: "location", rating: 9 },
            { category: "checkin", rating: 6 },
            { category: "accuracy", rating: 7 },
            { category: "value", rating: 6 },
        ],
        submittedAt: "2024-01-01 12:18:33",
        guestName: "Maria Garcia",
        listingName: "Studio W1 C - 42 Fitzrovia Square",
    },
    {
        id: 7460,
        type: "guest-to-host",
        status: "published",
        rating: null,
        publicReview:
            "Outstanding property! Modern, clean, and perfectly located. The check-in process was seamless and the apartment had everything we needed.",
        reviewCategory: [
            { category: "cleanliness", rating: 10 },
            { category: "communication", rating: 10 },
            { category: "respect_house_rules", rating: 10 },
            { category: "location", rating: 10 },
            { category: "checkin", rating: 10 },
            { category: "accuracy", rating: 10 },
            { category: "value", rating: 9 },
        ],
        submittedAt: "2023-12-28 14:45:22",
        guestName: "Robert Taylor",
        listingName: "2B N1 A - 29 Shoreditch Heights",
    },
    {
        id: 7461,
        type: "guest-to-host",
        status: "rejected",
        rating: null,
        publicReview:
            "Not satisfied with the cleanliness. Found hair in the bathroom and kitchen was not properly cleaned. Host was unresponsive to our concerns.",
        reviewCategory: [
            { category: "cleanliness", rating: 3 },
            { category: "communication", rating: 4 },
            { category: "respect_house_rules", rating: 8 },
            { category: "location", rating: 8 },
            { category: "checkin", rating: 5 },
            { category: "accuracy", rating: 6 },
            { category: "value", rating: 4 },
        ],
        submittedAt: "2023-12-25 10:30:11",
        guestName: "Anna Brown",
        listingName: "Studio W1 C - 42 Fitzrovia Square",
    },
    {
        id: 7462,
        type: "guest-to-host",
        status: "published",
        rating: null,
        publicReview:
            "Great stay overall. The apartment is well-designed and the location is perfect for exploring London. Would recommend to friends!",
        reviewCategory: [
            { category: "cleanliness", rating: 8 },
            { category: "communication", rating: 9 },
            { category: "respect_house_rules", rating: 10 },
            { category: "location", rating: 10 },
            { category: "checkin", rating: 8 },
            { category: "accuracy", rating: 9 },
            { category: "value", rating: 8 },
        ],
        submittedAt: "2023-12-20 16:12:44",
        guestName: "Sophie Davis",
        listingName: "1B E1 B - 15 Canary Wharf Tower",
    },
];

export async function fetchHostawayReviews(): Promise<HostawayReview[]> {
    try {
        // Try to make real API call first
        const response = await fetch(`${HOSTAWAY_API_BASE}/reviews`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (
                data.status === "success" &&
                data.result &&
                data.result.length > 0
            ) {
                console.log("Successfully fetched reviews from Hostaway API");
                return data.result;
            } else {
                console.log(
                    "Hostaway API returned no reviews, using mock data"
                );
                return MOCK_REVIEWS;
            }
        } else {
            console.log("Hostaway API request failed, using mock data");
            return MOCK_REVIEWS;
        }
    } catch (error) {
        console.error("Error fetching Hostaway reviews:", error);
        console.log("Falling back to mock data");
        return MOCK_REVIEWS; // Fallback to mock data
    }
}

export function normalizeHostawayReview(
    review: HostawayReview
): NormalizedReview {
    // Calculate overall rating from categories
    const categoryRatings = review.reviewCategory.map((cat) => cat.rating);
    const overallRating =
        categoryRatings.length > 0
            ? Math.round(
                  categoryRatings.reduce((sum, rating) => sum + rating, 0) /
                      categoryRatings.length
              )
            : 5;

    // Convert categories to object format
    const categories: NormalizedReview["categories"] = {};
    review.reviewCategory.forEach((cat) => {
        categories[cat.category as keyof NormalizedReview["categories"]] =
            cat.rating;
    });

    return {
        id: review.id,
        type: review.type,
        status: review.status,
        overallRating,
        review: review.publicReview,
        categories,
        submittedAt: new Date(review.submittedAt),
        guestName: review.guestName,
        listingName: review.listingName,
        channel: "hostaway",
        isApproved: review.status === "published",
    };
}

export async function getNormalizedReviews(): Promise<NormalizedReview[]> {
    const hostawayReviews = await fetchHostawayReviews();
    return hostawayReviews.map(normalizeHostawayReview);
}
