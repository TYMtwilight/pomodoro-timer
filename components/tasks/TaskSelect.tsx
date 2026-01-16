'use client';

import { useTasks } from '@/contexts/TaskContext';
import { useSession } from 'next-auth/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface TaskSelectProps {
  disabled?: boolean;
}

/**
 * タイマー画面で作業項目を選択するドロップダウン
 */
export function TaskSelect({ disabled = false }: TaskSelectProps) {
  const { data: session } = useSession();
  const { tasks, selectedTaskId, isLoading, selectTask } = useTasks();

  // 未ログイン時は表示しない
  if (!session) {
    return null;
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-neutral-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs">
      <Select
        value={selectedTaskId || 'none'}
        onValueChange={(value) => selectTask(value === 'none' ? null : value)}
        disabled={disabled}
      >
        <SelectTrigger className="bg-neutral-900 border-neutral-700 text-white">
          <SelectValue placeholder="作業項目を選択" />
        </SelectTrigger>
        <SelectContent className="bg-neutral-900 border-neutral-700">
          <SelectItem value="none" className="text-neutral-400">
            項目なし
          </SelectItem>
          {tasks.map((task) => (
            <SelectItem key={task.id} value={task.id} className="text-white">
              {task.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
