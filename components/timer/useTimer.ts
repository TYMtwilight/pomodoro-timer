import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { useSettings } from '@/contexts/SettingsContext';
import { TimerType } from '@/types/timerType';
import { createRecord } from '@/app/actions/records';
import { useNotificationSound } from '@/components/timer/useNotificationSound';

const SECONDS = 60;

export const useTimer = (
  timerType: TimerType,
  autoStart: boolean = false,
  onComplete?: () => void
) => {
  const { settings } = useSettings();

  // timerTypeに応じて初期時間を計算
  const initialTime = useMemo(() => {
    switch (timerType) {
      case 'focus':
        return SECONDS * settings.focusTime;
      case 'break':
        return SECONDS * settings.breakTime;
      case 'long-break':
        return SECONDS * settings.longBreakTime;
      default:
        return SECONDS * settings.focusTime;
    }
  }, [timerType, settings.focusTime, settings.breakTime, settings.longBreakTime]);

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
  const { sessionCount, maxSessions } = useSession();
  const { playNotificationSound } = useNotificationSound();

  // タイマーをスタート/停止する関数
  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => {
      const newState = !prev;

      // タイマー開始時の処理
      if (newState) {
        // まだ開始時刻が記録されていない場合のみ現在時刻を記録
        if (!startTimeRef.current) {
          startTimeRef.current = new Date();
        }

        // 一度でも開始したらhasStartedをtrueに
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

  // initialTimeが変更された場合（設定変更時など）、タイマーが停止中で未開始の場合はtimeLeftを更新
  useEffect(() => {
    if (!isRunning && !hasStarted) {
      setTimeLeft(initialTime);
    }
  }, [initialTime, isRunning, hasStarted]);

  /**
   * autoStart=true の場合、初回マウント時に開始時刻を記録
   */
  useEffect(() => {
    if (autoStart && !startTimeRef.current) {
      startTimeRef.current = new Date();
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
            });
            console.log('作業記録を保存しました');
          } catch (error) {
            console.error('作業記録の保存に失敗：', error);
          } finally {
            // 開始時刻をクリア
            startTimeRef.current = null;
          }
        }
      };

      // 非同期処理を実行してから、完了コールバックを呼び出す
      handleTimerComplete()
        .then(() => {
          onComplete?.();
        })
        .catch((error) => {
          console.error('予期しないエラー', error);
          onComplete?.();
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
    initialTime,
    isRunning,
    hasStarted,
    startTimeRef,
    toggleTimer,
    resetTimer,
  };
};
