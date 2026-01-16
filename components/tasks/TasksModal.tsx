'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { createTask, updateTask, deleteTask } from '@/app/actions/tasks';
import { createTaskSchema, updateTaskSchema, type Task } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';

interface TasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 作業項目の登録・編集・削除モーダル
 */
export function TasksModal({ open, onOpenChange }: TasksModalProps) {
  const { tasks, isLoading, refreshTasks } = useTasks();

  // 新規登録フォームの状態
  const [newTaskName, setNewTaskName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // 編集中のタスク
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // 削除確認中のタスク
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * モーダルが開かれたときに状態をリセット
   */
  useEffect(() => {
    if (open) {
      setNewTaskName('');
      setCreateError(null);
      setEditingTaskId(null);
      setEditingTaskName('');
      setUpdateError(null);
      setDeletingTaskId(null);
    }
  }, [open]);

  /**
   * 新規作業項目を登録
   */
  const handleCreate = async () => {
    // zodによるバリデーション
    const validationResult = createTaskSchema.safeParse({ name: newTaskName });
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      setCreateError(firstIssue?.message || '入力値が無効です');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const result = await createTask({ name: validationResult.data.name });
      if (result.success) {
        setNewTaskName('');
        await refreshTasks();
      } else {
        setCreateError(result.error || '登録に失敗しました');
      }
    } catch (err) {
      console.error('作業項目の登録に失敗しました:', err);
      setCreateError('予期しないエラーが発生しました');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * 編集を開始
   */
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskName(task.name);
    setUpdateError(null);
  };

  /**
   * 編集をキャンセル
   */
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTaskName('');
    setUpdateError(null);
  };

  /**
   * 作業項目を更新
   */
  const handleUpdate = async () => {
    // zodによるバリデーション
    const validationResult = updateTaskSchema.safeParse({
      id: editingTaskId,
      name: editingTaskName,
    });
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      setUpdateError(firstIssue?.message || '入力値が無効です');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const result = await updateTask({
        id: validationResult.data.id,
        name: validationResult.data.name,
      });
      if (result.success) {
        setEditingTaskId(null);
        setEditingTaskName('');
        await refreshTasks();
      } else {
        setUpdateError(result.error || '更新に失敗しました');
      }
    } catch (err) {
      console.error('作業項目の更新に失敗しました:', err);
      setUpdateError('予期しないエラーが発生しました');
    } finally {
      setIsUpdating(false);
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
   * 作業項目を削除
   */
  const handleDelete = async () => {
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
      console.error('作業項目の削除に失敗しました:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>作業項目管理</DialogTitle>
          <DialogDescription>
            作業項目を追加・編集・削除できます。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 新規登録フォーム */}
          <div className="space-y-2">
            <Label htmlFor="newTaskName">新しい作業項目</Label>
            <div className="flex gap-2">
              <Input
                id="newTaskName"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="項目名を入力"
                maxLength={100}
                disabled={isCreating}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isCreating) {
                    handleCreate();
                  }
                }}
              />
              <Button
                onClick={handleCreate}
                disabled={isCreating || !newTaskName.trim()}
                size="icon"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
            {createError && (
              <p className="text-sm text-destructive">{createError}</p>
            )}
          </div>

          {/* 作業項目一覧 */}
          <div className="space-y-2">
            <Label>登録済みの作業項目</Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-sm text-neutral-400 py-4 text-center">
                作業項目がありません
              </p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800"
                  >
                    {/* 削除確認中 */}
                    {deletingTaskId === task.id ? (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-destructive">
                          削除してもよろしいですか？
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              '削除'
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelDeleting}
                            disabled={isDeleting}
                          >
                            キャンセル
                          </Button>
                        </div>
                      </div>
                    ) : /* 編集中 */
                    editingTaskId === task.id ? (
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={editingTaskName}
                            onChange={(e) => setEditingTaskName(e.target.value)}
                            maxLength={100}
                            disabled={isUpdating}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !isUpdating) {
                                handleUpdate();
                              } else if (e.key === 'Escape') {
                                cancelEditing();
                              }
                            }}
                          />
                          <Button
                            variant="default"
                            size="icon"
                            onClick={handleUpdate}
                            disabled={isUpdating || !editingTaskName.trim()}
                          >
                            {isUpdating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={cancelEditing}
                            disabled={isUpdating}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {updateError && (
                          <p className="text-sm text-destructive">{updateError}</p>
                        )}
                      </div>
                    ) : (
                      /* 通常表示 */
                      <>
                        <span className="flex-1 text-sm">{task.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(task)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startDeleting(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
