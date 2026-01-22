'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type {
  CreateRecordInput,
  GetRecordsOptions,
  Record,
  TodayStats,
} from '@/types/record';

/**
 * 作業記録を作成する
 * タイマー完了時に呼び出される
 */
export async function createRecord(
  input: CreateRecordInput
): Promise<{
  success: boolean;
  error?: string;
  recordId?: string;
}> {
  const session = await auth();

  // 未ログインの場合はエラー
  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ログインが必要です',
    };
  }

  try {
    const record = await prisma.record.create({
      data: {
        userId: session.user.id,
        startTime: input.startTime,
        endTime: input.endTime,
        duration: input.duration,
      },
    });

    // キャッシュを無効化（記録一覧ページを再取得させる）
    revalidatePath('/records');

    return {
      success: true,
      recordId: record.id,
    }
  } catch (error) {
    console.error('作業記録の保存に失敗しました:', error);
    return {
      success: false,
      error: '作業記録の保存に失敗しました',
    };
  }
}

/**
 * ログイン中のユーザーの作業記録を取得する
 */
export async function getRecords(
  options?: GetRecordsOptions
): Promise<{
  success: boolean;
  error?: string;
  records?: Record[];
}> {
  const session = await auth();

  // 未ログインの場合はエラー
  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ログインが必要です',
    };
  }

  try {
    const records = await prisma.record.findMany({
      where: {
        userId: session.user.id,
        ...(options?.from || options?.to
          ? {
            startTime: {
              ...(options.from ? { gte: options.from } : {}),
              ...(options.to ? { lte: options.to } : {}),
            },
          }
        : {}),
      },
      orderBy: {
        startTime: 'desc',
      },
      take: options?.limit || undefined,
    });

    return {
      success: true,
      records,
    };
  } catch (error) {
    console.error('作業記録の取得に失敗しました：', error);
    return {
      success: false,
      error: '作業記録の取得に失敗しました',
    };
  }
}

/**
 * 本日の作業サマリーを取得する
 */
export async function getTodayStats(): Promise<{
  success: boolean;
  error?: string;
  stats?: TodayStats;
}> {
  const session = await auth();

  // 未ログインの場合はエラー
  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ログインが必要です',
    };
  }

  try {
    // 本日の開始・終了時刻を計算
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // 本日の記録を取得して集計
    const records = await prisma.record.findMany({
      where: {
        userId: session.user.id,
        startTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      select: {
        duration: true,
      },
    });

    const totalMinutes = records.reduce((sum, record) => sum + record.duration, 0);
    const recordCount = records.length;

    return {
      success: true,
      stats: {
        totalMinutes,
        recordCount,
      },
    };
  } catch (error) {
    console.error('本日のサマリー取得に失敗しました：', error);
    return {
      success: false,
      error: '本日のサマリー取得に失敗しました',
    };
  }
}

/**
 * 作業記録を削除する
 */
export async function deleteRecord(
  recordId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth();

  // 未ログインの場合はエラー
  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ログインが必要です',
    };
  }

  try {
    // 自分の記録のみ削除可能
    const record = await prisma.record.findUnique({
      where: { id: recordId },
      select: { userId: true },
    });

    if (!record) {
      return {
        success: false,
        error: '記録が見つかりません',
      };
    }

    if (record.userId !== session.user.id) {
      return {
        success: false,
        error: '削除権限がありません',
      };
    }

    await prisma.record.delete({
      where: { id: recordId },
    });

    // キャッシュを無効化
    revalidatePath('/records');

    return {
      success: true,
    };
  } catch (error) {
    console.error('作業記録の削除に失敗しました：', error);
    return {
      success: false,
      error: '作業記録の削除に失敗しました',
    };
  }
}