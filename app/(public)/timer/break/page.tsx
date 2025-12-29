'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';

const SECONDS = 60;
const BREAK_MINUTES = 5;
const INITIAL_TIME = SECONDS * BREAK_MINUTES;

export default function BreakTimerPage() {
  const router = useRouter();
  const { timeLeft, isRunning, toggleTimer } = useTimer(INITIAL_TIME);


  useEffect(() => {
    if(timeLeft === 0 && !isRunning) {
      router.push('/timer/completion?isWork=false');
    }
  }, [timeLeft, router, isRunning]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black">
      <TimerDisplay timeLeft={timeLeft} initialTime={INITIAL_TIME} />
      <TimerControls isWork={false} isRunning={isRunning} onToggle={toggleTimer} />
    </div>
  );
}


