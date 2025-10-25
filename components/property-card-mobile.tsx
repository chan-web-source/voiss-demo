"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Star,
    MapPin,
    Users,
    Bed,
    Bath,
    Heart,
    Calendar,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
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

interface PropertyCardMobileProps {
    property: Property;
    onLike?: (propertyId: number) => void;
    isLiked?: boolean;
}

export function PropertyCardMobile({
    property,
    onLike,
    isLiked = false,
}: PropertyCardMobileProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex(
            (prev) =>
                (prev - 1 + property.images.length) % property.images.length
        );
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onLike?.(property.id);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 ${
                    i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < rating
                        ? "fill-yellow-200 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    return (
        <Card className="overflow-hidden bg-white shadow-lg border-0 mb-4">
            <Link href={`/property/${property.slug}`} className="block">
                <div className="relative">
                    {/* Image Carousel */}
                    <div className="relative h-48 overflow-hidden">
                        <Image
                            src={property.images[currentImageIndex]}
                            alt={property.name}
                            fill
                            className="object-cover"
                        />

                        {/* Featured badge */}
                        {property.featured && (
                            <div className="absolute top-3 left-3 z-10">
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold text-xs">
                                    Featured
                                </Badge>
                            </div>
                        )}

                        {/* Heart icon */}
                        <button
                            onClick={handleLike}
                            className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors z-10"
                        >
                            <Heart
                                className={`h-3.5 w-3.5 ${
                                    isLiked
                                        ? "fill-red-500 text-red-500"
                                        : "text-gray-600"
                                }`}
                            />
                        </button>

                        {/* Navigation arrows */}
                        {property.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors z-10"
                                >
                                    <ChevronLeft className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors z-10"
                                >
                                    <ChevronRight className="h-3 w-3" />
                                </button>
                            </>
                        )}

                        {/* Image indicators */}
                        {property.images.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                                {property.images.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-1.5 h-1.5 rounded-full ${
                                            index === currentImageIndex
                                                ? "bg-white"
                                                : "bg-white/50"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Status badge */}
                        <div className="absolute bottom-3 right-3">
                            <Badge
                                variant="secondary"
                                className="bg-[#284E4C] text-white text-xs"
                            >
                                Available
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4">
                        {/* Location and Price Row */}
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                                <MapPin className="h-3.5 w-3.5 text-[#5C5C5A] flex-shrink-0" />
                                <span className="text-xs text-[#5C5C5A] truncate">
                                    {property.location}
                                </span>
                            </div>
                            <div className="ml-2">
                                <span className="text-lg font-bold text-[#284E4C]">
                                    {property.price}
                                </span>
                                <span className="text-xs text-[#5C5C5A]">
                                    /night
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-[#333333] mb-2 line-clamp-2 leading-tight">
                            {property.name}
                        </h3>

                        {/* Property details */}
                        <div className="flex items-center gap-4 mb-3 text-xs text-[#5C5C5A]">
                            <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>{property.maxGuests}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Bed className="h-3.5 w-3.5" />
                                <span>
                                    {property.bedrooms === 0
                                        ? "Studio"
                                        : property.bedrooms}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Bath className="h-3.5 w-3.5" />
                                <span>{property.bathrooms}</span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                            <div className="flex items-center gap-0.5">
                                {renderStars(property.rating)}
                            </div>
                            <span className="text-xs font-medium text-[#333333] ml-1">
                                {property.rating}
                            </span>
                            <span className="text-xs text-[#5C5C5A]">
                                ({property.reviewCount})
                            </span>
                        </div>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-1 mb-3">
                            {property.highlights
                                .slice(0, 2)
                                .map((highlight, index) => (
                                    <div
                                        key={index}
                                        className="text-xs text-[#5C5C5A] bg-[#F1F3EE] px-2 py-1 rounded-full"
                                    >
                                        {highlight}
                                    </div>
                                ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <Button
                                size="sm"
                                className="flex-1 bg-[#284E4C] hover:bg-[#284E4C]/90 text-white text-xs h-8"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Handle booking
                                }}
                            >
                                <Calendar className="h-3 w-3 mr-1" />
                                Book Now
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-[#284E4C]/20 text-[#284E4C] hover:bg-[#284E4C]/5 text-xs h-8"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Handle inquiry
                                }}
                            >
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Inquire
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Link>
        </Card>
    );
}
