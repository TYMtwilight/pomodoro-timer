'use client';

import { useSearchParams } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { useSession } from '@/contexts/SessionContext';
import { TimerType } from '@/types/timerType';

const SECONDS = 60;
const BREAK_MINUTES = 0.1;
const INITIAL_TIME = SECONDS * BREAK_MINUTES;
const timerType: TimerType = 'break';

export default function BreakTimerPage() {
  const searchParams = useSearchParams();
  const autoStart = searchParams.get('autoStart') === 'true';
  const { sessionCount } = useSession();
  
  const { timeLeft, isRunning, toggleTimer, resetTimer } = useTimer(timerType, INITIAL_TIME, autoStart);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <TimerDisplay isWork={false} timeLeft={timeLeft} initialTime={INITIAL_TIME} sessionCount={sessionCount} />
      <TimerControls isWork={false} isRunning={isRunning} onToggle={toggleTimer} onReset={resetTimer} />
    </div>
  );
}


