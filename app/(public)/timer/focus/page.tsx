'use client';

import { useSearchParams } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerLabel } from '@/components/timer/TimerLabel';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { TimerType } from '@/types/timerType';
import { useSettings } from '@/contexts/SettingsContext';
import { useTasks } from '@/contexts/TaskContext';

const SECONDS = 60;
const timerType: TimerType = 'focus';

export default function WorkTimerPage() {
  const searchParams = useSearchParams();
  const autoStart = searchParams.get('autoStart') === 'true';

  const { settings } = useSettings();
  const { selectedTaskId } = useTasks();
  const INITIAL_TIME = SECONDS * settings.focusTime;

  const { sessionCount, maxSessions, timeLeft, isRunning, hasStarted, toggleTimer, resetTimer } = useTimer(
    timerType,
    INITIAL_TIME,
    autoStart,
    selectedTaskId
  );

  return (
    <div className="flex flex-col items-center h-[calc(100vh-72px)] gap-8 bg-black text-white px-4 py-4">
      <TimerLabel timerType={timerType} isRunning={isRunning} />
      <TimerDisplay timeLeft={timeLeft} initialTime={INITIAL_TIME} sessionCount={sessionCount} maxSessions={maxSessions} />
      <TimerControls
        isRunning={isRunning}
        hasStarted={hasStarted}
        onToggle={toggleTimer}
        onReset={resetTimer}
      />
    </div>
  );
}
