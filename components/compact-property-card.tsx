"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Users, Bed, Bath, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface CompactPropertyCardProps {
    property: Property;
    isLiked: boolean;
    onToggleLike: (propertyId: number) => void;
}

export function CompactPropertyCard({
    property,
    isLiked,
    onToggleLike,
}: CompactPropertyCardProps) {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < rating
                            ? "fill-yellow-200 text-yellow-400"
                            : "text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex">
                {/* Image Section */}
                <div className="relative w-24 h-20 sm:w-32 sm:h-24 flex-shrink-0">
                    <Image
                        src={property.images[0]}
                        alt={property.name}
                        fill
                        className="object-cover rounded-l-lg"
                    />

                    {/* Featured badge */}
                    {property.featured && (
                        <div className="absolute top-1 left-1">
                            <Badge className="bg-yellow-500 text-white text-xs px-1 py-0.5">
                                Featured
                            </Badge>
                        </div>
                    )}

                    {/* Heart icon */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onToggleLike(property.id);
                        }}
                        className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                    >
                        <Heart
                            className={`h-3 w-3 ${isLiked
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-600"
                                }`}
                        />
                    </button>
                </div>

                {/* Content Section */}
                <CardContent className="flex-1 p-2 sm:p-3">
                    <div className="flex justify-between items-start mb-1">
                        {/* Title and Location */}
                        <div className="flex-1 min-w-0 pr-2">
                            <h3 className="text-xs sm:text-sm font-semibold text-[#333333] line-clamp-1 group-hover:text-[#284E4C] transition-colors">
                                {property.name}
                            </h3>
                            <div className="flex items-center gap-1 mb-1">
                                <MapPin className="h-3 w-3 text-[#5C5C5A] flex-shrink-0" />
                                <span className="text-xs text-[#5C5C5A] line-clamp-1">
                                    {property.location}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                            <div className="text-xs sm:text-sm font-bold text-[#284E4C]">
                                {property.price}
                            </div>
                            <div className="text-xs text-[#5C5C5A]">
                                / night
                            </div>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 text-xs text-[#5C5C5A]">
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{property.maxGuests}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            <span>
                                {property.bedrooms === 0
                                    ? "Studio"
                                    : property.bedrooms}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            <span>{property.bathrooms}</span>
                        </div>
                    </div>

                    {/* Rating and Action */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                {renderStars(property.rating)}
                            </div>
                            <span className="text-xs font-medium text-[#333333]">
                                {property.rating}
                            </span>
                            <span className="text-xs text-[#5C5C5A] hidden sm:inline">
                                ({property.reviewCount})
                            </span>
                        </div>

                        <Link href={`/property/${property.slug}`}>
                            <Button
                                size="sm"
                                className="bg-[#284E4C] hover:bg-[#284E4C]/90 text-white text-xs px-2 sm:px-3 py-1 h-6"
                            >
                                View
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}
