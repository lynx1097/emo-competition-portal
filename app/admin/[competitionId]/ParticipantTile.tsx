"use client";

import {
  TrackReference,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Participant, Track } from "livekit-client";
import { Camera, Monitor, VideoOff, Ban, MessageSquare } from "lucide-react";

export default function ParticipantTile({
  trackRefs,
  participant,
  isBlocked,
  onBlock,
  onPrivateMessage,
}: {
  trackRefs: TrackReference[];
  participant: Participant;
  isBlocked: boolean;
  onBlock: (participantIdentity: string) => void;
  onPrivateMessage: (participantIdentity: string, participantName: string) => void;
}) {
  const cameraRef = trackRefs.find((r) => r.source === Track.Source.Camera);
  const screenRef = trackRefs.find(
    (r) => r.source === Track.Source.ScreenShare,
  );

  const isCameraOn = !!cameraRef?.publication?.isSubscribed;
  const isScreenSharing = !!screenRef?.publication?.isSubscribed;
  const displayName = participant.name || participant.identity;

  return (
    <div
      className={`relative bg-gray-900 rounded-xl overflow-hidden border flex flex-col aspect-video group shadow-lg transition-transform hover:scale-[1.02] ${
        isBlocked ? "border-red-600" : "border-gray-800"
      }`}
    >
      {/* Blocked overlay */}
      {isBlocked && (
        <div className="absolute inset-0 z-40 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
          <Ban className="w-10 h-10 text-red-400 mb-2" />
          <span className="text-red-300 font-bold text-sm">Blocked</span>
        </div>
      )}

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

      {/* Top bar: name + stream status */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md max-w-[150px] truncate shadow-sm">
            {displayName}
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

      {/* Bottom action bar — visible on hover */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex gap-2 p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onPrivateMessage(participant.identity, displayName)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Message
        </button>
        <button
          onClick={() => onBlock(participant.identity)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isBlocked
              ? "bg-green-700/80 hover:bg-green-700 text-white"
              : "bg-red-700/80 hover:bg-red-700 text-white"
          }`}
        >
          <Ban className="w-3.5 h-3.5" />
          {isBlocked ? "Unblock" : "Block"}
        </button>
      </div>

      {/* Warning Border if missing required streams */}
      {!isBlocked && (!isCameraOn || !isScreenSharing) && (
        <div className="absolute inset-0 border-2 border-red-500/50 rounded-xl pointer-events-none z-30 animate-pulse" />
      )}
    </div>
  );
}
