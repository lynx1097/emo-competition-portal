"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CompetitionCountdownProps {
  endDate: string;
}

export function CompetitionCountdown({ endDate }: CompetitionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return (
      <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-500 shadow-md backdrop-blur-md">
        <Clock className="h-4 w-4" />
        <span className="font-mono text-lg font-bold tracking-wider">
          00:00:00
        </span>
      </div>
    );
  }

  const formatUnit = (unit: number) => unit.toString().padStart(2, "0");

  return (
    <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2 shadow-md backdrop-blur-md">
      <Clock className="h-4 w-4 text-primary" />
      <span className="font-mono text-lg font-bold tracking-wider text-zinc-100">
        {formatUnit(timeLeft.hours)}:{formatUnit(timeLeft.minutes)}:
        {formatUnit(timeLeft.seconds)}
      </span>
    </div>
  );
}
