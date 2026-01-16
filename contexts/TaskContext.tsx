'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { getTasks } from '@/app/actions/tasks';
import type { Task } from '@/types/task';

/**
 * TaskContextの型定義
 */
interface TaskContextType {
  tasks: Task[];
  selectedTaskId: string | null;
  isLoading: boolean;
  error: string | null;
  selectTask: (taskId: string | null) => void;
  refreshTasks: () => Promise<void>;
}

/**
 * Contextの作成（初期値はundefined）
 */
const TaskContext = createContext<TaskContextType | undefined>(undefined);

/**
 * TaskProviderコンポーネント
 * アプリ全体に作業項目データを提供する
 */
export function TaskProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 作業項目一覧を取得する
   * 
   * 注意: Focusタイマー実行中はタスク編集ができないため、
   * 選択中の項目が削除されることはない前提としている
   */
  const refreshTasks = useCallback(async () => {
    if (!session) {
      setTasks([]);
      setSelectedTaskId(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getTasks();
      if (result.success && result.tasks) {
        setTasks(result.tasks);
      } else {
        setError(result.error || '作業項目の取得に失敗しました');
      }
    } catch (err) {
      console.error('作業項目の取得に失敗しました:', err);
      setError('作業項目の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  /**
   * ログイン状態が変わったら作業項目を読み込む
   */
  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (session) {
      refreshTasks();
    } else {
      setTasks([]);
      setSelectedTaskId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  /**
   * 作業項目を選択する
   */
  const selectTask = useCallback((taskId: string | null) => {
    setSelectedTaskId(taskId);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        selectedTaskId,
        isLoading,
        error,
        selectTask,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

/**
 * useTasksフック
 * どこからでも作業項目データにアクセスできる
 */
export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasksはTaskProvider内で使用してください。');
  }
  return context;
}
