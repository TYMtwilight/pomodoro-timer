'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
import { TimerLabel } from '@/components/timer/TimerLabel';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { PomodoroProgress } from '@/components/timer/PomodoroProgress';
import { CompletionOverlay } from '@/components/timer/CompletionOverlay';
import { TimerType } from '@/types/timerType';
import { useSettings } from '@/contexts/SettingsContext';
import { useTimerState } from '@/contexts/TimerStateContext';
import { useSession } from '@/contexts/SessionContext';
import { useEffect, useCallback, useState } from 'react';

interface TimerPageProps {
  timerType: TimerType;
}

export function TimerPage({ timerType }: TimerPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const autoStart = searchParams.get('autoStart') === 'true';

  const { isLoading } = useSettings();
  const { clearTimerState } = useTimerState();
  const { resetSession } = useSession();

  // 完了画面の表示状態
  const [showCompletion, setShowCompletion] = useState(false);

  // タイマー完了時のコールバック（完了画面を表示）
  const handleTimerComplete = useCallback(() => {
    setShowCompletion(true);
  }, []);

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

  // 終了ボタンのハンドラー：コンテキストを初期化してホームに戻る
  const handleExit = useCallback(() => {
    clearTimerState();
    resetSession();
    router.push('/');
  }, [clearTimerState, resetSession, router]);

  // 次のタイマーを開始
  const handleStartNext = useCallback((nextTimerType: TimerType) => {
    // 完了画面を閉じて次のタイマーページに遷移
    // setShowCompletion(false);

    switch (nextTimerType) {
      case 'focus':
        router.push('/?autoStart=true');
        break;
      case 'break':
        router.push('/break?autoStart=true');
        break;
      case 'long-break':
        router.push('/long-break?autoStart=true');
        break;
    }
  }, [router]);

  // 設定読み込み中はローディング表示
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] bg-black text-white">
        <div className="text-2xl font-bold">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-[calc(100vh-56px)] bg-black text-white">
      <TimerLabel timerType={timerType} isRunning={isRunning} />
      <TimerDisplay timeLeft={timeLeft} initialTime={initialTime} sessionCount={sessionCount} maxSessions={maxSessions} />
      <PomodoroProgress sessionCount={sessionCount} maxSessions={maxSessions} />
      <TimerControls
        isRunning={isRunning}
        hasStarted={hasStarted}
        onToggle={toggleTimer}
        onReset={resetTimer}
      />
      {showCompletion && (
        <CompletionOverlay
          timerType={timerType}
          onExit={handleExit}
          onStartNext={handleStartNext}
        />
      )}
    </div>
  );
}
