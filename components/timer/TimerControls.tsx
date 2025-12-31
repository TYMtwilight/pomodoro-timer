'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerControlsProps {
  isWork: boolean;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const TimerControls = memo(function TimerControls({
  isWork,
  isRunning,
  onToggle,
  onReset
}: TimerControlsProps) {
  const startLabel = isWork ? '作業を開始する' : '休憩を開始する';
  const stopLabel = isWork ? '作業を一時停止する' : '休憩を一時停止する';
  const resetLabel = 'リセット';

  return (
    <div className="flex flex-col justify-end items-center w-full max-w-3xl gap-4">
      <div className="flex items-center">
        <div className="flex flex-col items-center w-40 gap-2">
          {isRunning ? (
            <label htmlFor="stopWork" className="text-white">{stopLabel}</label>
          ) : (
            <label htmlFor="startWork" className="text-white">{startLabel}</label>
          )}
          <Button
            onClick={onToggle}
            size="lg"
            className="w-24 h-24 mb-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {isRunning ? (
              <Pause id="stopWork" className="w-8 h-8" />
            ) : (
              <Play id="startWork" className="w-8 h-8" />
            )}
          </Button>
        </div>
        <div className="flex flex-col items-center w-40 gap-2">
          <label htmlFor="resetTimer" className="text-white">{resetLabel}</label>
          <Button
            onClick={onReset}
            size="lg"
            className="w-24 h-24 mb-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <RotateCcw id="resetTimer" className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
});
