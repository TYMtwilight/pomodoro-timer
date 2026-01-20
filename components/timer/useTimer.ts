import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { TimerType } from '@/types/timerType';
import { createRecord } from '@/app/actions/records';
import { useNotificationSound } from '@/hooks/useNotificationSound';

export const useTimer = (
  timerType: TimerType,
  initialTime: number,
  autoStart: boolean = false,
  taskId: string | null = null
) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  // autoStartがtrueの場合は自動でカウントダウンがスタートする
  const [isRunning, setIsRunning] = useState(autoStart);
  // 一度でもタイマーが開始されたかどうか（SETTINGS/RESET切り替え用）
  const [hasStarted, setHasStarted] = useState(autoStart);

  // タイマー開始時刻を記録（作業記録用）
  const startTimeRef = useRef<Date | null>(null);

  // setIntervalのIDを保存するためのRef
  // useRefを使う理由：再レンダリングを引き起こさず、コンポーネントのライフサイクル全体で同じ値を保持できるため
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { sessionCount, maxSessions } = useSession();
  const { playNotificationSound } = useNotificationSound();

  // タイマーをスタート/停止する関数
  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => {
      const newState = !prev;

      // タイマー開始時に現在時刻を記録（初回のみ）
      // 一時停止→再開の場合は記録しない
      if (newState && !startTimeRef.current) {
        startTimeRef.current = new Date();
      }

      // 一度でも開始したらhasStartedをtrueに
      if (newState) {
        setHasStarted(true);
      }

      return newState;
    });
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    setHasStarted(false);

    // リセット時は開始時刻もクリア
    startTimeRef.current = null;
  }, [initialTime]);

  /**
   * autoStart=true の場合、初回マウント時に開始時刻を記録
   */
  useEffect(() => {
    if (autoStart && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // クエリパラメーターのクリーンアップ用のRef（一度だけ実行するため）
  const hasCleanedUrlRef = useRef(false);

  useEffect(() => {
    // 初回マウント時のみURLからクエリパラメーターを削除
    if (hasCleanedUrlRef.current) return;

    hasCleanedUrlRef.current = true;

    switch (timerType) {
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
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          return prev - 1;
        });
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // タイマー完了時の処理
      const handleTimerComplete = async () => {
        // 通知音を再生し、再生完了を待つ
        await playNotificationSound();

        // focusタイマーの場合のみ作業記録を保存
        if (timerType === 'focus' && startTimeRef.current) {
          const endTime = new Date();
          const durationMinutes = Math.floor(initialTime / 60);

          try {
            await createRecord({
              startTime: startTimeRef.current,
              endTime: endTime,
              duration: durationMinutes,
              taskId: taskId,
            });
            console.log('作業記録を保存しました（taskId:', taskId, ')');
          } catch (error) {
            console.error('作業記録の保存に失敗：', error);
          } finally {
            // 開始時刻をクリア
            startTimeRef.current = null;
          }
        }
      };

      // 非同期処理を実行してから遷移
      handleTimerComplete()
        .then(() => {
          router.push(`/timer/completion?timerType=${timerType}`);
        })
        .catch((error) => {
          console.error('予期しないエラー', error);
          router.push(`/timer/completion?timerType=${timerType}`);
        });
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
    maxSessions,
    timeLeft,
    isRunning,
    hasStarted,
    startTimeRef,
    toggleTimer,
    resetTimer,
  };
};
