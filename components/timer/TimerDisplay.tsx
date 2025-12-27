'use client';

const RADIUS = 160;
const CIRCUMFERENCE = 2 * RADIUS * Math.PI;
const CENTER_X = 240;
const CENTER_Y = 240;
const BLUE_100 = '#d9e6ff';
const BLUE_300 = '#9db7f9';
const BLUE_500 = '#4979f5';
const STROKE_BACKGROUND = '#1f2937';
const STROKE_FOREGROUND = BLUE_100;
const STROKE_WIDTH = 8;

// 画面に表示する時間をフォーマットする
const formatTime = (time: number): { minutes: string; seconds: string } => {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  return {
    minutes: String(mins).padStart(2, '0'),
    seconds: String(secs).padStart(2, '0'),
  };
};

interface TimerDisplayProps {
  timeLeft: number;
  initialTime: number;
}

export function TimerDisplay({ timeLeft, initialTime }: TimerDisplayProps) {
  // タイマーの進捗率を計算
  const progress = timeLeft / initialTime;
  // オフセットの長さだけプログレスバーが表示される → 進捗率が100%になればオフセットの長さが円周と同じになる
  const strokeDashoffset = CIRCUMFERENCE * progress;

  const { minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="flex flex-col flex-7 items-center justify-center max-w-3xl w-full relative">
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
          className="transition-all duration-1000 ease-linear display-visible"
          style={{
            filter: `drop-shadow(0 0 10px ${BLUE_500})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
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
  );
}

