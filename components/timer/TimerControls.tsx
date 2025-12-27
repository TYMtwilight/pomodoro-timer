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
    <div className="flex flex-col justify-end items-center w-full max-w-3xl gap-2">
      {isRunning ? (
        <label htmlFor="stopWork" className="text-white">作業を一時停止する</label>
      ) : (
        <label htmlFor="startWork" className="text-white">作業を開始する</label>
      )}
      <Button
        onClick={onToggle}
        size="lg"
        className="w-32 h-32 mb-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        {isRunning ? (
          <Pause id="stopWork" className="w-8 h-8" />
        ) : (
          <Play id="startWork"className="w-8 h-8" />
        )}
      </Button>
    </div>
  );
});
