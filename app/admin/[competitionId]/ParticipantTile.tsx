"use client";

import {
  TrackReference,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Participant, Track } from "livekit-client";
import { Camera, Monitor, VideoOff } from "lucide-react";

export default function ParticipantTile({
  trackRefs,
  participant,
}: {
  trackRefs: TrackReference[];
  participant: Participant;
}) {
  // 2. Extract specific references for the UI
  const cameraRef = trackRefs.find((r) => r.source === Track.Source.Camera);
  const screenRef = trackRefs.find(
    (r) => r.source === Track.Source.ScreenShare,
  );

  // 3. Derived states for clean logic
  const isCameraOn = !!cameraRef?.publication?.isSubscribed;
  const isScreenSharing = !!screenRef?.publication?.isSubscribed;

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 flex flex-col aspect-video group shadow-lg transition-transform hover:scale-[1.02]">
      {/* Main Background: Screen Share */}
      <div className="absolute inset-0 bg-gray-950 flex flex-col items-center justify-center">
        {screenRef ? (
          <VideoTrack
            trackRef={screenRef}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-600">
            <Monitor className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">No Screen Share</span>
          </div>
        )}
      </div>

      {/* Picture-in-Picture: Camera */}
      <div className="absolute bottom-4 right-4 w-1/3 aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-800 shadow-2xl z-10 transition-all">
        {cameraRef ? (
          <VideoTrack
            trackRef={cameraRef}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gray-950">
            <VideoOff className="w-6 h-6 mb-1 opacity-50" />
            <span className="text-xs font-medium">Cam Off</span>
          </div>
        )}
      </div>

      {/* Overlay: Participant Info & Status */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md max-w-[150px] truncate shadow-sm">
            {participant.name || participant.identity}
          </div>
        </div>

        <div className="flex gap-2">
          <div
            className={`p-1.5 rounded-md backdrop-blur-md ${isCameraOn ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
            title={isCameraOn ? "Camera On" : "Camera Off"}
          >
            <Camera className="w-4 h-4" />
          </div>
          <div
            className={`p-1.5 rounded-md backdrop-blur-md ${isScreenSharing ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
            title={isScreenSharing ? "Screen Share On" : "Screen Share Off"}
          >
            <Monitor className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Warning Border if missing required streams */}
      {(!isCameraOn || !isScreenSharing) && (
        <div className="absolute inset-0 border-2 border-red-500/50 rounded-xl pointer-events-none z-30 animate-pulse" />
      )}
    </div>
  );
}
