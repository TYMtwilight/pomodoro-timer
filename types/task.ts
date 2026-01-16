import { z } from 'zod';

// 作業項目の型定義

export interface Task {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * 作業項目作成のバリデーションスキーマ
 */
export const createTaskSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '項目名を入力してください')
    .max(100, '項目名は100文字以内で入力してください'),
});

/**
 * 作業項目更新のバリデーションスキーマ
 */
export const updateTaskSchema = z.object({
  id: z.string().min(1, 'IDが必要です'),
  name: z
    .string()
    .trim()
    .min(1, '項目名を入力してください')
    .max(100, '項目名は100文字以内で入力してください'),
});

/**
 * 作業項目削除のバリデーションスキーマ
 */
export const deleteTaskSchema = z.object({
  id: z.string().min(1, 'IDが必要です'),
});

/**
 * 型定義（Zodスキーマから自動生成）
 */
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
