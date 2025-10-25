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
    Wifi,
    Car,
    Coffee,
    Tv,
    Wind,
    Utensils,
    Heart,
    Filter,
    Search,
    ArrowUpDown,
    Eye,
    Calendar,
    Map,
    Grid3X3,
    List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CompactPropertyCard } from "@/components/compact-property-card";
import { PropertiesMap } from "@/components/properties-map";

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
    latitude?: number;
    longitude?: number;
    address?: string;
    pricePerNight?: number;
    amenities: Array<{
        icon: any;
        name: string;
    }>;
    highlights: string[];
    status: "Active" | "Maintenance" | "Inactive";
    featured?: boolean;
}

const allProperties: Property[] = [
    {
        id: 1,
        name: "Stunning 2 Bed Flat near Chiswick Park",
        slug: "chiswick-park-flat",
        location: "Chiswick, London",
        description:
            "This apartment in Chiswick is the perfect spot for up to 5 guests. I've made sure each of the 2 bedrooms is comfortable, with a double bed in each, ideal for two people.",
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 5,
        price: "£215",
        rating: 4.8,
        reviewCount: 24,
        latitude: 51.4946,
        longitude: -0.2678,
        address: "Chiswick Park, London W4",
        images: [
            "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/23248-239686-vSshtj4kthrc5t5McAEQ8FdVRwBccjlyX8Ld8tGz7zA-65c414b9d2721",
            "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/23248-239686-AuErzjkPylT8SQ4DWlkvwcdaaKR5PtVWuqIBGCMKNiM-65c414b7f41ed",
            "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/23248-239686-nzUQfscC-MK9QUEP8s1tgAIoxU96NNzHSSkLAxzcLys-65c414b7094df",
        ],
        amenities: [
            { icon: Wifi, name: "Free WiFi" },
            { icon: Car, name: "Parking" },
            { icon: Coffee, name: "Coffee Machine" },
            { icon: Tv, name: "Smart TV" },
            { icon: Wind, name: "Air Conditioning" },
            { icon: Utensils, name: "Full Kitchen" },
        ],
        highlights: [
            "Near Chiswick Park Station",
            "Fully Equipped Kitchen",
            "Comfortable Beds",
        ],
        status: "Active",
        featured: true,
    },
    {
        id: 2,
        name: "2B N1 A - 29 Shoreditch Heights",
        slug: "shoreditch-heights",
        location: "Shoreditch, London",
        description:
            "Experience luxury living in the heart of Shoreditch with this beautifully designed 2-bedroom apartment. Featuring modern amenities, stylish furnishings, and floor-to-ceiling windows.",
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        price: "£120",
        rating: 4.7,
        reviewCount: 32,
        latitude: 51.526165,
        longitude: -0.080325,
        address:
            "Shoreditch, Hackney, London, Greater London, England, United Kingdom",
        images: [
            "/modern-apartment-bedroom-with-natural-light.jpg",
            "/stylish-living-room-with-contemporary-furniture.jpg",
            "/modern-kitchen-marble.png",
        ],
        amenities: [
            { icon: Wifi, name: "Free WiFi" },
            { icon: Tv, name: "Smart TV" },
            { icon: Coffee, name: "Coffee Machine" },
            { icon: Wind, name: "Air Conditioning" },
            { icon: Utensils, name: "Full Kitchen" },
        ],
        highlights: [
            "Heart of Shoreditch",
            "Modern Design",
            "Great Transport Links",
        ],
        status: "Active",
    },
    {
        id: 3,
        name: "1B E1 B - 15 Canary Wharf Tower",
        slug: "canary-wharf-tower",
        location: "Canary Wharf, London",
        description:
            "Modern 1-bedroom apartment in the heart of London's financial district. Perfect for business travelers with stunning city views and premium amenities.",
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        price: "£150",
        rating: 4.6,
        reviewCount: 18,
        images: [
            "/luxury-canary-wharf-apartment.jpg",
            "/modern-furnished-apartment-living-room.jpg",
            "/elegant-bathroom-with-rainfall-shower.jpg",
        ],
        amenities: [
            { icon: Wifi, name: "Free WiFi" },
            { icon: Tv, name: "Smart TV" },
            { icon: Coffee, name: "Coffee Machine" },
            { icon: Utensils, name: "Full Kitchen" },
        ],
        highlights: ["Financial District", "City Views", "Business Amenities"],
        status: "Active",
    },
    {
        id: 4,
        name: "Studio W1 C - 42 Fitzrovia Square",
        slug: "fitzrovia-square",
        location: "Fitzrovia, London",
        description:
            "Stylish studio apartment in trendy Fitzrovia. Compact yet comfortable with all modern amenities and excellent transport links.",
        bedrooms: 0,
        bathrooms: 1,
        maxGuests: 2,
        price: "£95",
        rating: 4.3,
        reviewCount: 15,
        images: [
            "/stylish-fitzrovia-studio-apartment.jpg",
            "/modern-kitchen-marble.png",
            "/stylish-bedroom-with-yellow-accents-and-artwork.jpg",
        ],
        amenities: [
            { icon: Wifi, name: "Free WiFi" },
            { icon: Tv, name: "Smart TV" },
            { icon: Coffee, name: "Coffee Machine" },
            { icon: Utensils, name: "Kitchenette" },
        ],
        highlights: ["Trendy Fitzrovia", "Compact Design", "Great Value"],
        status: "Active",
    },
    {
        id: 5,
        name: "3B SW3 A - 12 Chelsea Garden Mews",
        slug: "chelsea-garden-mews",
        location: "Chelsea, London",
        description:
            "Luxurious 3-bedroom townhouse in prestigious Chelsea. Features a private garden, period details, and contemporary furnishings.",
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        price: "£250",
        rating: 4.9,
        reviewCount: 28,
        images: [
            "/modern-london-apartment-exterior.jpg",
            "/stylish-living-room-with-contemporary-furniture.jpg",
            "/modern-furnished-apartment-living-room.jpg",
        ],
        amenities: [
            { icon: Wifi, name: "Free WiFi" },
            { icon: Car, name: "Parking" },
            { icon: Coffee, name: "Coffee Machine" },
            { icon: Tv, name: "Smart TV" },
            { icon: Wind, name: "Air Conditioning" },
            { icon: Utensils, name: "Full Kitchen" },
        ],
        highlights: [
            "Private Garden",
            "Chelsea Location",
            "Luxury Furnishings",
        ],
        status: "Active",
        featured: true,
    },
    {
        id: 6,
        name: "2B W2 D - 8 Paddington Central",
        slug: "paddington-central",
        location: "Paddington, London",
        description:
            "Contemporary 2-bedroom apartment near Paddington Station. Ideal for travelers with easy access to Heathrow and central London.",
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        price: "£180",
        rating: 4.4,
        reviewCount: 21,
        images: [
            "/modern-apartment-bedroom-with-natural-light.jpg",
            "/modern-kitchen-marble.png",
            "/elegant-bathroom-with-rainfall-shower.jpg",
        ],
        amenities: [
            { icon: Wifi, name: "Free WiFi" },
            { icon: Car, name: "Parking" },
            { icon: Coffee, name: "Coffee Machine" },
            { icon: Tv, name: "Smart TV" },
            { icon: Utensils, name: "Full Kitchen" },
        ],
        highlights: [
            "Near Paddington Station",
            "Airport Access",
            "Two Bathrooms",
        ],
        status: "Active",
    },
    {
        id: 7,
        name: "1B EC1 A - 23 Clerkenwell Loft",
        slug: "clerkenwell-loft",
        location: "Clerkenwell, London",
        description:
            "Industrial-style loft apartment in trendy Clerkenwell. High ceilings, exposed brick walls, and modern amenities in a historic setting.",
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        price: "£135",
        rating: 4.5,
        reviewCount: 19,
        images: [
            "/modern-apartment-bedroom-with-natural-light.jpg",
            "/stylish-living-room-with-contemporary-furniture.jpg",
            "/modern-kitchen-marble.png",
        ],
        amenities: [
            { icon: Wifi, name: "Free WiFi" },
            { icon: Tv, name: "Smart TV" },
            { icon: Coffee, name: "Coffee Machine" },
            { icon: Utensils, name: "Full Kitchen" },
        ],
        highlights: ["Industrial Design", "Historic Area", "High Ceilings"],
        status: "Active",
    },
    {
        id: 8,
        name: "2B SE1 B - 45 Borough Market View",
        slug: "borough-market-view",
        location: "Borough, London",
        description:
            "Stylish 2-bedroom apartment overlooking Borough Market. Perfect for food lovers with London's best market right at your doorstep.",
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        price: "£165",
        rating: 4.6,
        reviewCount: 22,
        images: [
            "/stylish-living-room-with-contemporary-furniture.jpg",
            "/modern-kitchen-marble.png",
            "/elegant-bathroom-with-rainfall-shower.jpg",
        ],
        amenities: [
            { icon: Wifi, name: "Free WiFi" },
            { icon: Tv, name: "Smart TV" },
            { icon: Coffee, name: "Coffee Machine" },
            { icon: Utensils, name: "Full Kitchen" },
        ],
        highlights: [
            "Borough Market Views",
            "Food Paradise",
            "River Thames Nearby",
        ],
        status: "Active",
    },
];

interface PropertiesOverviewProps {
    showAll?: boolean;
    maxItems?: number;
    title?: string;
    subtitle?: string;
    compact?: boolean;
}

export function PropertiesOverview({
    showAll = false,
    maxItems = 6,
    title = "Our Properties",
    subtitle = "Discover our collection of premium apartments and townhouses across London's most desirable neighborhoods.",
    compact = false,
}: PropertiesOverviewProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("rating");
    const [filterBy, setFilterBy] = useState("all");
    const [likedProperties, setLikedProperties] = useState<Set<number>>(
        new Set()
    );
    const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");

    const filteredProperties = allProperties
        .filter((property) => {
            // Search filter
            if (searchTerm) {
                return (
                    property.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    property.location
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                );
            }
            return true;
        })
        .filter((property) => {
            // Category filter
            if (filterBy === "all") return true;
            if (filterBy === "studio") return property.bedrooms === 0;
            if (filterBy === "1bed") return property.bedrooms === 1;
            if (filterBy === "2bed") return property.bedrooms === 2;
            if (filterBy === "3bed+") return property.bedrooms >= 3;
            if (filterBy === "featured") return property.featured;
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return (
                        parseInt(a.price.replace("£", "")) -
                        parseInt(b.price.replace("£", ""))
                    );
                case "price-high":
                    return (
                        parseInt(b.price.replace("£", "")) -
                        parseInt(a.price.replace("£", ""))
                    );
                case "rating":
                    return b.rating - a.rating;
                case "reviews":
                    return b.reviewCount - a.reviewCount;
                case "name":
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        })
        .slice(0, showAll ? undefined : maxItems);

    const toggleLike = (propertyId: number) => {
        const newLiked = new Set(likedProperties);
        if (newLiked.has(propertyId)) {
            newLiked.delete(propertyId);
        } else {
            newLiked.add(propertyId);
        }
        setLikedProperties(newLiked);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : i < rating
                        ? "fill-yellow-200 text-yellow-400"
                        : "text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
                    {title}
                </h2>
                <p className="text-lg text-[#5C5C5A] max-w-2xl">{subtitle}</p>
            </div>

            {/* Filters and Search */}
            {showAll && (
                <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5C5C5A]" />
                            <Input
                                placeholder="Search properties or locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white border-[#284E4C]/20 focus:border-[#284E4C]"
                            />
                        </div>

                        {/* Filter by bedrooms */}
                        <Select value={filterBy} onValueChange={setFilterBy}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-white border-[#284E4C]/20">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Properties
                                </SelectItem>
                                <SelectItem value="featured">
                                    Featured
                                </SelectItem>
                                <SelectItem value="studio">Studio</SelectItem>
                                <SelectItem value="1bed">1 Bedroom</SelectItem>
                                <SelectItem value="2bed">2 Bedrooms</SelectItem>
                                <SelectItem value="3bed+">
                                    3+ Bedrooms
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort and View Mode */}
                    <div className="flex items-center gap-2">
                        {/* View Mode Toggle */}
                        <div className="flex bg-white shadow-lg rounded-lg overflow-hidden">
                            <Button
                                variant={
                                    viewMode === "grid" ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className={`rounded-none ${viewMode === "grid"
                                    ? "bg-[#284E4C] text-white hover:bg-[#1a332f]"
                                    : "text-[#284E4C] hover:bg-[#284E4C]/10"
                                    }`}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === "list" ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className={`rounded-none ${viewMode === "list"
                                    ? "bg-[#284E4C] text-white hover:bg-[#1a332f]"
                                    : "text-[#284E4C] hover:bg-[#284E4C]/10"
                                    }`}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === "map" ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => setViewMode("map")}
                                className={`rounded-none ${viewMode === "map"
                                    ? "bg-[#284E4C] text-white hover:bg-[#1a332f]"
                                    : "text-[#284E4C] hover:bg-[#284E4C]/10"
                                    }`}
                            >
                                <Map className="h-4 w-4" />
                            </Button>
                        </div>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-white border-[#284E4C]/20">
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rating">
                                    Highest Rated
                                </SelectItem>
                                <SelectItem value="reviews">
                                    Most Reviews
                                </SelectItem>
                                <SelectItem value="price-low">
                                    Price: Low to High
                                </SelectItem>
                                <SelectItem value="price-high">
                                    Price: High to Low
                                </SelectItem>
                                <SelectItem value="name">Name A-Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Results count */}
            {showAll && (
                <div className="mb-6">
                    <p className="text-[#5C5C5A]">
                        Showing {filteredProperties.length} of{" "}
                        {allProperties.length} properties
                    </p>
                </div>
            )}

            {/* Properties Display */}
            {compact ? (
                <div className="space-y-3 mb-12">
                    {filteredProperties.map((property) => (
                        <CompactPropertyCard
                            key={property.id}
                            property={property}
                            isLiked={likedProperties.has(property.id)}
                            onToggleLike={toggleLike}
                        />
                    ))}
                </div>
            ) : viewMode === "map" ? (
                <div className="mb-12">
                    <PropertiesMap
                        properties={filteredProperties.map((property) => ({
                            ...property,
                            pricePerNight:
                                parseInt(
                                    property.price.replace(/[^\d]/g, "")
                                ) || 0,
                        }))}
                        height="600px"
                        onPropertySelect={(property) => {
                            window.open(`/property/${property.slug}`, "_blank");
                        }}
                    />
                </div>
            ) : (
                <div
                    className={`grid gap-6 mb-12 ${viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                        }`}
                >
                    {filteredProperties.map((property) => (
                        <Card
                            key={property.id}
                            className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 group border-0 relative"
                        >
                            {/* Featured badge */}
                            {property.featured && (
                                <div className="absolute top-4 left-4 z-10">
                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold">
                                        Featured
                                    </Badge>
                                </div>
                            )}

                            <div className="relative">
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={property.images[0]}
                                        alt={property.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Heart icon */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleLike(property.id);
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${likedProperties.has(property.id)
                                                ? "fill-red-500 text-red-500"
                                                : "text-gray-600"
                                                }`}
                                        />
                                    </button>

                                    {/* Status badge */}
                                    <div className="absolute bottom-4 left-4">
                                        <Badge
                                            variant="secondary"
                                            className="bg-[#284E4C] text-white"
                                        >
                                            Available
                                        </Badge>
                                    </div>

                                    {/* Quick view button */}
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            className="bg-white/90 text-[#284E4C] hover:bg-white"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            Quick View
                                        </Button>
                                    </div>
                                </div>

                                {/* Content */}
                                <CardContent className="p-6">
                                    {/* Location */}
                                    <div className="flex items-center gap-1 mb-2">
                                        <MapPin className="h-4 w-4 text-[#5C5C5A]" />
                                        <span className="text-sm text-[#5C5C5A]">
                                            {property.location}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-[#333333] mb-2 line-clamp-2 group-hover:text-[#284E4C] transition-colors">
                                        {property.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-[#5C5C5A] mb-4 line-clamp-2">
                                        {property.description}
                                    </p>

                                    {/* Property details */}
                                    <div className="flex items-center gap-4 mb-4 text-sm text-[#5C5C5A]">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>{property.maxGuests}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Bed className="h-4 w-4" />
                                            <span>
                                                {property.bedrooms === 0
                                                    ? "Studio"
                                                    : property.bedrooms}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Bath className="h-4 w-4" />
                                            <span>{property.bathrooms}</span>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {property.amenities
                                            .slice(0, 3)
                                            .map((amenity, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-1 text-xs text-[#5C5C5A] bg-[#F1F3EE] px-2 py-1 rounded-full"
                                                >
                                                    <amenity.icon className="h-3 w-3" />
                                                    <span>{amenity.name}</span>
                                                </div>
                                            ))}
                                        {property.amenities.length > 3 && (
                                            <div className="text-xs text-[#5C5C5A] bg-[#F1F3EE] px-2 py-1 rounded-full">
                                                +{property.amenities.length - 3}{" "}
                                                more
                                            </div>
                                        )}
                                    </div>

                                    {/* Rating and Reviews */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center gap-1">
                                            {renderStars(property.rating)}
                                        </div>
                                        <span className="text-sm font-medium text-[#333333]">
                                            {property.rating}
                                        </span>
                                        <span className="text-sm text-[#5C5C5A]">
                                            ({property.reviewCount} reviews)
                                        </span>
                                    </div>

                                    {/* Price and CTA */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-[#284E4C]">
                                                {property.price}
                                            </span>
                                            <span className="text-sm text-[#5C5C5A] ml-1">
                                                / night
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/property/${property.slug}`}
                                            >
                                                <Button className="bg-[#284E4C] hover:bg-[#284E4C]/90 text-white">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* No results */}
            {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                    <div className="mb-4">
                        <Search className="h-16 w-16 text-[#5C5C5A] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[#333333] mb-2">
                            No properties found
                        </h3>
                        <p className="text-[#5C5C5A]">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setSearchTerm("");
                            setFilterBy("all");
                        }}
                        variant="outline"
                        className="border-[#284E4C] text-[#284E4C] hover:bg-[#284E4C] hover:text-white"
                    >
                        Clear Filters
                    </Button>
                </div>
            )}

            {/* View All Button */}
            {!showAll && (
                <div className="text-center">
                    <Link href="/">
                        <Button
                            size="lg"
                            className="bg-[#284E4C] hover:bg-[#284E4C]/90 text-white"
                        >
                            View All Properties
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
