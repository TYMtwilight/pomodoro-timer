import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useTimer(
  isWork: boolean,
  initialTime: number,
  autoStart: boolean
) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  // setIntervalのIDを保存するためのRef
  // useRefを使う理由：再レンダリングを引き起こさず、コンポーネントのライフサイクル全体で同じ値を保持できるため
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  }, [initialTime]);

  if (autoStart && !isRunning && timeLeft === initialTime) {
    toggleTimer();
  }

  useEffect(() => {
    // URLからクエリパラメーターを削除（ブラウザの戻るボタンで戻った場合の再実行を防ぐ）
    if (isWork) {
      router.replace('/timer/work');
    } else {
      router.replace('/timer/break');
    }
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          return prev - 1;
        });
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setTimeout(() => {
        setIsRunning(false);
        if (isWork) {
          router.push('/timer/completion?isWork=true');
        } else {
          router.push('/timer/completion?isWork=false');
        }
      }, 1000);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else return;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeLeft, isWork, router, isRunning]);

  return {
    timeLeft,
    isRunning,
    toggleTimer,
    resetTimer,
  };
}
