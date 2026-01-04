import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { TimerType } from '@/types/timerType';

export function useTimer(
  timerType: TimerType,
  initialTime: number,
  autoStart: boolean
) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  // autoStartがtrueの場合は自動でカウントダウンがスタートする
  const [isRunning, setIsRunning] = useState(autoStart);
  // setIntervalのIDを保存するためのRef
  // useRefを使う理由：再レンダリングを引き起こさず、コンポーネントのライフサイクル全体で同じ値を保持できるため
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  // セッション数を管理する
  const { sessionCount,} = useSession();
  // タイマーをスタート/停止する関数
  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    // URLからクエリパラメーターを削除（ブラウザの戻るボタンで戻った場合の再実行を防ぐ）
    switch(timerType) {
      case 'focus':
        router.replace('/timer/focus');
        break;
      case 'break':
        router.replace('/timer/break');
        break;
      case 'long-break':
        router.replace('/timer/long-break');
        break;
      default:
        router.replace('/timer/focus');
        break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          return prev - 1;
        });
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);

      // タイマー完了時、completionページに遷移
      setTimeout(() => {
        router.push(`/timer/completion?timerType=${timerType}`);
      }, 1000);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft, timerType]);

  return {
    sessionCount,
    timeLeft,
    isRunning,
    toggleTimer,
    resetTimer,
  };
}
