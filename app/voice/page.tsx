"use client";

import { useState } from "react";

export const dynamic = 'force-dynamic';
import { FlexHeader } from "@/components/flex-header";
import { FlexPanel } from "@/components/flex-panel";
import { FlexFooter } from "@/components/flex-footer";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { mockAudioData } from "../../lib/mock";
import { AudioVisualizer } from "@/components/audio-visualizer";

// Audio file paths - using public URLs instead of imports
const goodJobAudio = '/good-job.mp3';
const youMissedAudio = '/you-missed.mp3';

function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VoicePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const [audioFiles] = useState([goodJobAudio, youMissedAudio]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 700);
    };

    // Function to play audio with state management
    const playAudio = (audioPath: string, audioId: string) => {
        // Stop any currently playing audio
        if (playingAudio) {
            const currentAudio = document.querySelector(`audio[data-id="${playingAudio}"]`) as HTMLAudioElement;
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
        }

        setPlayingAudio(audioId);
        const audio = new Audio(audioPath);
        audio.setAttribute('data-id', audioId);

        audio.addEventListener('ended', () => {
            setPlayingAudio(null);
        });

        audio.addEventListener('error', () => {
            setPlayingAudio(null);
            console.error('Error playing audio:', audioPath);
        });

        audio.play().catch(error => {
            setPlayingAudio(null);
            console.error('Error playing audio:', error);
        });
    };

    // Map mock data and only assign audio files to first 2 records
    const rows = mockAudioData?.data?.map((item, index) => ({
        ...item,
        voicePath: index < 2 ? audioFiles[index] : null // Only first 2 get audio files
    })) ?? [];

    return (
        <div className="min-h-screen bg-[#FFFDF6]">
            <FlexHeader onMenuToggle={toggleSidebar} />

            <div className="flex">
                <FlexPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />

                <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0 md:ml-64 lg:ml-64' : 'ml-0'}`}>
                    <div className="bg-[#fffdf6] shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Audio Recordings</h1>
                                    <p className="text-sm text-gray-600 mt-1">Recent audio recordings and voice messages</p>
                                </div>
                                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                    <Button
                                        variant="outline"
                                        onClick={handleRefresh}
                                        disabled={refreshing}
                                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                                        Refresh
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#fffdf6]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Audio Recordings</h3>
                                        <p className="text-sm text-gray-600">Recent audio recordings and voice messages</p>
                                    </div>
                                    <div className="flex items-center">
                                        {playingAudio !== null && (
                                            <AudioVisualizer
                                                mp3Url={audioFiles.find((_, index) => rows[index]?.id.toString() === playingAudio) || ''}
                                                isPlaying={playingAudio !== null}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speaker</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audio</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {rows.map((r: any) => (
                                                <tr key={r.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{r.speaker}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDuration(r.durationSeconds)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(r.timestamp).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {r.voicePath ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => playAudio(r.voicePath, r.id.toString())}
                                                                disabled={playingAudio === r.id.toString()}
                                                                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                            >
                                                                {playingAudio === r.id.toString() ? (
                                                                    <>
                                                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                                                                        Playing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        🔊 Play
                                                                    </>
                                                                )}
                                                            </Button>
                                                        ) : (
                                                            <span className="text-sm text-gray-400 italic">No audio</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>

                    <FlexFooter />
                </div>
            </div>
        </div>
    );
}
