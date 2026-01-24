import { TimerType } from '@/types/timerType';

const COMPLETION_LABELS = {
  focus: 'COMPLETED!',
  break: 'FINISHED!',
  'long-break': 'FINISHED!',
} as const;

export function CompletionLabel(timerType: TimerType) {

  const completionLabel = COMPLETION_LABELS[timerType];

  return (
    <div className="absolute z-10 top-1/5 text-4xl tracking-wider font-bold"
        style={{ textShadow: '0 0 16px #3b82f6, 0 0 32px #3b82f6' }}
    >
      {completionLabel}
    </div>
  )
}