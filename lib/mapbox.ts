/**
 * Mapbox utility functions for geocoding, reverse geocoding, and map operations
 */

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface MapboxFeature {
    id: string;
    place_name: string;
    center: [number, number]; // [longitude, latitude]
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
    properties: {
        accuracy?: string;
        address?: string;
    };
    place_type: string[];
    relevance: number;
    text: string;
}

export interface MapboxGeocodingResponse {
    type: "FeatureCollection";
    query: string[];
    features: MapboxFeature[];
    attribution: string;
}

export interface MapboxDirectionsResponse {
    routes: Array<{
        geometry: any;
        distance: number;
        duration: number;
        weight_name: string;
        weight: number;
        legs: Array<{
            distance: number;
            duration: number;
            summary: string;
            steps: any[];
        }>;
    }>;
    waypoints: Array<{
        distance: number;
        name: string;
        location: [number, number];
    }>;
    code: string;
    uuid: string;
}

class MapboxService {
    private accessToken: string;
    private baseUrl = "https://api.mapbox.com";

    constructor() {
        this.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
        if (!this.accessToken) {
            console.warn(
                "Mapbox access token not found. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment variables."
            );
        }
    }

    /**
     * Geocode an address to get coordinates
     */
    async geocodeAddress(address: string): Promise<Coordinates | null> {
        try {
            const encodedAddress = encodeURIComponent(address);
            const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${this.accessToken}`;

            const response = await fetch(url);
            const data: MapboxGeocodingResponse = await response.json();

            if (data.features && data.features.length > 0) {
                const [longitude, latitude] = data.features[0].center;
                return { latitude, longitude };
            }

            return null;
        } catch (error) {
            console.error("Geocoding error:", error);
            return null;
        }
    }

    /**
     * Reverse geocode coordinates to get an address
     */
    async reverseGeocode(coordinates: Coordinates): Promise<string | null> {
        try {
            const { latitude, longitude } = coordinates;
            const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${this.accessToken}`;

            const response = await fetch(url);
            const data: MapboxGeocodingResponse = await response.json();

            if (data.features && data.features.length > 0) {
                return data.features[0].place_name;
            }

            return null;
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            return null;
        }
    }

    /**
     * Get directions between two points
     */
    async getDirections(
        start: Coordinates,
        end: Coordinates,
        profile: "driving" | "walking" | "cycling" = "driving"
    ): Promise<MapboxDirectionsResponse | null> {
        try {
            const url = `${this.baseUrl}/directions/v5/mapbox/${profile}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${this.accessToken}`;

            const response = await fetch(url);
            const data: MapboxDirectionsResponse = await response.json();

            return data;
        } catch (error) {
            console.error("Directions error:", error);
            return null;
        }
    }

    /**
     * Generate a static map URL
     */
    generateStaticMapUrl(
        coordinates: Coordinates,
        options: {
            width?: number;
            height?: number;
            zoom?: number;
            style?: string;
            marker?: boolean;
            retina?: boolean;
        } = {}
    ): string {
        const {
            width = 400,
            height = 300,
            zoom = 14,
            style = "streets-v11",
            marker = true,
            retina = true,
        } = options;

        const { latitude, longitude } = coordinates;
        const retinaStr = retina ? "@2x" : "";
        const markerStr = marker
            ? `pin-s-l+000(${longitude},${latitude})/`
            : "";

        return `${this.baseUrl}/styles/v1/mapbox/${style}/static/${markerStr}${longitude},${latitude},${zoom},0/${width}x${height}${retinaStr}?access_token=${this.accessToken}`;
    }

    /**
     * Batch geocode multiple addresses
     */
    async batchGeocode(
        addresses: string[]
    ): Promise<Map<string, Coordinates | null>> {
        const results = new Map<string, Coordinates | null>();

        // Process addresses in parallel but with a reasonable limit
        const batchSize = 5;
        for (let i = 0; i < addresses.length; i += batchSize) {
            const batch = addresses.slice(i, i + batchSize);
            const promises = batch.map(async (address) => {
                const coordinates = await this.geocodeAddress(address);
                return { address, coordinates };
            });

            const batchResults = await Promise.all(promises);
            batchResults.forEach(({ address, coordinates }) => {
                results.set(address, coordinates);
            });

            // Add a small delay between batches to respect rate limits
            if (i + batchSize < addresses.length) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }

        return results;
    }

    /**
     * Get nearby places/POIs around coordinates
     */
    async getNearbyPOIs(
        coordinates: Coordinates,
        category: string = "poi",
        radius: number = 1000
    ): Promise<MapboxFeature[]> {
        try {
            const { latitude, longitude } = coordinates;
            const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${category}.json?proximity=${longitude},${latitude}&access_token=${this.accessToken}`;

            const response = await fetch(url);
            const data: MapboxGeocodingResponse = await response.json();

            return data.features || [];
        } catch (error) {
            console.error("POI search error:", error);
            return [];
        }
    }

    /**
     * Validate if the API token is working
     */
    async validateToken(): Promise<boolean> {
        try {
            // Test with a simple geocoding request
            const testCoordinates = await this.geocodeAddress("London");
            return testCoordinates !== null;
        } catch (error) {
            console.error("Token validation error:", error);
            return false;
        }
    }
}

// Export singleton instance
export const mapboxService = new MapboxService();

// Utility functions for React components
export const useMapboxUtils = () => {
    return {
        geocodeAddress: mapboxService.geocodeAddress.bind(mapboxService),
        reverseGeocode: mapboxService.reverseGeocode.bind(mapboxService),
        getDirections: mapboxService.getDirections.bind(mapboxService),
        generateStaticMapUrl:
            mapboxService.generateStaticMapUrl.bind(mapboxService),
        batchGeocode: mapboxService.batchGeocode.bind(mapboxService),
        getNearbyPOIs: mapboxService.getNearbyPOIs.bind(mapboxService),
        validateToken: mapboxService.validateToken.bind(mapboxService),
    };
};

export default mapboxService;
