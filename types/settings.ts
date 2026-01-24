import { z } from 'zod';

/**
 * 設定データのバリデーションスキーマ
 * - 作業時間: 1-90分
 * - 短い休憩: 1-30分
 * - 長い休憩: 1-60分
 * - 長い休憩までのポモドーロ数: 2-8回
 * - 音声通知: ON/OFF
 */
export const settingsSchema = z.object({
  focusTime: z
    .number()
    .int()
    .min(5, 'う～ん、5分未満はちょっと短すぎませんか？')
    .max(90, 'あっ！90分超えるのはやりすぎですよ！'),
  breakTime: z
    .number()
    .int()
    .min(5, 'う～ん、5分未満はちょっと短すぎませんか？')
    .max(90, 'あっ！90分超えるのはやりすぎですよ！'),
  longBreakTime: z
    .number()
    .int()
    .min(1, 'う～ん、1分未満はちょっと短すぎませんか？')
    .max(90, 'あっ！90分超えるのはやりすぎですよ！'),
  pomodorosUntilLongBreak: z
    .number()
    .int()
    .min(2, '集中する回数は2回以上でお願いします！')
    .max(10, '集中する回数は10回以下でお願いします！'),
  soundEnabled: z.boolean(),
});

/**
 * 設定データの型定義
 * settingsSchemaから自動的に型を生成
 */
export type Settings = z.infer<typeof settingsSchema>;

/**
 * デフォルトの設定値
 * 要件定義書に基づく標準的なポモドーロテクニックの設定
 */
export const DEFAULT_SETTINGS: Settings = {
  focusTime: 25, // 作業時間：25分
  breakTime: 5, // 短い休憩：5分
  longBreakTime: 15, // 長い休憩：15分
  pomodorosUntilLongBreak: 4, // 長い休憩までのポモドーロ数：4回
  soundEnabled: true, // 音声通知：ON
};
