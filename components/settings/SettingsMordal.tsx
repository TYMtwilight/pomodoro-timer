'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContsxt';
import { DEFAULT_SETTINGS, type Settings } from '@/types/settings';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  
  // フォームの状態（ローカル）
  const [formData, setFormData] = useState<Settings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * モーダルが開かれたときに最新の設定を反映
   * useEffectを使用して、openがtrueになった時に最新のsettingsを反映
   */
  useEffect(() => {
    if (open) {
      // モーダルが開かれた時：最新の設定をフォームに反映
      setFormData(settings);
      setError(null);
    }
  }, [open, settings]);

  /**
   * モーダルの開閉状態を親コンポーネントに通知
   */
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  /**
   * Selectフィールドの変更ハンドラー
   */
  const handleSelectChange = (field: keyof Settings, value: string) => {
    const numValue = parseInt(value, 10);
    setFormData({ ...formData, [field]: numValue });
  };

  /**
   * デフォルト値に戻す
   */
  const handleReset = () => {
    setFormData(DEFAULT_SETTINGS);
  };

  /**
   * 保存処理
   */
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const result = await updateSettings(formData);
      if (result.success) {
        onOpenChange(false);
      } else {
        setError(result.error || '保存に失敗しました');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setIsSaving(false);
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>設定</DialogTitle>
          <DialogDescription>
            タイマーの時間設定を変更できます。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 作業時間 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="focusTime" className="text-right">
              作業時間
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select 
                value={formData.focusTime.toString()}
                onValueChange={(value) => handleSelectChange('focusTime', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {focusTimeOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}分
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 短い休憩 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="breakTime" className="text-right">
              短い休憩
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select
                value={formData.breakTime.toString()}
                onValueChange={(value) => handleSelectChange('breakTime', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {breakTimeOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}分
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 長い休憩 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longBreakTime" className="text-right">
              長い休憩
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select
                value={formData.longBreakTime.toString()}
                onValueChange={(value) => handleSelectChange('longBreakTime', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {longBreakTimeOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}分
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ポモドーロ数 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pomodorosUntilLongBreak" className="text-right">
              ポモドーロ数
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select
                value={formData.pomodorosUntilLongBreak.toString()}
                onValueChange={(value) => handleSelectChange('pomodorosUntilLongBreak', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {pomodorosOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}回
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
          >
            デフォルトに戻す
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              キャンセル
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? '保存中...' : '保存'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
