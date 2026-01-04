'use client';

import { useSearchParams } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { TimerType } from '@/types/timerType';

const SECONDS = 60;
const LONG_BREAK_MINUTES = 1;
const INITIAL_TIME = SECONDS * LONG_BREAK_MINUTES;
const timerType: TimerType = 'long-break';

export default function LongBreakTimerPage() {
  const searchParams = useSearchParams();
  const autoStart = searchParams.get('autoStart') === 'true';

  const { timeLeft, isRunning, toggleTimer, resetTimer } = useTimer(timerType, INITIAL_TIME, autoStart);
  console.log(timerType);
  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <TimerDisplay timerType={timerType} timeLeft={timeLeft} initialTime={INITIAL_TIME} />
      <TimerControls timerType={timerType} isRunning={isRunning} onToggle={toggleTimer} onReset={resetTimer} />
    </div>
  );
}
