'use client';

import { useCallback, useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * 通知音を再生するためのカスタムフック
 * 設定で音声通知がONの場合のみ再生される
 */
export function useNotificationSound() {
  const { settings } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * 通知音を再生する（再生完了まで待機可能）
   * 設定でsoundEnabledがfalseの場合は即座に解決するPromiseを返す
   * @returns 再生完了時に解決するPromise
   */
  const playNotificationSound = useCallback((): Promise<void> => {
    // 音声通知がOFFの場合は即座に解決
    if (!settings.soundEnabled) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      try {
        // 既存のオーディオインスタンスがあれば停止してリセット
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        // 新しいオーディオインスタンスを作成
        const audio = new Audio('/sounds/notification.mp3');
        audioRef.current = audio;

        // 再生完了時にPromiseを解決
        audio.addEventListener('ended', () => {
          resolve();
        });

        // エラー発生時もPromiseを解決（ページ遷移をブロックしない）
        audio.addEventListener('error', () => {
          console.error('通知音の読み込みに失敗しました');
          resolve();
        });

        // 再生開始
        audio.play().catch((error) => {
          console.error('通知音の再生に失敗しました:', error);
          resolve(); // エラー時もPromiseを解決
        });
      } catch (error) {
        console.error('通知音の初期化に失敗しました:', error);
        resolve(); // エラー時もPromiseを解決
      }
    });
  }, [settings.soundEnabled]);

  return { playNotificationSound };
}
