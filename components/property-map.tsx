"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface PropertyMapProps {
    latitude?: number;
    longitude?: number;
    address?: string;
    propertyName?: string;
    className?: string;
    height?: string;
    showControls?: boolean;
    zoom?: number;
    style?: string;
    interactive?: boolean;
}

export function PropertyMap({
    latitude,
    longitude,
    address,
    propertyName,
    className = "",
    height = "400px",
    showControls = true,
    zoom = 15,
    style = "mapbox://styles/mapbox/streets-v12",
    interactive = true,
}: PropertyMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
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

        // Default to London coordinates if not provided
        const defaultLat = 51.5074;
        const defaultLng = -0.1278;

        const mapLat = latitude || defaultLat;
        const mapLng = longitude || defaultLng;

        try {
            // Initialize map
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: style,
                center: [mapLng, mapLat],
                zoom: zoom,
                interactive: interactive,
            });

            map.current.on("load", () => {
                setIsLoading(false);

                // Add marker
                if (marker.current) {
                    marker.current.remove();
                }

                marker.current = new mapboxgl.Marker({
                    color: "#284E4C",
                    scale: 1.2,
                })
                    .setLngLat([mapLng, mapLat])
                    .addTo(map.current!);

                // Add popup if property name is provided
                if (propertyName) {
                    const popup = new mapboxgl.Popup({
                        offset: 25,
                        closeButton: false,
                        closeOnClick: false,
                    })
                        .setLngLat([mapLng, mapLat])
                        .setHTML(
                            `
              <div class="mapbox-popup-content" style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
                <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #284E4C;">${propertyName}</h3>
                ${
                    address
                        ? `<p style="margin: 0; font-size: 12px; color: #666;">${address}</p>`
                        : ""
                }
              </div>
            `
                        )
                        .addTo(map.current!);
                }

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
            if (marker.current) {
                marker.current.remove();
            }
            if (map.current) {
                map.current.remove();
            }
        };
    }, [
        latitude,
        longitude,
        address,
        propertyName,
        height,
        showControls,
        zoom,
        style,
        interactive,
    ]);

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
        </div>
    );
}

export default PropertyMap;
