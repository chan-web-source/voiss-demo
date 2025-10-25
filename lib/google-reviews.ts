// Google Places API integration for Flex Living Reviews Dashboard
// Note: This is an exploration implementation based on Google Places API (New)

export interface GoogleReview {
    id: string;
    author_name: string;
    author_url?: string;
    profile_photo_url?: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
}

export interface GooglePlaceDetails {
    place_id: string;
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: GoogleReview[];
}

export class GoogleReviewsService {
    private apiKey: string;
    private baseUrl = "https://places.googleapis.com/v1/places";

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Fetch place details including reviews using Google Places API (New)
     * Requires: Places API enabled, valid API key, billing account
     */
    async getPlaceReviews(placeId: string): Promise<GooglePlaceDetails | null> {
        try {
            const response = await fetch(`${this.baseUrl}/${placeId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": this.apiKey,
                    "X-Goog-FieldMask":
                        "id,displayName,rating,userRatingCount,reviews",
                },
            });

            if (!response.ok) {
                throw new Error(`Google API error: ${response.status}`);
            }

            const data = await response.json();

            return {
                place_id: data.id,
                name: data.displayName?.text || "",
                rating: data.rating || 0,
                user_ratings_total: data.userRatingCount || 0,
                reviews:
                    data.reviews?.map((review: any) => ({
                        id: review.name,
                        author_name:
                            review.authorAttribution?.displayName ||
                            "Anonymous",
                        author_url: review.authorAttribution?.uri,
                        profile_photo_url: review.authorAttribution?.photoUri,
                        rating: review.rating || 0,
                        relative_time_description:
                            review.relativePublishTimeDescription || "",
                        text: review.text?.text || "",
                        time: new Date(review.publishTime).getTime() / 1000,
                    })) || [],
            };
        } catch (error) {
            console.error("Error fetching Google reviews:", error);
            return null;
        }
    }

    /**
     * Search for a place by name and address to get place_id
     */
    async searchPlace(query: string): Promise<string | null> {
        try {
            const response = await fetch(`${this.baseUrl}:searchText`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": this.apiKey,
                    "X-Goog-FieldMask": "places.id,places.displayName",
                },
                body: JSON.stringify({
                    textQuery: query,
                    maxResultCount: 1,
                }),
            });

            if (!response.ok) {
                throw new Error(`Google API error: ${response.status}`);
            }

            const data = await response.json();
            return data.places?.[0]?.id || null;
        } catch (error) {
            console.error("Error searching place:", error);
            return null;
        }
    }
}

/**
 * Normalize Google Review to match our internal NormalizedReview format
 */
export function normalizeGoogleReview(review: GoogleReview, placeName: string) {
    return {
        id:
            parseInt(review.id.replace(/\D/g, "")) ||
            Math.floor(Math.random() * 1000000), // Extract number from ID or generate random
        type: "guest-to-host" as const,
        status: "published" as const,
        overallRating: review.rating,
        review: review.text,
        categories: {
            // Google doesn't provide category breakdowns, so we estimate based on content
            cleanliness: review.rating,
            communication: review.rating,
            location: review.rating,
            accuracy: review.rating,
            value: review.rating,
        },
        submittedAt: new Date(review.time * 1000),
        guestName: review.author_name,
        listingName: placeName,
        channel: "google" as const,
        isApproved: true, // Google reviews are public by default
    };
}
