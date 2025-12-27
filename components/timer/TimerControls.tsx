'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  onToggle: () => void;
}

export const TimerControls = memo(function TimerControls({
  isRunning,
  onToggle
}: TimerControlsProps) {
  return (
    <Button
      onClick={onToggle}
      size="lg"
      className="w-32 h-32 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
    >
      {isRunning ? (
        <Pause className="w-8 h-8" />
      ) : (
        <Play className="w-8 h-8 ml-1" />
      )}
    </Button>
  );
});
