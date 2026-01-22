'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerLabel } from '@/components/timer/TimerLabel';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { TimerType } from '@/types/timerType';
import { useSettings } from '@/contexts/SettingsContext';
import { useEffect, useCallback } from 'react';

interface TimerPageProps {
  timerType: TimerType;
}

export function TimerPage({ timerType }: TimerPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const autoStart = searchParams.get('autoStart') === 'true';

  const { isLoading } = useSettings();

  // タイマー完了時のコールバック（ページ遷移）
  const handleTimerComplete = useCallback(() => {
    router.push(`/completion?timerType=${timerType}`);
  }, [router, timerType]);

  const { sessionCount, maxSessions, timeLeft, initialTime, isRunning, hasStarted, toggleTimer, resetTimer } = useTimer(
    timerType,
    autoStart,
    handleTimerComplete
  );

  useEffect(() => {
    // 初回マウント時のみURLからクエリパラメーターを削除
    switch (timerType) {
      case 'focus':
        router.replace('/');
        break;
      case 'break':
        router.replace('/break');
        break;
      case 'long-break':
        router.replace('/long-break');
        break;
      default:
        router.replace('/');
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <TimerLabel timerType={timerType} />
      <TimerDisplay timeLeft={timeLeft} initialTime={initialTime} sessionCount={sessionCount} maxSessions={maxSessions} />
      <TimerControls
        isRunning={isRunning}
        hasStarted={hasStarted}
        onToggle={toggleTimer}
        onReset={resetTimer}
      />
    </div>
  );
}
