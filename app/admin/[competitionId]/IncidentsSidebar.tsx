"use client";

import { useEffect, useState } from "react";
import { subscribeToIncidents } from "@/lib/firestore";
import { Incident } from "@october-math-community-circle/shared-utitilies/proctoring";
import {
  ShieldAlert,
  MonitorOff,
  VideoOff,
  AppWindow,
  Clock,
} from "lucide-react";

interface IncidentsSidebarProps {
  roomName: string;
}

export default function IncidentsSidebar({ roomName }: IncidentsSidebarProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToIncidents(roomName, (data) => {
      setIncidents(data);
    });

    return () => unsubscribe();
  }, [roomName]);

  const getIncidentIcon = (type: Incident["type"]) => {
    switch (type) {
      case "tab-switch":
        return <AppWindow className="w-4 h-4 text-orange-400" />;
      case "screen-share-stopped":
        return <MonitorOff className="w-4 h-4 text-red-500" />;
      case "camera-off":
        return <VideoOff className="w-4 h-4 text-red-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-yellow-500" />;
    }
  };

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
        <h2 className="font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          Incident Log
        </h2>
        <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full">
          {incidents.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {incidents.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No incidents reported</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-gray-950 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50 group-hover:bg-red-500 transition-colors" />
              <div className="pl-2">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-200 truncate">
                    {getIncidentIcon(incident.type)}
                    <span className="truncate" title={incident.participantName}>
                      {incident.participantName}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimestamp(incident.timestamp)}
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {incident.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
