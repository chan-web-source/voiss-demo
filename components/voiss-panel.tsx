"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, MessageSquare, MessageCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface VoissPanelProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function VoissPanel({ isOpen, onToggle }: VoissPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // On mobile, always show expanded when open
    const shouldShowExpanded = isOpen ? isExpanded : false;

    const navigationItems = [
        {
            name: "Voice",
            href: "/voice",
            icon: MessageSquare,
        },
        {
            name: "Chat",
            href: "/chat",
            icon: MessageCircle,
        },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-20 left-4 h-[calc(100vh-8rem)] bg-gradient-to-r from-[#374151] to-[#1f2937] z-50 transition-all duration-300 ease-in-out overflow-y-auto rounded-lg shadow-lg
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:${isOpen ? 'translate-x-0' : '-translate-x-full'} md:fixed md:z-40 md:block md:h-[calc(100vh-8rem)] md:top-20
                lg:${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:fixed lg:z-40 lg:block lg:h-[calc(100vh-8rem)] lg:top-20
                ${shouldShowExpanded ? 'w-64' : 'w-16'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/20">
                        {shouldShowExpanded && (
                            <span className="text-white font-semibold text-lg">User panel</span>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-white hover:text-gray-200 hover:bg-white/10"
                        >
                            {isExpanded ? (
                                <ChevronLeft className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </Button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-3 px-3 py-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-colors group"
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {shouldShowExpanded && (
                                        <span className="text-sm font-medium">{item.name}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                </div>
            </div>
        </>
    );
}

