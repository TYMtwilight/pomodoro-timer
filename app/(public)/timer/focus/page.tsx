'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { TimerType } from '@/types/timerType';
import { useSettings } from '@/contexts/SettingsContext';
import { useTasks } from '@/contexts/TaskContext';
import { TaskSelect } from '@/components/tasks';
import { SettingsModal } from '@/components/settings/SettingsMordal';

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

  // 設定モーダルの状態
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <TimerDisplay timerType={timerType} timeLeft={timeLeft} initialTime={INITIAL_TIME} sessionCount={sessionCount} maxSessions={maxSessions} />
      
      {/* 作業項目選択（タイマー実行中は変更不可） */}
      <div className="my-4">
        <TaskSelect disabled={isRunning} />
      </div>

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
