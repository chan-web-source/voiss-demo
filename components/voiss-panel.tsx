"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, MessageSquare, MessageCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

interface VoissPanelProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function VoissPanel({ isOpen, onToggle }: VoissPanelProps) {
    const isMobileHook = useIsMobile();
    const [isExpanded, setIsExpanded] = useState(true); // Desktop default to expanded
    const [isMobile, setIsMobile] = useState(isMobileHook);

    // Check if device is mobile
    useEffect(() => {
        const checkIsMobile = () => {
            const mobile = isMobileHook;
            setIsMobile(mobile);
            // On mobile, always expand when open. On desktop, use isExpanded state
            if (mobile) {
                setIsExpanded(true); // Mobile always shows expanded when open
            } else {
                setIsExpanded(true); // Desktop defaults to expanded
            }
        };
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, [isMobileHook]);

    // On mobile, always show expanded when open, on desktop allow collapse
    const shouldShowExpanded = isMobile ? isOpen : (isOpen && isExpanded);

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
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0  bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed top-20 left-4 right-4 h-[calc(100vh-6rem)] bg-gradient-to-r from-[#374151] to-[#1f2937] z-50 transition-all duration-300 ease-in-out overflow-y-auto rounded-lg border border-gray-300/20
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:${isOpen ? 'translate-x-0' : '-translate-x-full'} md:left-4 md:top-20 md:h-[calc(100vh-8rem)] md:rounded-lg md:border md:border-gray-300/20
                    lg:${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:left-4 lg:top-20 lg:h-[calc(100vh-8rem)] lg:rounded-lg lg:border lg:border-gray-300/20
                    ${isMobile ? (shouldShowExpanded ? 'w-64' : 'w-0') : (shouldShowExpanded ? 'w-64' : 'w-16')}
                `}
                style={{
                    '--bg-image': 'url("https://thumbs.dreamstime.com/b/virtual-assistant-voice-recognition-service-technology-ai-artificial-intelligence-robot-support-chatbot-young-girl-face-low-poly-152803699.jpg")'
                } as React.CSSProperties}
            >
                {/* Background Image Layer */}
                <div
                    className="absolute inset-0 opacity-15"
                    style={{
                        backgroundImage: 'var(--bg-image)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>

                <div className="flex flex-col h-full relative z-10">
                    {/* Header */}
                    {!isMobile && <div className="flex items-center justify-between p-4 border-b border-white/20">
                        {shouldShowExpanded && (
                            <span className="text-white font-semibold text-lg">User panel</span>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                if (isMobile) {
                                    // On mobile, clicking collapse button should close the panel
                                    onToggle();
                                } else {
                                    setIsExpanded(!isExpanded);
                                }
                            }}
                            className="text-white hover:text-gray-200 hover:bg-white/10"
                        >
                            {isExpanded ? (
                                <ChevronLeft className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </Button>
                    </div>}

                    {/* Navigation Items */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => {
                                        // On mobile, close the panel when navigating
                                        if (isMobile) {
                                            onToggle();
                                        }
                                    }}
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

