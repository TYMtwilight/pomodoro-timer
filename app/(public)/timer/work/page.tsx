'use client';

import { useSearchParams } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { TimerType } from '@/types/timerType';

const SECONDS = 60;
const WORK_MINUTES = 1;
const INITIAL_TIME = SECONDS * WORK_MINUTES;

export default function WorkTimerPage() {
  const searchParams = useSearchParams();
  const autoStart = searchParams.get('autoStart') === 'true';
  const timerType: TimerType = 'work';

  const {sessionCount, timeLeft, isRunning, toggleTimer, resetTimer} = useTimer(timerType, INITIAL_TIME, autoStart);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <TimerDisplay timerType={timerType} timeLeft={timeLeft} initialTime={INITIAL_TIME} sessionCount={sessionCount}/>
      <TimerControls timerType={timerType} isRunning={isRunning} onToggle={toggleTimer} onReset={resetTimer} />
    </div>
  );
}

