'use client';

import { useSearchParams } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { useSession } from '@/contexts/SessionContext';

const SECONDS = 60;
const WORK_MINUTES = 25;
const INITIAL_TIME = SECONDS * WORK_MINUTES;

export default function WorkTimerPage() {
  const searchParams = useSearchParams();
  const isWork = true;
  const autoStart = searchParams.get('autoStart') === 'true';
  const { sessionCount } = useSession();

  const { timeLeft, isRunning, toggleTimer, resetTimer } = useTimer(isWork, INITIAL_TIME, autoStart);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <TimerDisplay isWork={true} timeLeft={timeLeft} initialTime={INITIAL_TIME} sessionCount={sessionCount} />
      <TimerControls isWork={true} isRunning={isRunning} onToggle={toggleTimer} onReset={resetTimer} />
    </div>
  );
}

