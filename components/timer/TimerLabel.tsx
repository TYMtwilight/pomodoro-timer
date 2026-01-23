import { TimerType } from '@/types/timerType';

interface TimerLabelProps {
  timerType: TimerType;
  isRunning: boolean;
}

export function TimerLabel({ timerType, isRunning }: TimerLabelProps) {
  return (
    <div className="absolute z-10 top-1/5 text-4xl tracking-wider font-bold">
      {isRunning ? timerType.toUpperCase(): 'PAUSE'}
    </div>
  )
}