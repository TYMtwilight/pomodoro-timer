'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type {
  CreateRecordInput,
  GetRecordsOptions,
  Record,
  DailyStats,
  MonthlyStats,
  WeeklyStats,
  MonthlyStatsDetail,
  YearlyStats
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
 * 週単位の統計を取得
 */
export async function getWeeklyStats(
  weekStart: Date,
  weekEnd: Date
): Promise<{
  success: boolean;
  error?: string;
  stats?: WeeklyStats;
}> {
  const session = await auth();

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
        startTime: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      select: {
        startTime: true,
        duration: true,
      },
    });

    // 日別に集計
    const dailyMap = new Map<string, { totalMinutes: number; count: number }>();

    records.forEach((record) => {
      const date = record.startTime.toISOString().split('T')[0]; // YYYY-MM-DD
      const existing = dailyMap.get(date) || { totalMinutes: 0, count: 0 };
      dailyMap.set(date, {
        totalMinutes: existing.totalMinutes + record.duration,
        count: existing.count + 1,
      });
    });

    const dailyStats: DailyStats[] = Array.from(dailyMap.entries()).map(
      ([date, data]) => ({
        date,
        totalMinutes: data.totalMinutes,
        recordCount: data.count,
      })
    );

    dailyStats.sort((a, b) => a.date.localeCompare(b.date));

    const totalMinutes = records.reduce((sum, r) => sum + r.duration, 0);

    return {
      success: true,
      stats: {
        weekStart,
        weekEnd,
        totalMinutes,
        dailyStats,
      },
    };
  } catch (error) {
    console.error('週単位統計の取得に失敗しました：', error);
    return {
      success: false,
      error: '週単位統計の取得に失敗しました',
    };
  }
}