'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
   */
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // モーダルを開く時：現在の設定をフォームに反映
      setFormData(settings);
      setError(null);
    }
    onOpenChange(isOpen);
  };

  /**
   * フォームフィールドの変更ハンドラー
   */
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setFormData({ ...formData, [name]: numValue });
    }
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
              <Input
                id="focusTime"
                name="focusTime"
                type="number"
                min="1"
                max="90"
                value={formData.focusTime}
                onChange={handleFieldChange}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">分</span>
            </div>
          </div>

          {/* 短い休憩 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="breakTime" className="text-right">
              短い休憩
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="breakTime"
                name="breakTime"
                type="number"
                min="1"
                max="30"
                value={formData.breakTime}
                onChange={handleFieldChange}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">分</span>
            </div>
          </div>

          {/* 長い休憩 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longBreakTime" className="text-right">
              長い休憩
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="longBreakTime"
                name="longBreakTime"
                type="number"
                min="1"
                max="60"
                value={formData.longBreakTime}
                onChange={handleFieldChange}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">分</span>
            </div>
          </div>

          {/* ポモドーロ数 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pomodorosUntilLongBreak" className="text-right">
              ポモドーロ数
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="pomodorosUntilLongBreak"
                name="pomodorosUntilLongBreak"
                type="number"
                min="2"
                max="8"
                value={formData.pomodorosUntilLongBreak}
                onChange={handleFieldChange}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">回</span>
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
