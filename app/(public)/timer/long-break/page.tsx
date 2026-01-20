'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerLabel } from '@/components/timer/TimerLabel';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { TimerType } from '@/types/timerType';
import { useSettings } from '@/contexts/SettingsContext';

const SECONDS = 60;
const timerType: TimerType = 'long-break';

export default function LongBreakTimerPage() {
  const searchParams = useSearchParams();
  const autoStart = searchParams.get('autoStart') === 'true';

  // 設定から長い休憩時間を取得
  const { settings, isLoading } = useSettings();
  const INITIAL_TIME = useMemo(() => SECONDS * settings.longBreakTime, [settings.longBreakTime]);

  const { maxSessions, timeLeft, isRunning, hasStarted, toggleTimer, resetTimer } = useTimer(timerType, INITIAL_TIME, autoStart);

  // 設定読み込み中はローディング表示
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)] gap-8 bg-black text-white px-4 py-4">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)] gap-8 bg-black text-white px-4 py-4">
      <TimerLabel timerType={timerType} isRunning={isRunning} />
      <TimerDisplay timeLeft={timeLeft} initialTime={INITIAL_TIME} maxSessions={maxSessions} />
      <TimerControls
        isRunning={isRunning}
        hasStarted={hasStarted}
        onToggle={toggleTimer}
        onReset={resetTimer}
      />
    </div>
  );
}
