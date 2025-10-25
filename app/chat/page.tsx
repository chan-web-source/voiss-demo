"use client";
import { VoissHeader } from "@/components/voiss-header";
import { VoissPanel } from "@/components/voiss-panel";
import { useState } from "react";

export default function ChatPage() {
 const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
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