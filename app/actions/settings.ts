'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  settingsSchema,
  DEFAULT_SETTINGS,
  type Settings,
} from '@/types/settings';
import { revalidatePath } from 'next/cache';

/**
 * ログイン中のユーザーの設定を取得する
 * - ユーザーがログインしていない場合はnullを返す
 * - データベースに設定がない場合はデフォルト値を返す
 */

export async function getSettings(): Promise<Settings | null> {
  const session = await auth();

  // 未ログインの場合はnullを返す
  if (!session?.user?.id) {
    return null;
  }

  // データベースからユーザーの設定を取得
  const userSettings = await prisma.setting.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  // 設定が存在しない場合はデフォルト値を返す
  if (!userSettings) {
    return DEFAULT_SETTINGS;
  }

  // データベースの設定を返す
  return {
    focusTime: userSettings.focusDuration,
    breakTime: userSettings.shortBreak,
    longBreakTime: userSettings.longBreak,
    pomodorosUntilLongBreak: userSettings.pomodorosUntilLongBreak,
    soundEnabled: userSettings.soundEnabled,
  };
}

/**
 * ログイン中のユーザーの設定を保存する
 * - ユーザーがログインしていない場合はエラーを返す
 * - バリデーションに失敗した場合はエラーを返す
 * - 設定が存在しない場合は新規作成、存在する場合は更新
 */
export async function saveSettings(settings: Settings): Promise<{
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

  // バリデーション
  const validationResult = settingsSchema.safeParse(settings);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0].message,
    };
  }

  try {
    // データが存在すれば更新、存在しなければ新規作成
    await prisma.setting.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        focusDuration: settings.focusTime,
        shortBreak: settings.breakTime,
        longBreak: settings.longBreakTime,
        pomodorosUntilLongBreak: settings.pomodorosUntilLongBreak,
        soundEnabled: settings.soundEnabled,
      },
      create: {
        userId: session.user.id,
        focusDuration: settings.focusTime,
        shortBreak: settings.breakTime,
        longBreak: settings.longBreakTime,
        pomodorosUntilLongBreak: settings.pomodorosUntilLongBreak,
        soundEnabled: settings.soundEnabled,
      },
    });

    // キャッシュを無効化して最新データを取得できるようにする
    revalidatePath('/');

    return {
      success: true,
    };
  } catch (error) {
    console.error('設定の保存に失敗しました:', error);
    return {
      success: false,
      error: '設定の保存に失敗しました',
    };
  }
}
