"use client";
import { Flame } from "lucide-react";

interface StreakDisplayProps {
  count: number;
}

export const StreakDisplay = ({ count }: StreakDisplayProps) => {
  if (count === 0) return null; 

  return (
    <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-100 dark:bg-orange-900/50 rounded-full px-3 py-1">
      <Flame className="h-5 w-5" />
      <span>{count} Day Streak</span>
    </div>
  );
};