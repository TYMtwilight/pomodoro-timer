'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { useTasks } from '@/contexts/TaskContext';
import { DEFAULT_SETTINGS, type Settings } from '@/types/settings';
import { createTask, updateTask, deleteTask } from '@/app/actions/tasks';
import { createTaskSchema, updateTaskSchema } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Trash2, Check, X, Loader2, ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { settings, updateSettings } = useSettings();
  const { tasks, isLoading: isTasksLoading, refreshTasks } = useTasks();

  // タイマー設定の保存中フィールド
  const [savingField, setSavingField] = useState<keyof Settings | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // タスクスロットの状態（5つの入力欄）
  const [slotInputs, setSlotInputs] = useState<string[]>(['', '', '', '', '']);
  const [savingSlotIndex, setSavingSlotIndex] = useState<number | null>(null);
  const [slotError, setSlotError] = useState<{ index: number; message: string } | null>(null);

  // タスク削除確認中の状態
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // タスクの最大数
  const MAX_TASKS = 5;

  /**
   * ページが読み込まれたときに最新の設定を反映
   */
  useEffect(() => {
    setSettingsError(null);
    // タスク関連の状態をリセット（既存タスクの値をセット）
    const initialInputs = Array.from({ length: MAX_TASKS }, (_, i) => tasks[i]?.name || '');
    setSlotInputs(initialInputs);
    setSavingSlotIndex(null);
    setSlotError(null);
    setDeletingTaskId(null);
  }, [settings, tasks]);

  /**
   * 戻るボタンのハンドラー
   */
  const handleBack = () => {
    router.back();
  };

  /**
   * 設定を自動保存する共通関数
   */
  const autoSaveSettings = async (field: keyof Settings, newSettings: Settings) => {
    setSavingField(field);
    setSettingsError(null);

    try {
      const result = await updateSettings(newSettings);
      if (!result.success) {
        setSettingsError(result.error || '保存に失敗しました');
      }
    } catch {
      setSettingsError('予期しないエラーが発生しました');
    } finally {
      setSavingField(null);
    }
  };

  /**
   * Selectフィールドの変更ハンドラー（自動保存）
   */
  const handleSelectChange = (field: keyof Settings, value: string) => {
    const numValue = parseInt(value, 10);
    const newSettings = { ...settings, [field]: numValue };
    autoSaveSettings(field, newSettings);
  };

  /**
   * Switch（通知音）の変更ハンドラー（自動保存）
   */
  const handleSwitchChange = (field: keyof Settings, checked: boolean) => {
    const newSettings = { ...settings, [field]: checked };
    autoSaveSettings(field, newSettings);
  };

  /**
   * デフォルト値に戻す（自動保存）
   */
  const handleReset = async () => {
    setSavingField('focusTime'); // ローディング表示用
    setSettingsError(null);

    try {
      const result = await updateSettings(DEFAULT_SETTINGS);
      if (!result.success) {
        setSettingsError(result.error || 'デフォルト値への復元に失敗しました');
      }
    } catch {
      setSettingsError('予期しないエラーが発生しました');
    } finally {
      setSavingField(null);
    }
  };

  // === タスク管理機能 ===

  /**
   * スロットの入力値を更新
   */
  const handleSlotInputChange = (index: number, value: string) => {
    const newInputs = [...slotInputs];
    newInputs[index] = value;
    setSlotInputs(newInputs);
    // エラーをクリア
    if (slotError?.index === index) {
      setSlotError(null);
    }
  };

  /**
   * スロットの保存処理（新規作成または更新）
   */
  const handleSaveSlot = async (slotIndex: number) => {
    const taskName = slotInputs[slotIndex].trim();
    const existingTask = tasks[slotIndex];

    // 既存タスクがあり、名前が変更されていない場合は何もしない
    if (existingTask && existingTask.name === taskName) {
      return;
    }

    // 既存タスクがある場合は更新
    if (existingTask) {
      const validationResult = updateTaskSchema.safeParse({
        id: existingTask.id,
        name: taskName,
      });
      if (!validationResult.success) {
        const firstIssue = validationResult.error.issues[0];
        setSlotError({ index: slotIndex, message: firstIssue?.message || '入力値が無効です' });
        return;
      }

      setSavingSlotIndex(slotIndex);
      setSlotError(null);

      try {
        const result = await updateTask({
          id: validationResult.data.id,
          name: validationResult.data.name,
        });
        if (result.success) {
          await refreshTasks();
        } else {
          setSlotError({ index: slotIndex, message: result.error || '更新に失敗しました' });
        }
      } catch (err) {
        console.error('タスクの更新に失敗しました:', err);
        setSlotError({ index: slotIndex, message: '予期しないエラーが発生しました' });
      } finally {
        setSavingSlotIndex(null);
      }
    } else {
      // 新規作成
      const validationResult = createTaskSchema.safeParse({ name: taskName });
      if (!validationResult.success) {
        const firstIssue = validationResult.error.issues[0];
        setSlotError({ index: slotIndex, message: firstIssue?.message || '入力値が無効です' });
        return;
      }

      setSavingSlotIndex(slotIndex);
      setSlotError(null);

      try {
        const result = await createTask({ name: validationResult.data.name });
        if (result.success) {
          await refreshTasks();
        } else {
          setSlotError({ index: slotIndex, message: result.error || '登録に失敗しました' });
        }
      } catch (err) {
        console.error('タスクの登録に失敗しました:', err);
        setSlotError({ index: slotIndex, message: '予期しないエラーが発生しました' });
      } finally {
        setSavingSlotIndex(null);
      }
    }
  };

  /**
   * スロットの入力をリセット
   */
  const handleResetSlot = (slotIndex: number) => {
    const existingTask = tasks[slotIndex];
    const newInputs = [...slotInputs];
    newInputs[slotIndex] = existingTask?.name || '';
    setSlotInputs(newInputs);
    // エラーをクリア
    if (slotError?.index === slotIndex) {
      setSlotError(null);
    }
  };

  /**
   * 削除確認を開始
   */
  const startDeleting = (taskId: string) => {
    setDeletingTaskId(taskId);
  };

  /**
   * 削除をキャンセル
   */
  const cancelDeleting = () => {
    setDeletingTaskId(null);
  };

  /**
   * タスクを削除
   */
  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;

    setIsDeleting(true);

    try {
      const result = await deleteTask({ id: deletingTaskId });
      if (result.success) {
        setDeletingTaskId(null);
        await refreshTasks();
      } else {
        console.error('削除に失敗しました:', result.error);
      }
    } catch (err) {
      console.error('タスクの削除に失敗しました:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // 作業時間の選択肢（5分刻み 5～90分）
  const focusTimeOptions: number[] = [];
  for (let i = 5; i <= 90; i += 5) {
    focusTimeOptions.push(i);
  }

  // 短い休憩の選択肢（5分刻み 5～30分）
  const breakTimeOptions: number[] = [];
  for (let i = 5; i <= 30; i += 5) {
    breakTimeOptions.push(i);
  }

  // 長い休憩の選択肢（5分刻み 5～60分）
  const longBreakTimeOptions: number[] = [];
  for (let i = 5; i <= 60; i += 5) {
    longBreakTimeOptions.push(i);
  }

  // ポモドーロ数の選択肢（2～8回）
  const pomodorosOptions: number[] = [];
  for (let i = 2; i <= 8; i++) {
    pomodorosOptions.push(i);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      {/* ヘッダー */}
      <header className="w-full bg-transparent">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="前のページに戻る"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-semibold">設定</h1>
          <div className="w-10" /> {/* レイアウト調整用 */}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="w-full max-w-[520px] px-5 py-4">
        <div className="grid gap-4 w-full">
          {/* ===== 作業項目セクション（ログイン時のみ） ===== */}
          {session && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-slate-300">
                    作業項目
                    <span className="text-xs text-red-400 ml-1">*最大5つ</span>
                  </Label>
                  <span className="text-xs text-slate-400">{tasks.length}/{MAX_TASKS}</span>
                </div>

                {/* ローディング中 */}
                {isTasksLoading ? (
                  <div className="flex items-center justify-center py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {/* 5つのスロットを表示（統一フォーム） */}
                    {Array.from({ length: MAX_TASKS }).map((_, slotIndex) => {
                      const task = tasks[slotIndex];
                      const slotNumber = slotIndex + 1;
                      const inputValue = slotInputs[slotIndex] || '';
                      const originalValue = task?.name || '';
                      const hasChanged = inputValue !== originalValue;
                      const isSaving = savingSlotIndex === slotIndex;

                      return (
                        <div
                          key={task?.id || `empty-${slotIndex}`}
                          className="flex items-center gap-2 px-2 py-1.5 rounded bg-slate-800"
                        >
                          {/* スロット番号 */}
                          <span className="text-xs text-slate-400 w-4">{slotNumber}.</span>

                          {/* 削除確認中 */}
                          {task && deletingTaskId === task.id ? (
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-xs text-red-400">削除しますか？</span>
                              <div className="flex gap-1">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={handleDeleteTask}
                                  disabled={isDeleting}
                                  className="h-6 px-2 text-xs"
                                >
                                  {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : '削除'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelDeleting}
                                  disabled={isDeleting}
                                  className="h-6 px-2 text-xs bg-transparent border-slate-500"
                                >
                                  取消
                                </Button>
                              </div>
                            </div>
                          ) : (
                            /* 統一入力フォーム */
                            <div className="flex-1">
                              <div className="flex gap-1">
                                <Input
                                  value={inputValue}
                                  onChange={(e) => handleSlotInputChange(slotIndex, e.target.value)}
                                  placeholder="項目名を入力..."
                                  maxLength={100}
                                  disabled={isSaving}
                                  className="h-7 text-sm bg-slate-700 border-none placeholder:text-slate-500"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && inputValue.trim() && hasChanged) {
                                      handleSaveSlot(slotIndex);
                                    } else if (e.key === 'Escape') {
                                      handleResetSlot(slotIndex);
                                    }
                                  }}
                                />
                                <Button
                                  size="icon"
                                  onClick={() => handleSaveSlot(slotIndex)}
                                  disabled={isSaving || !inputValue.trim() || !hasChanged}
                                  className="h-7 w-7 bg-green-600 hover:bg-green-500 disabled:opacity-30"
                                >
                                  {isSaving ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </Button>
                                {hasChanged && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleResetSlot(slotIndex)}
                                    disabled={isSaving}
                                    className="h-7 w-7 bg-transparent border-slate-500"
                                    title="変更を取り消す"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                                {task && !hasChanged && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => startDeleting(task.id)}
                                    className="h-7 w-7 hover:bg-red-500 text-red-400 hover:text-white"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                              {slotError?.index === slotIndex && (
                                <p className="text-xs text-red-400 mt-0.5">{slotError.message}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Separator className="bg-slate-700" />
            </>
          )}

          {/* ===== タイマー設定セクション ===== */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-300">タイマー設定</Label>

            {/* エラーメッセージ */}
            {settingsError && (
              <div className="rounded-md bg-red-900/50 p-2 text-xs text-red-300">
                {settingsError}
              </div>
            )}

            {/* 縦1列レイアウト */}
            <div className="flex flex-col gap-3">
              {/* 作業時間 */}
              <div className="flex items-center gap-2">
                <Label className="text-sm text-slate-400 w-20 shrink-0">作業時間</Label>
                <Select
                  value={settings.focusTime.toString()}
                  onValueChange={(value) => handleSelectChange('focusTime', value)}
                  disabled={savingField !== null}
                >
                  <SelectTrigger className="h-8 text-sm bg-slate-800 border-slate-600 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {focusTimeOptions.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}分
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {savingField === 'focusTime' && (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400 shrink-0" />
                )}
              </div>

              {/* 短い休憩 */}
              <div className="flex items-center gap-2">
                <Label className="text-sm text-slate-400 w-20 shrink-0">短い休憩</Label>
                <Select
                  value={settings.breakTime.toString()}
                  onValueChange={(value) => handleSelectChange('breakTime', value)}
                  disabled={savingField !== null}
                >
                  <SelectTrigger className="h-8 text-sm bg-slate-800 border-slate-600 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {breakTimeOptions.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}分
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {savingField === 'breakTime' && (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400 shrink-0" />
                )}
              </div>

              {/* 長い休憩 */}
              <div className="flex items-center gap-2">
                <Label className="text-sm text-slate-400 w-20 shrink-0">長い休憩</Label>
                <Select
                  value={settings.longBreakTime.toString()}
                  onValueChange={(value) => handleSelectChange('longBreakTime', value)}
                  disabled={savingField !== null}
                >
                  <SelectTrigger className="h-8 text-sm bg-slate-800 border-slate-600 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {longBreakTimeOptions.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}分
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {savingField === 'longBreakTime' && (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400 shrink-0" />
                )}
              </div>

              {/* ポモドーロ数 */}
              <div className="flex items-center gap-2">
                <Label className="text-sm text-slate-400 w-20 shrink-0">ポモドーロ数</Label>
                <Select
                  value={settings.pomodorosUntilLongBreak.toString()}
                  onValueChange={(value) => handleSelectChange('pomodorosUntilLongBreak', value)}
                  disabled={savingField !== null}
                >
                  <SelectTrigger className="h-8 text-sm bg-slate-800 border-slate-600 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {pomodorosOptions.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}回
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {savingField === 'pomodorosUntilLongBreak' && (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400 shrink-0" />
                )}
              </div>

              {/* 通知音 & デフォルトに戻す */}
              <div className="flex items-center gap-2 mt-4">
                <Label className="text-sm text-slate-400 w-20 shrink-0">通知音</Label>
                <Switch
                  id="soundEnabled"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSwitchChange('soundEnabled', checked)}
                  disabled={savingField !== null}
                  className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-600"
                />
                <span className="text-sm text-slate-400">
                  {settings.soundEnabled ? 'ON' : 'OFF'}
                </span>
                {savingField === 'soundEnabled' && (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                )}
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleReset}
                  disabled={savingField !== null}
                  className="h-10 bg-transparent border-slate-500 hover:bg-white"
                >
                  デフォルトに戻す
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
