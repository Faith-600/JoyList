"use client";

import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

interface ConfettiWrapperProps {
  activeTodosCount: number;
}

export const ConfettiWrapper = ({ activeTodosCount }: ConfettiWrapperProps) => {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [width, height ] = useWindowSize();

  useEffect(() => {
    if (activeTodosCount === 0) {
      setIsCelebrating(true);
      const timer = setTimeout(() => setIsCelebrating(false), 5000); 
      return () => clearTimeout(timer);
    }
  }, [activeTodosCount]);
  
  if (!isCelebrating) return null;

  return <ReactConfetti width={width} height={height} />;
};