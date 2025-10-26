"use client";
import { VoissHeader } from "@/components/voiss-header";
import { VoissPanel } from "@/components/voiss-panel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

export default function ChatPage() {
 const isMobileHook = useIsMobile();

 const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed, will be updated in useEffect
 const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

 // Set initial sidebar state based on device type
 useEffect(() => {
  setIsSidebarOpen(!isMobileHook); // Mobile: false, Desktop: true
 }, [isMobileHook]);
 return (
  <div className="min-h-screen bg-[#ffffff] flex flex-col">
   <VoissHeader onMenuToggle={toggleSidebar} />
   <div className="flex flex-1">
    <VoissPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />
    <div className="flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0 md:ml-75 lg:ml-75 ' : 'ml-0'} flex flex-col">
     <h1 className="mt-8 ml-8 text-2xl font-semibold text-gray-800">Coming soon...</h1>
    </div>
   </div>
  </div>
 );
}