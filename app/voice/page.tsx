"use client";

import { useState, useRef, useEffect } from "react";

export const dynamic = 'force-dynamic';
import { VoissHeader } from "@/components/voiss-header";
import { VoissPanel } from "@/components/voiss-panel";
import { VoissFooter } from "@/components/voiss-footer";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { mockAudioData } from "../../lib/mock";
import { AudioVisualizer } from "@/components/audio-visualizer";
import { useToast } from "@/hooks/use-toast";
import { AudioRecordingsTable } from "./table/page";
import { useIsMobile } from "@/hooks/use-mobile";

// Audio file paths - using public URLs instead of imports
const goodJobAudio = '/good-job.mp3';
const youMissedAudio = '/you-missed.mp3';

function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VoicePage() {
    const isMobileHook = useIsMobile();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed, will be updated in useEffect
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const [audioFiles] = useState([goodJobAudio, youMissedAudio]);
    const [uploadedAudios, setUploadedAudios] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);
    const audioEventHandlersRef = useRef<{
        handleEnded?: () => void;
        handleError?: () => void;
    }>({});
    const { toast } = useToast();

    // Set initial sidebar state based on device type
    useEffect(() => {
        setIsSidebarOpen(!isMobileHook); // Mobile: false, Desktop: true
    }, [isMobileHook]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Function to get audio duration
    const getAudioDuration = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            const url = URL.createObjectURL(file);

            audio.addEventListener('loadedmetadata', () => {
                URL.revokeObjectURL(url);
                resolve(audio.duration);
            });

            audio.addEventListener('error', () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load audio'));
            });

            audio.src = url;
        });
    };

    // Handle file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check if file is MP3
        if (!file.type.includes('audio/mpeg') && !file.name.toLowerCase().endsWith('.mp3')) {
            toast({
                title: "Upload failed",
                description: "Please only upload MP3 format audio files",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        try {
            const duration = await getAudioDuration(file);

            // Check if duration exceeds 30 seconds
            if (duration > 90) {
                toast({
                    title: "Upload failed",
                    description: "Audio file cannot exceed 30 seconds, please select a shorter audio file",
                    variant: "destructive",
                    duration: 9000,
                });
                return;
            }

            const audioUrl = URL.createObjectURL(file);

            // Get current time in the specified format
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const currentTimestamp = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

            const newAudio = {
                id: Date.now(), // Use timestamp as unique ID
                speaker: "Trail User",
                durationSeconds: Math.round(duration),
                timestamp: currentTimestamp,
                voicePath: audioUrl,
                isUploaded: true
            };

            setUploadedAudios(prev => [...prev, newAudio]);

            // Show success toast
            toast({
                title: "Upload successful",
                description: `Audio file "${file.name}" has been successfully uploaded`,
                duration: 3000,
            });
        } catch (error) {
            console.error('Error processing audio file:', error);
            toast({
                title: "Upload failed",
                description: "Error processing audio file, please try again",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Function to play audio with state management
    const playAudio = (audioPath: string, audioId: string) => {
        // Stop any currently playing audio and clean up event listeners
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;

            // Remove event listeners using stored references
            if (audioEventHandlersRef.current.handleEnded) {
                currentAudioRef.current.removeEventListener('ended', audioEventHandlersRef.current.handleEnded);
            }
            if (audioEventHandlersRef.current.handleError) {
                currentAudioRef.current.removeEventListener('error', audioEventHandlersRef.current.handleError);
            }

            currentAudioRef.current = null;
            audioEventHandlersRef.current = {};
        }

        setPlayingAudio(audioId);
        const audio = new Audio(audioPath);
        currentAudioRef.current = audio;

        const handleEnded = () => {
            setPlayingAudio(null);
            currentAudioRef.current = null;
            audioEventHandlersRef.current = {};
        };

        const handleError = () => {
            setPlayingAudio(null);
            currentAudioRef.current = null;
            audioEventHandlersRef.current = {};
            console.error('Error playing audio:', audioPath);
        };

        // Store event handler references
        audioEventHandlersRef.current.handleEnded = handleEnded;
        audioEventHandlersRef.current.handleError = handleError;

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        audio.play().catch(error => {
            setPlayingAudio(null);
            currentAudioRef.current = null;
            audioEventHandlersRef.current = {};
            console.error('Error playing audio:', error);
        });
    };

    // Map mock data and only assign audio files to first 2 records
    const originalRows = mockAudioData?.data?.map((item, index) => ({
        ...item,
        voicePath: index < 2 ? audioFiles[index] : null // Only first 2 get audio files
    })) ?? [];

    // Combine original data with uploaded audios
    const rows = [...originalRows, ...uploadedAudios];

    return (
        <div className="min-h-screen bg-[#ffffff] flex flex-col">
            <VoissHeader onMenuToggle={toggleSidebar} />

            <div className="flex flex-1">
                <VoissPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />

                <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0 md:ml-64 lg:ml-64' : 'ml-0'} flex flex-col min-h-0 max-w-full overflow-hidden`}>
                    <div className="bg-white">
                        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Audio Recordings (Demo purpose)</h1>
                                    <p className="text-sm text-gray-600 mt-1">Recent audio recordings</p>
                                </div>
                                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                    <Button
                                        variant="outline"
                                        onClick={handleUploadClick}
                                        className="voiss-button"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload MP3
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".mp3,audio/mpeg"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white flex-1 overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-lg shadow-gray-200/50 overflow-hidden">
                                <div className="px-6 py-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Audio Recordings</h3>
                                            <p className="text-sm text-gray-600">Recent audio recordings and voice messages</p>
                                        </div>
                                        <div className="flex items-center mt-4 sm:mt-0">
                                            {playingAudio !== null && (
                                                <AudioVisualizer
                                                    mp3Url={rows.find(row => row.id.toString() === playingAudio)?.voicePath || ''}
                                                    isPlaying={playingAudio !== null}
                                                    audioElement={currentAudioRef.current}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <AudioRecordingsTable
                                    rows={rows}
                                    playingAudio={playingAudio}
                                    onPlayAudio={playAudio}
                                    formatDuration={formatDuration}
                                />
                            </div>

                        </div>
                    </div>

                    <VoissFooter />
                </div>
            </div>
        </div>
    );
}
