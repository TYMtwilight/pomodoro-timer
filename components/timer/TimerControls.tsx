'use client';

import { memo } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BLUE_500 = '#4979f5';

interface TimerControlsProps {
  isRunning: boolean;
  hasStarted: boolean;
  onToggle: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
}

export const TimerControls = memo(function TimerControls({
  isRunning,
  hasStarted,
  onToggle,
  onReset,
  onOpenSettings,
}: TimerControlsProps) {

  /**
   * 左ボタンを返す
   * - 未開始（hasStarted = false）: SETTINGSボタン
   * - 開始済み（hasStarted = true）: RESETボタン
   */
  const renderLeftButton = () => {
    if (!hasStarted) {
      return (
        <Button
          variant="outline"
          className="h-14 w-full rounded-lg border-1 border-white bg-black hover:bg-white text-white font-semibold transition-all duration-200 active:scale-95"
          onClick={onOpenSettings}
          aria-label="設定を開く"
        >
          <Settings className="w-5 h-5 mr-2" />
          SETTINGS
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        className="h-14 w-full rounded-lg border-1 border-white bg-black hover:bg-white text-white font-semibold transition-all duration-200 active:scale-95"
        onClick={onReset}
        aria-label="タイマーをリセット"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        RESET
      </Button>
    );
  };

  return (
    <div className="flex gap-4 w-full max-w-md px-4">
      {/* 左: SETTINGS または RESET */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isRunning ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          flexBasis: isRunning ? '0%' : '50%',
          flexShrink: 0,
          flexGrow: 0,
        }}
      >
        <div className="min-w-max">
          {renderLeftButton()}
        </div>
      </div>

      {/* 右: START/STOP */}
      <div className="flex-1 transition-all duration-500 ease-out">
        <Button
          size="lg"
          className={`h-14 w-full rounded-lg text-white font-bold text-lg transition-all duration-200 ${
            !isRunning ? 'animate-glow-pulse' : ''
          }`}
          style={
            isRunning ? {
              backgroundColor: BLUE_500,
            } : {
              border: `1px solid ${BLUE_500}`,
              backgroundColor: 'black',
            }
          }
          onClick={onToggle}
          aria-label={isRunning ? 'タイマーを停止' : 'タイマーを開始'}
        >
          {isRunning ? (
            <>
              <Pause className="w-6 h-6 mr-2" />
              STOP
            </>
          ) : (
            <>
              <Play className="w-6 h-6 mr-2" />
              START
            </>
          )}
        </Button>
      </div>
    </div>
  );
});
