'use client';
import { TimerType } from '@/types/timerType';

interface BreakTypeLabelProps {
  timerType: TimerType;
}

export function BreakTypeLabel({ timerType }: BreakTypeLabelProps) {
  return (
    <div className="flex flex-col items-center justify-center  w-[80%] sm:w-[30%] py-2 bg-gray-900 rounded-3xl ">
      <div className="h-5"></div>
      <span className="text-xl font-medium text-white">
        {timerType === 'break' ? '休憩' : '長い休憩'}
      </span>
      <div className="h-5"></div>
    </div>
  );
}
