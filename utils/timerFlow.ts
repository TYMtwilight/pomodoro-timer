import { TimerType } from '@/types/timerType';

/**
 * 現在のタイマータイプとセッション数から次のタイマータイプを決定
 */
export function getNextTimerType(
  currentTimerType: TimerType,
  sessionCount: number
): TimerType {
  if (currentTimerType === 'focus') {
    // 4セッション目の作業完了後はlong-break
    return sessionCount >= 4 ? 'long-break' : 'break';
  }
  if (currentTimerType === 'break' || currentTimerType === 'long-break') {
    return 'focus';
  }
  return 'focus';
}


