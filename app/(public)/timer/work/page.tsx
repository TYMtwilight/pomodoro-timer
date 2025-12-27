'use client';

import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';

const SECONDS = 60;
const WORK_MINUTES = 25;
const INITIAL_TIME = SECONDS * WORK_MINUTES;

export default function WorkTimerPage() {
  const { timeLeft, isRunning, toggleTimer } = useTimer(INITIAL_TIME);
  console.log('page.tsxレンダリング');
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-12">
        <TimerDisplay timeLeft={timeLeft} initialTime={INITIAL_TIME} />
        <TimerControls isRunning={isRunning} onToggle={toggleTimer} />
      </div>
    </div>
  );
}

