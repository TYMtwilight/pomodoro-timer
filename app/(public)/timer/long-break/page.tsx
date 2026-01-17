'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { TimerType } from '@/types/timerType';
import { useSettings } from '@/contexts/SettingsContext';
import { SettingsModal } from '@/components/settings/SettingsMordal';

const SECONDS = 60;
const timerType: TimerType = 'long-break';

export default function LongBreakTimerPage() {
  const searchParams = useSearchParams();
  const autoStart = searchParams.get('autoStart') === 'true';

  // 設定から長い休憩時間を取得
  const { settings } = useSettings();
  const INITIAL_TIME = SECONDS * settings.longBreakTime;

  const { maxSessions, timeLeft, isRunning, hasStarted, toggleTimer, resetTimer } = useTimer(timerType, INITIAL_TIME, autoStart);

  // 設定モーダルの状態
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <TimerDisplay timerType={timerType} timeLeft={timeLeft} initialTime={INITIAL_TIME} maxSessions={maxSessions} />
      
      <TimerControls
        isRunning={isRunning}
        hasStarted={hasStarted}
        onToggle={toggleTimer}
        onReset={resetTimer}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 設定モーダル */}
      <SettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
}
