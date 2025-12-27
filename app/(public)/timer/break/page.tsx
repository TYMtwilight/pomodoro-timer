'use client';

import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';

const SECONDS = 60;
const BREAK_MINUTES = 5;
const INITIAL_TIME = SECONDS * BREAK_MINUTES;

export default function BreakTimerPage() {
  const { timeLeft, isRunning, toggleTimer } = useTimer(INITIAL_TIME);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-12">
        <TimerDisplay timeLeft={timeLeft} initialTime={INITIAL_TIME} />
        <TimerControls isRunning={isRunning} onToggle={toggleTimer} />
      </div>
    </div>
  );
}

