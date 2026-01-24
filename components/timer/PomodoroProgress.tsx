'use client';

const BLUE_100 = '#d9e6ff';
const BLUE_300 = '#9db7f9';
const BLUE_500 = '#4979f5';
const STROKE_BACKGROUND = '#1f2937';
const STROKE_WIDTH = 5;

// 円グラフのサイズ設定
const RADIUS = 36;
const CIRCUMFERENCE = 2 * RADIUS * Math.PI;
const SVG_SIZE = 100;
const CENTER = SVG_SIZE / 2;

interface PomodoroProgressProps {
  sessionCount: number;
  maxSessions: number;
}

export function PomodoroProgress({ sessionCount, maxSessions }: PomodoroProgressProps) {
  // 完了したポモドーロ数（現在進行中のセッションは含まない）
  const completedPomodoros = sessionCount;

  // 進捗率を計算（0〜1の範囲）
  const progressRate = Math.min(completedPomodoros / maxSessions, 1);

  // 円グラフの進捗（円周から逆算）
  // 進捗率0% → オフセット = 円周（何も表示されない）
  // 進捗率100% → オフセット = 0（完全に表示される）
  const strokeDashoffset = CIRCUMFERENCE * (1 - progressRate);

  return (
  <div className="flex flex-col items-end gap-2 w-full max-w-md absolute bottom-1/5 right-1/2 translate-x-1/2">
    <div>
      {/* 円グラフと数字 */}
      <div className="relative flex items-center justify-center">
        {/* 中央の数字 */}
        <div className="absolute z-10 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold text-white tabular-nums"
            style={{
              textShadow: `0 0 10px ${BLUE_300}, 0 0 20px ${BLUE_500}`,
            }}
          >
            {completedPomodoros}
          </span>
          <span className="text-xs text-gray-400">
            / {maxSessions}
          </span>
        </div>

        {/* 円グラフ */}
        <svg width={SVG_SIZE} height={SVG_SIZE} className="transform -rotate-90">
          {/* 背景の円 */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke={STROKE_BACKGROUND}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* 進捗の円 */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke={BLUE_100}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${BLUE_500})`,
            }}
          />
        </svg>
      </div>
    </div>
    </div>
  );
}
