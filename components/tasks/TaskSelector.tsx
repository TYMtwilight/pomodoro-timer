'use client';

import { useTasks } from '@/contexts/TaskContext';
import { useSession } from 'next-auth/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface TaskSelectorProps {
  disabled?: boolean;
}

/**
 * タイマー画面で作業項目を上下ボタンで切り替えるコンポーネント
 */
export function TaskSelector({ disabled = false }: TaskSelectorProps) {
  const { data: session } = useSession();
  const { tasks, selectedTaskId, isLoading, selectTask } = useTasks();

  // 未ログイン時は「集中！」ラベルを表示
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center w-[80%] sm:w-[30%] py-2 bg-gray-900 rounded-3xl">
        <div className="h-5"></div>
        <span className="text-xl font-medium text-white">
          集中！
        </span>
        <div className="h-5"></div>
      </div>
    );
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

  // 「項目なし」を含む選択肢リストを作成
  const options = [
    ...tasks.map(t => ({ id: t.id, name: t.name })),
    { id: null, name: '項目なし' },
  ];

  // 現在の選択インデックスを取得
  const currentIndex = options.findIndex(opt => opt.id === selectedTaskId);
  const currentTask = options[currentIndex] || options[0];

  // 前のタスクに切り替え
  const handlePrev = () => {
    if (disabled) return;
    const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
    selectTask(options[prevIndex].id);
  };

  // 次のタスクに切り替え
  const handleNext = () => {
    if (disabled) return;
    const nextIndex = currentIndex >= options.length - 1 ? 0 : currentIndex + 1;
    selectTask(options[nextIndex].id);
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 w-[80%] sm:w-[30%] rounded-3xl">
      {/* 上ボタン */}
      <button
        onClick={handlePrev}
        disabled={disabled}
        className={`p-1 transition-colors ${disabled
          ? 'text-neutral-600 cursor-not-allowed'
          : 'text-neutral-400 hover:text-white'
          }`}
        aria-label="前の作業項目"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* タスク名 */}
      <span className={`text-xl font-medium mb-1 ${disabled ? 'text-blue-300' : 'text-white'}`}>
        {currentTask.name}
      </span>

      {/* 横線 */}
      <div className="w-full h-px bg-white opacity-80" />

      {/* 下ボタン */}
      <button
        onClick={handleNext}
        disabled={disabled}
        className={`p-1 transition-colors ${disabled
          ? 'text-neutral-600 cursor-not-allowed'
          : 'text-neutral-400 hover:text-white'
          }`}
        aria-label="次の作業項目"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}
