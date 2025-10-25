"use client";

import { useState, useEffect } from "react";
import { PropertyCardMobile } from "./property-card-mobile";
import { PropertiesOverview } from "./properties-overview";

interface Property {
    id: number;
    name: string;
    slug: string;
    location: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    price: string;
    rating: number;
    reviewCount: number;
    images: string[];
    amenities: Array<{
        icon: any;
        name: string;
    }>;
    highlights: string[];
    status: "Active" | "Maintenance" | "Inactive";
    featured?: boolean;
}

interface ResponsivePropertiesGridProps {
    properties: Property[];
    showAll?: boolean;
    maxItems?: number;
    title?: string;
    subtitle?: string;
}

export function ResponsivePropertiesGrid({
    properties,
    showAll = false,
    maxItems = 6,
    title = "Our Properties",
    subtitle = "Discover our collection of premium apartments and townhouses across London's most desirable neighborhoods.",
}: ResponsivePropertiesGridProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [likedProperties, setLikedProperties] = useState<Set<number>>(
        new Set()
    );

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkDevice();
        window.addEventListener("resize", checkDevice);

        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    const toggleLike = (propertyId: number) => {
        const newLiked = new Set(likedProperties);
        if (newLiked.has(propertyId)) {
            newLiked.delete(propertyId);
        } else {
            newLiked.add(propertyId);
        }
        setLikedProperties(newLiked);
    };

    const displayProperties = showAll
        ? properties
        : properties.slice(0, maxItems);

    if (isMobile) {
        return (
            <div className="w-full">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#333333] mb-2">
                        {title}
                    </h2>
                    <p className="text-sm text-[#5C5C5A]">{subtitle}</p>
                </div>

                {/* Mobile Property Cards */}
                <div className="space-y-4">
                    {displayProperties.map((property) => (
                        <PropertyCardMobile
                            key={property.id}
                            property={property}
                            onLike={toggleLike}
                            isLiked={likedProperties.has(property.id)}
                        />
                    ))}
                </div>

                {/* Load More Button for Mobile */}
                {!showAll && properties.length > maxItems && (
                    <div className="text-center mt-6">
                        <button className="bg-[#284E4C] hover:bg-[#284E4C]/90 text-white px-6 py-3 rounded-lg font-medium">
                            View All Properties
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Desktop version uses the full PropertiesOverview component
    return (
        <PropertiesOverview
            showAll={showAll}
            maxItems={maxItems}
            title={title}
            subtitle={subtitle}
        />
    );
}
