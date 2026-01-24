import { TimerType } from '@/types/timerType';

interface TimerLabelProps {
  timerType: TimerType;
  isRunning: boolean;
}

const TIMER_LABELS = {
  focus: 'FOCUS',
  break: 'BREAK',
  'long-break': 'LONG BREAK',
} as const;

export function TimerLabel({ timerType, isRunning }: TimerLabelProps) {

  const timerLabel = TIMER_LABELS[timerType];

  return (
    <div
      className={`
        absolute z-10 top-1/5 text-4xl tracking-wider font-bold
        transition-all duration-200 ease-out
        ${isRunning ? 'text-white' : 'text-gray-600'}

      `}
      style={isRunning ? { textShadow: '0 0 16px #3b82f6, 0 0 32px #3b82f6' } : undefined}
    >
      {timerLabel}
    </div>
  )
}