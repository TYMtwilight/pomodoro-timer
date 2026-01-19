'use client';
import { TimerType } from '@/types/timerType';
import { Orbitron } from 'next/font/google';
import { TaskSelector } from '@/components/tasks';

const orbitron = Orbitron({ subsets: ['latin'], weight: '400' });

const RADIUS = 160;
const CIRCUMFERENCE = 2 * RADIUS * Math.PI;
const SVG_WIDTH = 480;
const SVG_HEIGHT = 480;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;
const BLUE_100 = '#d9e6ff';
const BLUE_300 = '#9db7f9';
const BLUE_500 = '#4979f5';
const STROKE_BACKGROUND = '#1f2937';
const STROKE_FOREGROUND = BLUE_100;
const STROKE_WIDTH = 8;

interface TimerDisplayProps {
  timerType: TimerType;
  timeLeft: number;
  initialTime: number;
  isRunning: boolean;
  sessionCount?: number;
  maxSessions?: number;
}

// 画面に表示する時間をフォーマットする
const formatTime = (time: number): { minutes: string; seconds: string } => {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  return {
    minutes: String(mins).padStart(2, '0'),
    seconds: String(secs).padStart(2, '0'),
  };
};

export function TimerDisplay({ timerType, timeLeft, initialTime, isRunning, sessionCount, maxSessions }: TimerDisplayProps) {

    // タイマーの進捗率を計算
  const progress = timeLeft / initialTime;

  // オフセットの長さだけプログレスバーが表示される → 進捗率が100%になればオフセットの長さが円周と同じになる
  const strokeDashoffset = CIRCUMFERENCE * progress;

  const { minutes, seconds } = formatTime(timeLeft);


  return (
    <div className="flex flex-col flex-7 items-center justify-center max-w-3xl w-full relative">
      {timerType === 'focus' ? (
        <TaskSelector disabled={isRunning} />
      ) : (
        <div className="flex flex-col items-center justify-center absolute top-4 w-[80%] sm:w-[30%] py-2 bg-gray-900 rounded-3xl z-10">
          <div className="h-4"></div>
          <span className="text-xl font-medium text-white">
            {timerType === 'break' ? '休憩' : '長い休憩'}
          </span>
          <div className="h-4"></div>
        </div>
      )
      }
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={orbitron.className}>
          <span
            className="text-6xl text-white tabular-nums"
            style={{
              textShadow: `0 0 10px ${BLUE_300}, 0 0 10px ${BLUE_500}`,
            }}
          >
            {minutes}
          </span>
          <span className="text-4xl text-white tabular-nums mx-2">:</span>
          <span
            className="text-6xl text-white tabular-nums"
            style={{
              textShadow: `0 0 5px ${BLUE_300}, 0 0 10px ${BLUE_500}`,
            }}
          >
            {seconds}
          </span>
        </div>
      </div>
      <svg width="480" height="480" className="transform -rotate-90">
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS}
          stroke={STROKE_BACKGROUND}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS}
          stroke={STROKE_FOREGROUND}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-200 ease-linear display-visible"
          style={{
            filter: `drop-shadow(0 0 10px ${BLUE_500})`,
          }}
        />
      </svg>
    </div>
  );
}

