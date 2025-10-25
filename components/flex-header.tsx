"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HEADER_MOCK_DATA } from "@/lib/mock/header-mock-data";

interface FlexHeaderProps {
    onMenuToggle: () => void;
}

export function FlexHeader({ onMenuToggle }: FlexHeaderProps) {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    return (
        <header className="bg-[#1A4D4D] sticky top-0 z-50">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Menu Button and Logo */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onMenuToggle}
                            className="text-white hover:text-gray-200 hover:bg-[#1e3a38] lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src={HEADER_MOCK_DATA.logo.src}
                                alt={HEADER_MOCK_DATA.logo.alt}
                                width={HEADER_MOCK_DATA.logo.width}
                                height={HEADER_MOCK_DATA.logo.height}
                                className={HEADER_MOCK_DATA.logo.className}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right side - User Profile and Language */}
                    <div className="flex items-center space-x-4">
                        {/* Language Selection */}
                        <div className="flex items-center space-x-4 text-white">
                            <span className="text-sm flex items-center space-x-1">
                                <span className="font-semibold">{HEADER_MOCK_DATA.language.country}</span>
                                <span>{HEADER_MOCK_DATA.language.language}</span>
                            </span>
                            <span className="text-sm flex items-center space-x-1">
                                <span>{HEADER_MOCK_DATA.currency.symbol}</span>
                                <span>{HEADER_MOCK_DATA.currency.code}</span>
                            </span>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className="text-white hover:text-gray-200 hover:bg-[#1e3a38] flex items-center space-x-2"
                            >
                                <div className={HEADER_MOCK_DATA.user.avatar.className}>
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="hidden sm:block">{HEADER_MOCK_DATA.user.name}</span>
                                <ChevronDown className="w-4 h-4" />
                            </Button>

                            {/* Dropdown Menu */}
                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900">{HEADER_MOCK_DATA.user.name}</p>
                                        <p className="text-sm text-gray-500">{HEADER_MOCK_DATA.user.email}</p>
                                    </div>
                                    <Link
                                        href={HEADER_MOCK_DATA.dropdown.profileSettings.href}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {HEADER_MOCK_DATA.dropdown.profileSettings.text}
                                    </Link>
                                    <Link
                                        href={HEADER_MOCK_DATA.dropdown.accountSettings.href}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {HEADER_MOCK_DATA.dropdown.accountSettings.text}
                                    </Link>
                                    <div className="border-t border-gray-200">
                                        <Link
                                            href={HEADER_MOCK_DATA.dropdown.signOut.href}
                                            className={HEADER_MOCK_DATA.dropdown.signOut.className}
                                        >
                                            {HEADER_MOCK_DATA.dropdown.signOut.text}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
