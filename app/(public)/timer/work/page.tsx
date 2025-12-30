'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';

const SECONDS = 60;
const WORK_MINUTES = 25;
const INITIAL_TIME = SECONDS * WORK_MINUTES;

export default function WorkTimerPage() {
  const router = useRouter();
  const { timeLeft, isRunning, toggleTimer } = useTimer(INITIAL_TIME);

  useEffect(() => {
    if(timeLeft === 0 && !isRunning) {
      router.push('/timer/completion?isWork=true');
    }
  }, [timeLeft, router, isRunning]);
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
        <TimerDisplay isWork={true} timeLeft={timeLeft} initialTime={INITIAL_TIME} />
        <TimerControls isWork={true} isRunning={isRunning} onToggle={toggleTimer} />
    </div>
  );
}

