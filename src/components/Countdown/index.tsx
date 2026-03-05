"use client";

import { cn } from "@/utilities/cn";
import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string | Date;
  className?: string;
};

export function Countdown({ className, targetDate }: CountdownProps) {
  const targetTime = new Date(targetDate).getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  if (!timeLeft) return null;

  const splitDigits = (num: number) => {
    return String(num)
      .padStart(2, "0")
      .split("")
      .map((digit, index) => (
        <span className="bg-primary text-brand-primary flex h-6 w-6 items-center justify-center rounded text-base" key={index}>
          {digit}
        </span>
      ));
  };

  return (
    <div className={cn("flex items-baseline justify-center space-x-2 rounded-lg text-white", className)}>
      <div className="flex items-center gap-2 max-lg:flex-col">
        <div className="flex space-x-1">{splitDigits(timeLeft.days)}</div>
        <p className="text-sm">dias</p>
      </div>
      <span className="lg:hidden">:</span>
      <div className="flex items-center gap-2 max-lg:flex-col">
        <div className="flex space-x-1">{splitDigits(timeLeft.hours)}</div>
        <p className="text-sm">horas</p>
      </div>
      <span className="lg:hidden">:</span>
      <div className="flex items-center gap-2 max-lg:flex-col">
        <div className="flex space-x-1">{splitDigits(timeLeft.minutes)}</div>
        <p className="text-sm">min.</p>
      </div>
      <span className="lg:hidden">:</span>
      <div className="flex items-center gap-2 max-lg:flex-col">
        <div className="flex space-x-1">{splitDigits(timeLeft.seconds)}</div>
        <p className="text-sm">seg.</p>
      </div>
    </div>
  );
}
