'use client';

import { useSearchParams } from 'next/navigation';
import { useTimer } from '@/components/timer/useTimer';
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
  const { settings } = useSettings();
  const INITIAL_TIME = SECONDS * settings.longBreakTime;

  const { timeLeft, isRunning, toggleTimer, resetTimer } = useTimer(timerType, INITIAL_TIME, autoStart);
  console.log(timerType);
  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <TimerDisplay timerType={timerType} timeLeft={timeLeft} initialTime={INITIAL_TIME} />
      <TimerControls timerType={timerType} isRunning={isRunning} onToggle={toggleTimer} onReset={resetTimer} />
    </div>
  );
}
