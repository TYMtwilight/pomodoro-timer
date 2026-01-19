'use client';
import { TimerType } from '@/types/timerType';
import { TaskSelector } from '@/components/tasks';
import { BreakTypeLabel } from './BreakTypeLabel';

interface TimerLabelProps {
  timerType: TimerType;
  isRunning: boolean;
}

export function TimerLabel({ timerType, isRunning }: TimerLabelProps) {
  if (timerType === 'focus') {
    return <TaskSelector disabled={isRunning} />;
  }
  return <BreakTypeLabel timerType={timerType} />;
}