"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface Property {
    id: number;
    name: string;
    slug: string;
    location: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    pricePerNight: number;
    bedrooms: number;
    bathrooms: number;
    images: string[];
}

export interface PropertiesMapProps {
    properties: Property[];
    className?: string;
    height?: string;
    showControls?: boolean;
    zoom?: number;
    onPropertySelect?: (property: Property) => void;
    selectedPropertyId?: number;
}

export function PropertiesMap({
    properties,
    className = "",
    height = "500px",
    showControls = true,
    zoom = 12,
    onPropertySelect,
    selectedPropertyId,
}: PropertiesMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Set Mapbox access token
        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!accessToken) {
            setError("Mapbox access token not configured");
            setIsLoading(false);
            return;
        }

        mapboxgl.accessToken = accessToken;

        if (!mapContainer.current) return;

        // Calculate center point from properties with coordinates
        const propertiesWithCoords = properties.filter(
            (p) => p.latitude && p.longitude
        );

        let centerLat = 51.5074; // Default to London
        let centerLng = -0.1278;

        if (propertiesWithCoords.length > 0) {
            centerLat =
                propertiesWithCoords.reduce(
                    (sum, p) => sum + (p.latitude || 0),
                    0
                ) / propertiesWithCoords.length;
            centerLng =
                propertiesWithCoords.reduce(
                    (sum, p) => sum + (p.longitude || 0),
                    0
                ) / propertiesWithCoords.length;
        }

        try {
            // Initialize map
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/streets-v12",
                center: [centerLng, centerLat],
                zoom: zoom,
            });

            map.current.on("load", () => {
                setIsLoading(false);

                // Clear existing markers
                markers.current.forEach((marker) => marker.remove());
                markers.current = [];

                // Add markers for each property
                propertiesWithCoords.forEach((property) => {
                    if (!property.latitude || !property.longitude) return;

                    // Create custom marker element
                    const markerElement = document.createElement("div");
                    markerElement.className = "property-marker";
                    markerElement.style.cssText = `
            width: 40px;
            height: 40px;
            background-color: ${
                selectedPropertyId === property.id ? "#FF6B6B" : "#284E4C"
            };
            border: 3px solid white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
          `;
                    markerElement.textContent = `£${Math.round(
                        property.pricePerNight
                    )}`;

                    // Add hover effects
                    markerElement.addEventListener("mouseenter", () => {
                        markerElement.style.transform = "scale(1.1)";
                        markerElement.style.zIndex = "1000";
                    });

                    markerElement.addEventListener("mouseleave", () => {
                        markerElement.style.transform = "scale(1)";
                        markerElement.style.zIndex = "1";
                    });

                    // Create marker
                    const marker = new mapboxgl.Marker(markerElement)
                        .setLngLat([property.longitude, property.latitude])
                        .addTo(map.current!);

                    // Create popup content
                    const popupContent = `
            <div class="property-popup" style="max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="margin-bottom: 8px;">
                ${
                    property.images[0]
                        ? `<img src="${property.images[0]}" alt="${property.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px;">`
                        : ""
                }
              </div>
              <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 600; color: #284E4C; line-height: 1.3;">${
                  property.name
              }</h3>
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #666; line-height: 1.3;">${
                  property.location
              }</p>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; color: #888;">${
                    property.bedrooms
                } bed • ${property.bathrooms} bath</span>
                <span style="font-size: 16px; font-weight: 600; color: #284E4C;">£${
                    property.pricePerNight
                }/night</span>
              </div>
              <button onclick="window.viewProperty?.('${
                  property.slug
              }')" style="
                width: 100%;
                padding: 8px 12px;
                background-color: #284E4C;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
              " onmouseover="this.style.backgroundColor='#1a332f'" onmouseout="this.style.backgroundColor='#284E4C'">
                View Details
              </button>
            </div>
          `;

                    const popup = new mapboxgl.Popup({
                        offset: 25,
                        closeButton: true,
                        closeOnClick: false,
                        maxWidth: "300px",
                    }).setHTML(popupContent);

                    marker.setPopup(popup);

                    // Handle marker click
                    markerElement.addEventListener("click", () => {
                        if (onPropertySelect) {
                            onPropertySelect(property);
                        }
                    });

                    markers.current.push(marker);
                });

                // Add navigation controls if enabled
                if (showControls) {
                    map.current!.addControl(
                        new mapboxgl.NavigationControl(),
                        "top-right"
                    );
                }

                // Add fullscreen control
                map.current!.addControl(
                    new mapboxgl.FullscreenControl(),
                    "top-right"
                );

                // Fit map to show all markers if there are any
                if (propertiesWithCoords.length > 1) {
                    const coordinates = propertiesWithCoords.map(
                        (p) => [p.longitude!, p.latitude!] as [number, number]
                    );
                    const bounds = coordinates.reduce(
                        (bounds, coord) => bounds.extend(coord),
                        new mapboxgl.LngLatBounds(
                            coordinates[0],
                            coordinates[0]
                        )
                    );

                    map.current!.fitBounds(bounds, {
                        padding: { top: 50, bottom: 50, left: 50, right: 50 },
                        maxZoom: 15,
                    });
                }
            });

            map.current.on("error", (e: any) => {
                console.error("Mapbox error:", e);
                setError("Failed to load map");
                setIsLoading(false);
            });
        } catch (err) {
            console.error("Map initialization error:", err);
            setError("Failed to initialize map");
            setIsLoading(false);
        }

        // Cleanup function
        return () => {
            markers.current.forEach((marker) => marker.remove());
            markers.current = [];
            if (map.current) {
                map.current.remove();
            }
        };
    }, [properties, zoom, showControls, onPropertySelect, selectedPropertyId]);

    // Global function for popup button clicks
    useEffect(() => {
        (window as any).viewProperty = (slug: string) => {
            window.open(`/property/${slug}`, "_blank");
        };

        return () => {
            delete (window as any).viewProperty;
        };
    }, []);

    // Handle resize
    useEffect(() => {
        if (map.current) {
            const resizeMap = () => {
                map.current?.resize();
            };

            window.addEventListener("resize", resizeMap);
            return () => window.removeEventListener("resize", resizeMap);
        }
    }, []);

    if (error) {
        return (
            <div
                className={`flex items-center justify-center bg-gray-100 border rounded-lg ${className}`}
                style={{ height }}
            >
                <div className="text-center p-4">
                    <div className="text-gray-500 mb-2">
                        <svg
                            className="w-12 h-12 mx-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const propertiesWithCoords = properties.filter(
        (p) => p.latitude && p.longitude
    );

    if (propertiesWithCoords.length === 0) {
        return (
            <div
                className={`flex items-center justify-center bg-gray-50 border rounded-lg ${className}`}
                style={{ height }}
            >
                <div className="text-center p-4">
                    <div className="text-gray-400 mb-2">
                        <svg
                            className="w-12 h-12 mx-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-500">
                        No properties with location data available
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative rounded-lg overflow-hidden ${className}`}
            style={{ height }}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#284E4C] mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Loading map...</p>
                    </div>
                </div>
            )}
            <div ref={mapContainer} className="w-full h-full" />

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
                <div className="text-xs font-semibold text-gray-700 mb-2">
                    Properties Map
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <div className="w-3 h-3 bg-[#284E4C] rounded-full"></div>
                    <span>Available Properties</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {propertiesWithCoords.length} of {properties.length} shown
                </div>
            </div>
        </div>
    );
}

export default PropertiesMap;
