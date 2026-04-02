"use client";

import { Competition } from "@october-math-community-circle/shared-utitilies/competition";
import { useEffect, useState } from "react";

interface CountdownProps {
  startDate: string;
  endDate: string;
  status: Competition["status"];
}

export function Countdown({ startDate, endDate, status }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = status === "in_progress" ? endDate : startDate;
      const difference = +new Date(targetDate) - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [startDate, endDate, status]);

  if (!timeLeft) {
    return (
      <span className="text-sm font-medium text-green-500">
        Live Now or Ended
      </span>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-primary">{timeLeft.days}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Days
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-primary">
          {timeLeft.hours.toString().padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Hrs
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-primary">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Mins
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-primary">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Secs
        </span>
      </div>
    </div>
  );
}
