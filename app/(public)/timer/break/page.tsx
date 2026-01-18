'use client';

import { useSearchParams } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { TimerType } from '@/types/timerType';
import { useSettings } from '@/contexts/SettingsContext';

const SECONDS = 60;
const timerType: TimerType = 'break';

export default function BreakTimerPage() {
  const searchParams = useSearchParams();
  const autoStart = searchParams.get('autoStart') === 'true';

  // 設定から短い休憩時間を取得
  const { settings } = useSettings();
  const INITIAL_TIME = SECONDS * settings.breakTime;

  const { sessionCount, maxSessions, timeLeft, isRunning, hasStarted, toggleTimer, resetTimer } = useTimer(timerType, INITIAL_TIME, autoStart);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <TimerDisplay timerType={timerType} timeLeft={timeLeft} initialTime={INITIAL_TIME} sessionCount={sessionCount} maxSessions={maxSessions} />

      <TimerControls
        isRunning={isRunning}
        hasStarted={hasStarted}
        onToggle={toggleTimer}
        onReset={resetTimer}
      />
    </div>
  );
}
