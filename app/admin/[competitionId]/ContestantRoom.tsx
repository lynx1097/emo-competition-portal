"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoTrack,
  useLocalParticipant,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { logIncident } from "@/lib/firestore";
import { AlertTriangle, Lock } from "lucide-react";
import { Track } from "livekit-client";

interface ContestantRoomProps {
  roomName: string;
}

// Inner component to handle participant state within LiveKit context
function ConnectionManager({ roomName }: { roomName: string }) {
  const { localParticipant } = useLocalParticipant();
  const [examLocked, setExamLocked] = useState(false);
  const [hasRequestedScreenShare, setHasRequestedScreenShare] = useState(false);

  useEffect(() => {
    if (!localParticipant) return;

    // Auto-request screen share on join
    const requestScreenShare = async () => {
      try {
        await localParticipant.setScreenShareEnabled(true, { audio: false });
        setHasRequestedScreenShare(true);
      } catch (error) {
        console.error("Failed to enable screen share:", error);
        setExamLocked(true);
        logIncident(roomName, {
          participantId: localParticipant.identity,
          participantName: localParticipant.name || "Unknown",
          type: "manual",
          message: "Failed to start screen share initially",
        });
      }
    };

    if (!hasRequestedScreenShare) {
      requestScreenShare();
    }
  }, [localParticipant, roomName, hasRequestedScreenShare]);

  useEffect(() => {
    if (!localParticipant || !hasRequestedScreenShare) return;

    // Check if screen share was stopped
    const isSharingScreen = localParticipant.isScreenShareEnabled;
    if (!isSharingScreen && !examLocked) {
      setTimeout(() => setExamLocked(true), 0);
      logIncident(roomName, {
        participantId: localParticipant.identity,
        participantName: localParticipant.name || "Unknown",
        type: "screen-share-stopped",
        message: "Screen share was stopped by the user",
      });
    } else if (isSharingScreen && examLocked) {
      setTimeout(() => setExamLocked(false), 0);
    }
  }, [
    localParticipant?.isScreenShareEnabled,
    localParticipant,
    roomName,
    examLocked,
    hasRequestedScreenShare,
  ]);

  useEffect(() => {
    if (!localParticipant) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logIncident(roomName, {
          participantId: localParticipant.identity,
          participantName: localParticipant.name || "Unknown",
          type: "tab-switch",
          message: "User switched away from the exam tab",
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [localParticipant, roomName]);

  const cameraTrack = localParticipant?.getTrackPublication(
    Track.Source.Camera,
  )?.track;

  return (
    <>
      <RoomAudioRenderer />
      {/* Small camera preview (optional for contestant to see themselves) */}
      <div className="fixed bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700 z-50">
        {cameraTrack && cameraTrack instanceof Array === false ? (
          <VideoTrack
          /* trackRef={{
              participant: localParticipant!,
              source: Track.Source.Camera,
            }} */
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            Camera Off
          </div>
        )}
      </div>

      {examLocked && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white">
          <div className="bg-red-500/20 p-6 rounded-2xl border border-red-500/50 flex flex-col items-center max-w-md text-center">
            <Lock className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Exam Locked</h2>
            <p className="text-gray-300 mb-6">
              Your screen share was stopped. Screen sharing is required to
              continue the exam.
            </p>
            <button
              onClick={() =>
                localParticipant?.setScreenShareEnabled(true, { audio: false })
              }
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Resume Screen Share
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function ContestantRoom({ roomName }: ContestantRoomProps) {
  const [token, setToken] = useState<string>("");
  const [participantName, setParticipantName] = useState<string>("");
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName.trim()) return;

    try {
      const resp = await fetch("/api/livekit-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, participantName, role: "contestant" }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Failed to generate token");
      }

      setToken(data.token);
      setHasJoined(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white p-4">
        <form
          onSubmit={handleJoin}
          className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-800"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Join Exam</h1>
          <p className="text-gray-400 text-sm mb-6 text-center">
            Room: {roomName}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-white"
              placeholder="Enter your name"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Start Exam
          </button>
        </form>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={{ resolution: { width: 640, height: 360, frameRate: 15 } }}
      audio={false}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      className="min-h-screen flex flex-col bg-gray-950 text-white"
    >
      <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h1 className="font-semibold text-lg">Exam in Progress</h1>
          </div>
          <div className="text-sm text-gray-400">
            Contestant: <span className="text-gray-200">{participantName}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-8">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 min-h-125 flex items-center justify-center">
          <div className="text-center max-w-lg">
            <h2 className="text-3xl font-bold mb-4 text-gray-100">
              Olympiad Exam Environment
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              This space represents the exam content. Your screen and camera are
              currently being shared with the proctor. Do not close this tab or
              stop your screen share.
            </p>
          </div>
        </div>
      </main>

      <ConnectionManager roomName={roomName} />
    </LiveKitRoom>
  );
}
