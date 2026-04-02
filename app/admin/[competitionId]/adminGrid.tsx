"use client";

import {
  Track,
  type Participant,
  type RemoteParticipant,
} from "livekit-client";
import ParticipantTile from "./ParticipantTile";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useParticipants, useTracks } from "@livekit/components-react";

export default function AdminGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const remoteParticipants = useParticipants({});
  const studentParticipants: Participant[] = [];
  remoteParticipants.forEach((participant) => {
    if (
      participant.metadata &&
      (JSON.parse(participant.metadata as string) as { role: string })?.role ===
        "student" &&
      (participant as RemoteParticipant).isActive
    ) {
      studentParticipants.push(participant);
    }
  });
  // Calculate total pages
  const totalPages = Math.max(
    1,
    Math.ceil(studentParticipants.length / itemsPerPage),
  );
  // Clamp current page to valid bounds
  const validCurrentPage = Math.min(currentPage, totalPages);
  const trackRefs = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);
  if (studentParticipants.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-950 p-8 h-full">
        <Users className="w-16 h-16 mb-4 opacity-20" />
        <h2 className="text-xl font-medium">Waiting for Contestants</h2>
        <p className="mt-2 text-sm text-gray-600 text-center max-w-sm">
          No contestants have joined this room yet. When they join, their
          streams will appear here automatically.
        </p>
      </div>
    );
  }

  const paginatedParticipants = studentParticipants.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage,
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-950 p-6 h-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Active Contestants ({studentParticipants.length})
        </h2>

        {/* Pagination Controls */}
        {studentParticipants.length > itemsPerPage && (
          <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1.5 border border-gray-800">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={validCurrentPage === 1}
              className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </button>
            <span className="text-sm font-medium text-gray-300 min-w-16 text-center">
              {validCurrentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={validCurrentPage === totalPages}
              className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max flex-1 content-start">
        {paginatedParticipants.map((participant: Participant) => (
          <ParticipantTile
            key={participant.identity}
            participant={participant}
            trackRefs={trackRefs.filter(
              (ref) => ref.participant.identity === participant.identity,
            )}
          />
        ))}
      </div>
    </div>
  );
}
