"use client";

import { Flame } from "lucide-react";

interface KarmaDisplayProps {
  score: number;
}

export const KarmaDisplay = ({ score }: KarmaDisplayProps) => {
  const level = Math.floor(score / 100);
  const progressToNextLevel = (score % 100);

  return (
    <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg text-pink-500 flex items-center">
          <Flame className="mr-2 h-5 w-5" />
          Karma Score
        </h3>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{score}</p>
      </div>
      <div className="text-right">
        <h3 className="font-bold text-lg text-gray-500 dark:text-gray-400">Level {level}</h3>
        <div className="w-32 mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-pink-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressToNextLevel}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mt-1">{100 - progressToNextLevel} points to next level</p>
      </div>
    </div>
  );
};