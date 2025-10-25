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
    Share2,
    ChevronLeft,
    ChevronRight,
    Expand,
    Calendar,
    MessageCircle,
    Shield,
    Clock,
    Ban,
    PawPrint,
    PartyPopper,
    CalendarClock,
    Thermometer,
    ShieldCheck,
    Network,
    WashingMachine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PropertyDetailsProps {
    property: {
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
    };
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [selectedGuests, setSelectedGuests] = useState(1);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) =>
                (prev - 1 + property.images.length) % property.images.length
        );
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < rating
                        ? "fill-yellow-200 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    const allAmenities = [
        { icon: Tv, name: "Cable TV" },
        { icon: Network, name: "Internet" },
        { icon: Wifi, name: "Wireless" },
        { icon: Utensils, name: "Kitchen" },
        { icon: WashingMachine, name: "Washing Machine" },
        { icon: Wind, name: "Hair Dryer" },
        { icon: Thermometer, name: "Heating" },
        { icon: ShieldCheck, name: "Smoke detector" },
        { icon: ShieldCheck, name: "Carbon Monoxide Detector" },
        ...property.amenities,
    ];

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: "#FFFDF6" }}
        >
            {/* Header spacing */}
            <div style={{ paddingTop: "88px" }} />

            <main className="flex-grow">
                <div
                    className="container mx-auto max-w-7xl px-3 md:px-4"
                    style={{ backgroundColor: "#FFFDF6" }}
                >
                    {/* Back button for mobile */}
                    <div className="py-2 md:py-4">
                        <div className="flex items-center text-sm text-[#5C5C5A] mb-4 md:hidden">
                            <button className="inline-flex items-center justify-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-md text-xs p-0 h-auto text-[#5C5C5A] hover:text-[#333333]">
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Back
                            </button>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="relative mb-8 md:mb-12">
                        {/* Mobile carousel */}
                        <div className="md:hidden">
                            <div className="relative">
                                <div className="relative w-full">
                                    <div className="overflow-hidden">
                                        <div
                                            className="flex -ml-4"
                                            style={{
                                                transform: `translate3d(-${
                                                    currentImageIndex * 100
                                                }%, 0px, 0px)`,
                                            }}
                                        >
                                            {property.images.map(
                                                (image, index) => (
                                                    <div
                                                        key={index}
                                                        className="min-w-0 shrink-0 grow-0 basis-full pl-4"
                                                    >
                                                        <div
                                                            className="relative w-full"
                                                            style={{
                                                                paddingBottom:
                                                                    "75%",
                                                            }}
                                                        >
                                                            <div className="rounded-2xl overflow-hidden absolute inset-0">
                                                                <Image
                                                                    src={image}
                                                                    alt={`${
                                                                        property.name
                                                                    } - Image ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Navigation arrows */}
                                    <button
                                        onClick={prevImage}
                                        className="absolute h-8 w-8 rounded-full p-0 top-1/2 -translate-y-1/2 left-4 bg-white/90 hover:bg-white border-0 shadow-lg"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute h-8 w-8 rounded-full p-0 top-1/2 -translate-y-1/2 right-4 bg-white/90 hover:bg-white border-0 shadow-lg"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* View all button */}
                                <button className="absolute bottom-4 left-4 bg-white/90 hover:bg-white border-0 shadow-lg backdrop-blur-sm h-8 rounded-md px-3 text-xs">
                                    <Expand className="h-4 w-4 mr-2" />
                                    View all
                                </button>

                                {/* Image counter */}
                                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                                    {currentImageIndex + 1} /{" "}
                                    {property.images.length}
                                </div>
                            </div>
                        </div>

                        {/* Desktop grid */}
                        <div className="hidden md:block">
                            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                                <div className="col-span-2 row-span-2 relative cursor-pointer group">
                                    <Image
                                        src={property.images[0]}
                                        alt={`${property.name} - Main`}
                                        fill
                                        className="object-cover rounded-l-xl"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-200 rounded-l-xl" />
                                </div>
                                {property.images
                                    .slice(1, 5)
                                    .map((image, index) => (
                                        <div
                                            key={index}
                                            className={`relative cursor-pointer group ${
                                                index === 1
                                                    ? "rounded-tr-xl"
                                                    : index === 3
                                                    ? "rounded-br-xl"
                                                    : ""
                                            }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${
                                                    property.name
                                                } - Image ${index + 2}`}
                                                fill
                                                className={`object-cover ${
                                                    index === 1
                                                        ? "rounded-tr-xl"
                                                        : index === 3
                                                        ? "rounded-br-xl"
                                                        : ""
                                                }`}
                                            />
                                            <div
                                                className={`absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-200 ${
                                                    index === 1
                                                        ? "rounded-tr-xl"
                                                        : index === 3
                                                        ? "rounded-br-xl"
                                                        : ""
                                                }`}
                                            />
                                        </div>
                                    ))}
                                <button className="absolute bottom-6 right-6 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 text-sm font-medium">
                                    <Expand className="h-4 w-4" />
                                    View all photos
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Property Info */}
                    <div className="mb-8 md:mb-12">
                        {/* Mobile layout */}
                        <div className="md:hidden space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl font-bold text-[#333333] leading-tight mb-2">
                                        {property.name}
                                    </h1>
                                </div>
                            </div>

                            {/* Property details grid */}
                            <div
                                className="grid grid-cols-2 gap-4 rounded-2xl p-4"
                                style={{ backgroundColor: "#FFFDF6" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl shadow-sm">
                                        <Users className="h-5 w-5 text-[#284E4C]" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-[#333333] block">
                                            {property.maxGuests}
                                        </span>
                                        <span className="text-sm text-[#5C5C5A]">
                                            Guests
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl shadow-sm">
                                        <Bed className="h-5 w-5 text-[#284E4C]" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-[#333333] block">
                                            {property.bedrooms}
                                        </span>
                                        <span className="text-sm text-[#5C5C5A]">
                                            Bedrooms
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl shadow-sm">
                                        <Bath className="h-5 w-5 text-[#284E4C]" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-[#333333] block">
                                            {property.bathrooms}
                                        </span>
                                        <span className="text-sm text-[#5C5C5A]">
                                            Bathrooms
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl shadow-sm">
                                        <Bed className="h-5 w-5 text-[#284E4C]" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-[#333333] block">
                                            {property.bedrooms + 1}
                                        </span>
                                        <span className="text-sm text-[#5C5C5A]">
                                            beds
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop layout */}
                        <div className="hidden md:block">
                            <h1 className="text-3xl font-bold mb-6 text-[#333333]">
                                {property.name}
                            </h1>
                            <div className="flex items-center gap-8 border-b border-gray-200 pb-8">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-full">
                                        <Users className="h-5 w-5 text-[#5C5C5A]" />
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium text-[#333333]">
                                            {property.maxGuests}
                                        </span>
                                        <span className="text-[#5C5C5A] block">
                                            Guests
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-full">
                                        <Bed className="h-5 w-5 text-[#5C5C5A]" />
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium text-[#333333]">
                                            {property.bedrooms}
                                        </span>
                                        <span className="text-[#5C5C5A] block">
                                            Bedrooms
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-full">
                                        <Bath className="h-5 w-5 text-[#5C5C5A]" />
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium text-[#333333]">
                                            {property.bathrooms}
                                        </span>
                                        <span className="text-[#5C5C5A] block">
                                            Bathrooms
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-full">
                                        <Bed className="h-5 w-5 text-[#5C5C5A]" />
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium text-[#333333]">
                                            {property.bedrooms + 1}
                                        </span>
                                        <span className="text-[#5C5C5A] block">
                                            beds
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 mb-20 md:mb-8">
                        <div className="lg:col-span-2">
                            {/* About Section */}
                            <Card className="mb-8 p-6 bg-white border-0 shadow-lg">
                                <h2 className="text-2xl font-semibold mb-4 text-[#333333]">
                                    About this property
                                </h2>
                                <div className="space-y-4">
                                    <p className="text-[#5C5C5A] whitespace-pre-line leading-relaxed">
                                        {showFullDescription
                                            ? property.description
                                            : `${property.description.substring(
                                                  0,
                                                  200
                                              )}...`}
                                        <button
                                            onClick={() =>
                                                setShowFullDescription(
                                                    !showFullDescription
                                                )
                                            }
                                            className="text-[#284E4C] hover:text-[#284E4C]/90 p-0 h-auto inline ml-2"
                                        >
                                            {showFullDescription
                                                ? "Show less"
                                                : "Read more"}
                                        </button>
                                    </p>
                                </div>
                            </Card>

                            {/* Amenities Section */}
                            <Card className="p-6 mb-12 bg-white border-0 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-semibold text-[#333333]">
                                        Amenities
                                    </h2>
                                    <button
                                        onClick={() =>
                                            setShowAllAmenities(
                                                !showAllAmenities
                                            )
                                        }
                                        className="flex items-center gap-2 border bg-background shadow-sm h-9 px-4 py-2 border-[#284E4C]/20 text-[#284E4C] hover:bg-[#284E4C]/5"
                                    >
                                        {showAllAmenities
                                            ? "Show less"
                                            : "View all amenities"}
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {(showAllAmenities
                                        ? allAmenities
                                        : allAmenities.slice(0, 9)
                                    ).map((amenity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 text-[#5C5C5A]"
                                        >
                                            <div className="p-2 rounded-full">
                                                <amenity.icon className="h-4 w-4" />
                                            </div>
                                            <span className="capitalize">
                                                {amenity.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Stay Policies */}
                            <Card className="p-6 mb-8 bg-white border-0 shadow-lg">
                                <h2 className="text-2xl font-semibold mb-6 text-[#333333]">
                                    Stay Policies
                                </h2>
                                <div className="space-y-8">
                                    {/* Check-in & Check-out */}
                                    <div className="bg-[#F1F3EE] rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-full">
                                                <Clock className="h-5 w-5 text-[#284E4C]" />
                                            </div>
                                            <h3 className="font-semibold text-lg text-[#333333]">
                                                Check-in & Check-out
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white rounded-lg p-4">
                                                <p className="text-sm text-[#5C5C5A]">
                                                    Check-in Time
                                                </p>
                                                <p className="font-semibold text-lg text-[#333333]">
                                                    3:00 PM
                                                </p>
                                            </div>
                                            <div className="bg-white rounded-lg p-4">
                                                <p className="text-sm text-[#5C5C5A]">
                                                    Check-out Time
                                                </p>
                                                <p className="font-semibold text-lg text-[#333333]">
                                                    10:00 AM
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* House Rules */}
                                    <div className="bg-[#F1F3EE] rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-full">
                                                <Shield className="h-5 w-5 text-[#284E4C]" />
                                            </div>
                                            <h3 className="font-semibold text-lg text-[#333333]">
                                                House Rules
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                                                <Ban className="h-5 w-5 text-[#5C5C5A]" />
                                                <p className="font-medium text-[#333333]">
                                                    No smoking
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                                                <PawPrint className="h-5 w-5 text-[#5C5C5A]" />
                                                <p className="font-medium text-[#333333]">
                                                    No pets
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                                                <PartyPopper className="h-5 w-5 text-[#5C5C5A]" />
                                                <p className="font-medium text-[#333333]">
                                                    No parties or events
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                                                <Shield className="h-5 w-5 text-[#5C5C5A]" />
                                                <p className="font-medium text-[#333333]">
                                                    Security deposit required
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cancellation Policy */}
                                    <div className="bg-[#F1F3EE] rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-full">
                                                <CalendarClock className="h-5 w-5 text-[#284E4C]" />
                                            </div>
                                            <h3 className="font-semibold text-lg text-[#333333]">
                                                Cancellation Policy
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-white rounded-lg p-4">
                                                <h4 className="font-medium mb-2 text-[#333333]">
                                                    For stays less than 28 days
                                                </h4>
                                                <div className="flex items-start gap-2 text-sm text-[#5C5C5A]">
                                                    <div className="w-2 h-2 bg-[#284E4C] rounded-full mt-1.5 flex-shrink-0" />
                                                    <p>
                                                        Full refund up to 14
                                                        days before check-in
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-2 text-sm text-[#5C5C5A] mt-1">
                                                    <div className="w-2 h-2 bg-[#284E4C] rounded-full mt-1.5 flex-shrink-0" />
                                                    <p>
                                                        No refund for bookings
                                                        less than 14 days before
                                                        check-in
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Location */}
                            <Card className="p-6 mb-8 bg-white border-0 shadow-lg">
                                <h2 className="text-2xl font-semibold mb-6 text-[#333333]">
                                    Location
                                </h2>
                                <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="h-12 w-12 text-[#284E4C] mx-auto mb-2" />
                                        <p className="text-[#5C5C5A]">
                                            Interactive map would be displayed
                                            here
                                        </p>
                                        <p className="text-sm text-[#5C5C5A] mt-1">
                                            {property.location}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Booking Widget */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24 overflow-hidden bg-white border-0 shadow-lg rounded-2xl">
                                <div className="relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[#284E4C]" />
                                    <div className="relative p-6">
                                        <h3 className="text-lg font-semibold text-white mb-1">
                                            Book Your Stay
                                        </h3>
                                        <p className="text-sm text-[#D2DADA]">
                                            Select dates to see prices
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 pt-4">
                                    <div className="space-y-1">
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <button className="w-full h-[42px] justify-start text-left bg-[#F1F3EE] border-0 shadow-sm hover:bg-[#FFFDF6] rounded-l-md rounded-r-none px-4 py-2 flex items-center">
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    <span>Select dates</span>
                                                </button>
                                            </div>
                                            <div className="w-[120px]">
                                                <Select
                                                    value={selectedGuests.toString()}
                                                    onValueChange={(value) =>
                                                        setSelectedGuests(
                                                            parseInt(value)
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-[42px] bg-[#F1F3EE] border-0 shadow-sm hover:bg-[#FFFDF6] text-[#333333] rounded-l-none rounded-r-md">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-muted-foreground" />
                                                            <span>
                                                                {selectedGuests}
                                                            </span>
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from(
                                                            {
                                                                length: property.maxGuests,
                                                            },
                                                            (_, i) => (
                                                                <SelectItem
                                                                    key={i + 1}
                                                                    value={(
                                                                        i + 1
                                                                    ).toString()}
                                                                >
                                                                    {i + 1}{" "}
                                                                    Guest
                                                                    {i > 0
                                                                        ? "s"
                                                                        : ""}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 pt-6">
                                        <Button
                                            disabled
                                            className="w-full bg-[#284E4C] hover:bg-[#284E4C]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Check availability
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full border-[#284E4C]/20 text-[#284E4C] hover:bg-[#284E4C]/5 hover:border-[#284E4C]/30 h-12"
                                        >
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            Send Inquiry
                                        </Button>
                                    </div>
                                    <p className="text-sm text-[#5C5C5A] text-center mt-4">
                                        <span className="inline-flex items-center gap-1">
                                            <Shield className="h-3 w-3" />
                                            Instant booking confirmation
                                        </span>
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
