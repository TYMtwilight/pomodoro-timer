'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
  type DeleteTaskInput,
  type Task,
} from '@/types/task';

/**
 * 作業項目を新規作成
 */
export async function createTask(input: CreateTaskInput): Promise<{
  success: boolean;
  error?: string;
  task?: Task;
}> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ログインが必要です',
    };
  }

  // バリデーション
  const validationResult = createTaskSchema.safeParse(input);
  if (!validationResult.success) {
    const firstIssue = validationResult.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message || '入力値が無効です',
    };
  }

  try {
    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        name: validationResult.data.name,
      },
    });

    revalidatePath('/timer/focus');
    revalidatePath('/timer/break');
    revalidatePath('/timer/long-break');

    return {
      success: true,
      task,
    };
  } catch (error) {
    console.error('作業項目の作成に失敗しました:', error);
    return {
      success: false,
      error: '作業項目の作成に失敗しました',
    };
  }
}

/**
 * ログイン中のユーザーの作業項目一覧を取得（論理削除されていないもののみ）
 */
export async function getTasks(): Promise<{
  success: boolean;
  error?: string;
  tasks?: Task[];
}> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ログインが必要です',
    };
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null, // 論理削除されていないもののみ
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      tasks,
    };
  } catch (error) {
    console.error('作業項目の取得に失敗しました:', error);
    return {
      success: false,
      error: '作業項目の取得に失敗しました',
    };
  }
}

/**
 * 作業項目を更新
 */
export async function updateTask(input: UpdateTaskInput): Promise<{
  success: boolean;
  error?: string;
  task?: Task;
}> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ログインが必要です',
    };
  }

  // バリデーション
  const validationResult = updateTaskSchema.safeParse(input);
  if (!validationResult.success) {
    const firstIssue = validationResult.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message || '入力値が無効です',
    };
  }

  try {
    // 自分の作業項目かチェック
    const existingTask = await prisma.task.findUnique({
      where: {
        id: validationResult.data.id,
      },
    });

    if (!existingTask) {
      return {
        success: false,
        error: '作業項目が見つかりません',
      };
    }

    if (existingTask.userId !== session.user.id) {
      return {
        success: false,
        error: '権限がありません',
      };
    }

    const task = await prisma.task.update({
      where: {
        id: validationResult.data.id,
      },
      data: {
        name: validationResult.data.name,
      },
    });

    revalidatePath('/timer/focus');
    revalidatePath('/timer/break');
    revalidatePath('/timer/long-break');

    return {
      success: true,
      task,
    };
  } catch (error) {
    console.error('作業項目の更新に失敗しました:', error);
    return {
      success: false,
      error: '作業項目の更新に失敗しました',
    };
  }
}

/**
 * 作業項目を論理削除
 */
export async function deleteTask(input: DeleteTaskInput): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ログインが必要です',
    };
  }

  // バリデーション
  const validationResult = deleteTaskSchema.safeParse(input);
  if (!validationResult.success) {
    const firstIssue = validationResult.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message || '入力値が無効です',
    };
  }

  try {
    // 自分の作業項目かチェック
    const existingTask = await prisma.task.findUnique({
      where: {
        id: validationResult.data.id,
      },
    });

    if (!existingTask) {
      return {
        success: false,
        error: '作業項目が見つかりません',
      };
    }

    if (existingTask.userId !== session.user.id) {
      return {
        success: false,
        error: '権限がありません',
      };
    }

    // 論理削除（deletedAtに現在時刻を設定）
    await prisma.task.update({
      where: {
        id: validationResult.data.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath('/timer/focus');
    revalidatePath('/timer/break');
    revalidatePath('/timer/long-break');

    return {
      success: true,
    };
  } catch (error) {
    console.error('作業項目の削除に失敗しました:', error);
    return {
      success: false,
      error: '作業項目の削除に失敗しました',
    };
  }
}
