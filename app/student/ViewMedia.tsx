"use client";
import { useEffect, useRef, useState } from "react";
import { useStreams } from "./useStreams";
import { EyeOff, Eye, ArrowLeftRight, ArrowUpDown } from "lucide-react";

function ViewMedia() {
  const { cameraStream, screenStream } = useStreams();
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 480, height: 260 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isHidden) {
      if (cameraVideoRef.current) cameraVideoRef.current.srcObject = null;
      if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
      return;
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = cameraStream || null;
    }
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenStream || null;
    }
  }, [cameraStream, screenStream, isHidden]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isResizeHandle =
      e.clientX > rect.right - 20 && e.clientY > rect.bottom - 20;

    if (isResizeHandle) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const toggleLayout = () => {
    setIsVertical(!isVertical);
    setSize((prev) => ({ width: prev.height, height: prev.width }));
  };

  if (!cameraStream || !screenStream) return null;
  return (
    <>
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          display: isHidden ? "none" : "",
        }}
        className={`fixed bottom-4 right-4 z-50 flex flex-col rounded-xl bg-black/70 p-3 shadow-2xl backdrop-blur-md resize overflow-hidden min-w-48 min-h-32 border border-white/10 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex w-full justify-between items-center mb-2 pb-1 border-b border-white/10">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={toggleLayout}
            className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-xs"
            title="Toggle Layout"
          >
            {isVertical ? (
              <>
                <ArrowLeftRight size={14} /> Horizontal
              </>
            ) : (
              <>
                <ArrowUpDown size={14} /> Vertical
              </>
            )}
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setIsHidden(true)}
            className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1 text-xs"
            title="Hide Preview"
          >
            <EyeOff size={14} /> Hide
          </button>
        </div>

        <div
          className={`flex flex-1 gap-3 ${isVertical ? "flex-col" : "flex-row"}`}
        >
          <video
            ref={cameraVideoRef}
            autoPlay
            muted
            className="flex-1 w-full h-full min-w-0 min-h-0 rounded-lg bg-zinc-900 object-contain shadow-sm pointer-events-none"
          />
          <video
            ref={screenVideoRef}
            autoPlay
            muted
            className="flex-1 w-full h-full min-w-0 min-h-0 rounded-lg bg-zinc-900 object-contain shadow-sm pointer-events-none"
          />
        </div>
      </div>
      <button
        onClick={() => setIsHidden(false)}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full bg-black/70 
          ${!isHidden ? "hidden!" : ""}
          text-white shadow-xl backdrop-blur-md border 
          border-white/10 hover:bg-black/90 transition-colors`}
      >
        <Eye className="w-5 h-5" />
      </button>
    </>
  );
}

export default ViewMedia;
