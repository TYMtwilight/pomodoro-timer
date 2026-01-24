'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';

const MIN_TIME = 5;
const MAX_TIME = 90;
const TIME_STEP = 5;

const MIN_POMODOROS = 1;
const MAX_POMODOROS = 10;

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, isLoading } = useSettings();

  // フォーム状態
  const [focusTime, setFocusTime] = useState(settings.focusTime);
  const [breakTime, setBreakTime] = useState(settings.breakTime);
  const [longBreakTime, setLongBreakTime] = useState(settings.longBreakTime);
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(settings.pomodorosUntilLongBreak);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [isSaving, setIsSaving] = useState(false);

  // 設定が読み込まれたら、フォーム状態を更新
  useEffect(() => {
    if (!isLoading) {
      setFocusTime(settings.focusTime);
      setBreakTime(settings.breakTime);
      setLongBreakTime(settings.longBreakTime);
      setPomodorosUntilLongBreak(settings.pomodorosUntilLongBreak);
      setSoundEnabled(settings.soundEnabled);
    }
  }, [isLoading, settings]);

  // 時間を増減する関数
  const adjustTime = (current: number, delta: number) => {
    const newValue = current + delta;
    return Math.max(MIN_TIME, Math.min(MAX_TIME, newValue));
  };

  // ポモドーロ回数を増減する関数
  const adjustPomodoros = (current: number, delta: number) => {
    const newValue = current + delta;
    return Math.max(MIN_POMODOROS, Math.min(MAX_POMODOROS, newValue));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // updateSettingsは自動的にログイン状態を判断して処理
      // ログイン時 → DBに保存
      // 未ログイン時 → コンテキストのみ更新
      const result = await updateSettings({
        focusTime,
        breakTime,
        longBreakTime,
        pomodorosUntilLongBreak,
        soundEnabled,
      });

      if (result.success) {
        // 設定成功したらホームに戻る
        router.push('/');
      } else {
        alert(result.error || '設定に失敗しました');
      }
    } catch (error) {
      console.error('設定エラー:', error);
      alert('設定中にエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)] gap-8 bg-black text-white">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] text-white pt-8 px-8">
      <div className="w-full max-w-md h-full relative">
        <h1 className="text-3xl font-bold">設定</h1>

        <div className="space-y-3">
          {/* フォーカス時間 */}
          <div className="flex items-center justify-between h-12 my-8">
            <label className="text-lg font-medium">
              Focus
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFocusTime(adjustTime(focusTime, -TIME_STEP))}
                disabled={focusTime <= MIN_TIME}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-6 h-6" />
              </button>
              <span className="text-2xl font-bold min-w-[70px] text-center">
                {focusTime}分
              </span>
              <button
                onClick={() => setFocusTime(adjustTime(focusTime, TIME_STEP))}
                disabled={focusTime >= MAX_TIME}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 短い休憩時間 */}
          <div className="flex items-center justify-between h-12 my-8">
            <label className="text-lg font-medium">
              Break
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setBreakTime(adjustTime(breakTime, -TIME_STEP))}
                disabled={breakTime <= MIN_TIME}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-6 h-6" />
              </button>
              <span className="text-2xl font-bold min-w-[70px] text-center">
                {breakTime}分
              </span>
              <button
                onClick={() => setBreakTime(adjustTime(breakTime, TIME_STEP))}
                disabled={breakTime >= MAX_TIME}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 長い休憩時間 */}
          <div className="flex items-center justify-between h-12 my-8">
            <label className="text-lg font-medium">
              Long Break
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLongBreakTime(adjustTime(longBreakTime, -TIME_STEP))}
                disabled={longBreakTime <= MIN_TIME}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-6 h-6" />
              </button>
              <span className="text-2xl font-bold min-w-[70px] text-center">
                {longBreakTime}分
              </span>
              <button
                onClick={() => setLongBreakTime(adjustTime(longBreakTime, TIME_STEP))}
                disabled={longBreakTime >= MAX_TIME}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 長い休憩までのポモドーロ回数 */}
          <div className="flex items-center justify-between h-12 my-8">
            <label className="text-lg font-medium">
              ポモドーロ数
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPomodorosUntilLongBreak(adjustPomodoros(pomodorosUntilLongBreak, -1))}
                disabled={pomodorosUntilLongBreak <= MIN_POMODOROS}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-6 h-6" />
              </button>
              <span className="text-2xl font-bold min-w-[70px] text-center">
                {pomodorosUntilLongBreak}回
              </span>
              <button
                onClick={() => setPomodorosUntilLongBreak(adjustPomodoros(pomodorosUntilLongBreak, 1))}
                disabled={pomodorosUntilLongBreak >= MAX_POMODOROS}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 通知音の有効/無効 */}
          <div className="flex items-center justify-between h-12 my-8">
            <label htmlFor="soundEnabled" className="text-lg font-medium">
              通知音
            </label>
            <Switch
              id="soundEnabled"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </div>
        <div className="flex gap-4 w-full max-w-md absolute z-10 bottom-0 p-8 left-0">
          {/* 左: キャンセルボタン */}
          <div className="basis-[40%]">
            <div className="min-w-max">
              <Link href="/">
                <Button
                  variant="outline"
                  className="h-14 w-full rounded-lg border border-white bg-black hover:bg-white text-white font-semibold text-md transition-all duration-200 active:scale-95"
                  aria-label="キャンセルする"
                >
                  キャンセルする
                </Button>
              </Link>
            </div>
          </div>

          {/* 右: 設定ボタン */}
          <div className="flex-1 transition-all duration-500 ease-out">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-14 w-full rounded-lg bg-blue-700 hover:bg-blue-500 text-white font-semibold text-md transition-all duration-200 active:scale-95"
            >
              {isSaving ? '設定中...' : '設定する'}
            </Button>
          </div>
        </div> 
      </div>
    </div>
  );
}
