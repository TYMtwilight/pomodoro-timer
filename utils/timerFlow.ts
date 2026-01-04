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

/**
 * タイマータイプから初期時間（秒）を取得
 */
export function getTimerDuration(timerType: TimerType): number {
  switch (timerType) {
    case 'focus':
      return 25 * 60; // 25分
    case 'break':
      return 5 * 60; // 5分
    case 'long-break':
      return 15 * 60; // 15分
    default:
      return 25 * 60;
  }
}

/**
 * タイマー完了時の表示メッセージを取得
 */
export function getCompletionMessages(timerType: TimerType, sessionCount: number): {
  completionTitle: string;
  nextTimerMessage: string;
  nextTimerTitle: string;
} {

  let completionTitle: string;
  let nextTimerMessage: string;
  let nextTimerTitle: string;

  switch (timerType) {
    case 'focus':
      completionTitle = 'work complete';
      if(sessionCount === 4) {
        nextTimerMessage = 'お疲れ様です。15分間の長い休憩を取りましょう。';
        nextTimerTitle = '15分間の長い休憩';
      } else {
        nextTimerMessage = 'お疲れ様です。5分間だけ頭を空っぽにしましょう。';
        nextTimerTitle = '5分間の休憩';
      }
      break;
    case 'break':
      completionTitle = 'break complete';
      nextTimerMessage = 'さあ、集中タイムの始まりです！25分間、全力で取り組みましょう。';
      nextTimerTitle = '25分間の作業';
      break;
    case 'long-break':
      completionTitle = 'long break complete';
      nextTimerMessage = '長い休憩が完了しました。また新たなサイクルを始めましょう。';
      nextTimerTitle = '4セッション目の作業';
      break;
    default:
      completionTitle = '作業完了';
      nextTimerMessage = 'さあ、集中タイムの始まりです！25分間、全力で取り組みましょう。';
      nextTimerTitle = '25分間の作業';
      break;
  }

  return {
    completionTitle,
    nextTimerMessage,
    nextTimerTitle,
  };
}
