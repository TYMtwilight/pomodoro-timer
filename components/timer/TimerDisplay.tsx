'use client';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: '400' });

const IS_DESKTOP = window.innerWidth > 480;
const RADIUS = IS_DESKTOP ? 140 : 120;
const CIRCUMFERENCE = 2 * RADIUS * Math.PI;
const SVG_WIDTH = 360;
const SVG_HEIGHT = 360;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;
const BLUE_100 = '#d9e6ff';
const BLUE_300 = '#9db7f9';
const BLUE_500 = '#4979f5';
const STROKE_BACKGROUND = '#1f2937';
const STROKE_FOREGROUND = BLUE_100;
const STROKE_WIDTH = 8;

interface TimerDisplayProps {
  timeLeft: number;
  initialTime: number;
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

export function TimerDisplay({ timeLeft, initialTime }: TimerDisplayProps) {

    // タイマーの進捗率を計算
  const progress = timeLeft / initialTime;

  // オフセットの長さだけプログレスバーが表示される → 進捗率が100%になればオフセットの長さが円周と同じになる
  const strokeDashoffset = CIRCUMFERENCE * progress;

  const { minutes, seconds } = formatTime(timeLeft);


  return (
    <div className="absolute inset-0 flex justify-center items-center" >
      <div className={`absolute ${orbitron.className} z-10 flex items-center`}>
        <span
          className="text-5xl font-bold text-white tabular-nums inline-block text-right min-w-[2ch]"
          style={{
            textShadow: `0 0 10px ${BLUE_300}, 0 0 10px ${BLUE_500}`,
          }}
        >
          {minutes}
        </span>
        <span 
          className="text-5xl font-bold text-white tabular-nums mx-2 inline-block"
          style={{
            textShadow: `0 0 5px ${BLUE_300}, 0 0 10px ${BLUE_500}`,
          }}
        >
          :
        </span>
        <span
          className="text-5xl font-bold text-white tabular-nums inline-block text-left min-w-[2ch]"
          style={{
            textShadow: `0 0 5px ${BLUE_300}, 0 0 10px ${BLUE_500}`,
          }}
        >
          {seconds}
        </span>
      </div>
      <svg width={SVG_WIDTH} height={SVG_HEIGHT} className="transform -rotate-90">
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS}
          stroke={STROKE_BACKGROUND}
          strokeWidth={STROKE_WIDTH}
          fill="rgba(0, 0, 0, 0.3)"
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

