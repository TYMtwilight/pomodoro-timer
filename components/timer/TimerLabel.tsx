'use client';
import { TimerType } from '@/types/timerType';
import { BreakTypeLabel } from './BreakTypeLabel';

interface TimerLabelProps {
  timerType: TimerType;
}

export function TimerLabel({ timerType }: TimerLabelProps) {
  if (timerType === 'focus') {
    return (
      <div className="flex flex-col items-center justify-center w-[80%] sm:w-[30%] py-2 bg-gray-900 rounded-3xl">
        <div className="h-5"></div>
        <span className="text-xl font-medium text-white">集中！</span>
        <div className="h-5"></div>
      </div>
    );
  }
  return <BreakTypeLabel timerType={timerType} />;
}