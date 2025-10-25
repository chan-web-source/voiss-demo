"use client";

import { Button } from "@/components/ui/button";

interface AudioRecordingsTableProps {
 rows: any[];
 playingAudio: string | null;
 onPlayAudio: (audioPath: string, audioId: string) => void;
 formatDuration: (seconds: number) => string;
}

export function AudioRecordingsTable({
 rows,
 playingAudio,
 onPlayAudio,
 formatDuration
}: AudioRecordingsTableProps) {
 return (
  <div className="overflow-x-auto max-w-full">
   <table className="w-full min-w-[600px]">
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
       <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{r.speaker}</div>
       </td>
       <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDuration(r.durationSeconds)}
       </td>
       <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className="hidden sm:inline">{new Date(r.timestamp).toLocaleString()}</span>
        <span className="sm:hidden">{new Date(r.timestamp).toLocaleDateString()}</span>
       </td>
       <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        {r.voicePath ? (
         <Button
          variant="outline"
          size="sm"
          onClick={() => onPlayAudio(r.voicePath, r.id.toString())}
          disabled={playingAudio !== null}
          className="voiss-button disabled:opacity-50 text-xs sm:text-sm"
         >
          {playingAudio === r.id.toString() ? (
           <>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse mr-1 sm:mr-2"></div>
            <span className="hidden sm:inline">Playing...</span>
            <span className="sm:hidden">...</span>
           </>
          ) : (
           <>
            <span className="hidden sm:inline">🔊 Play</span>
            <span className="sm:hidden">▶</span>
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
 );
}
