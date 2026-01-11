/**
 * 作業記録作成時の入力データ型
 */
export interface CreateRecordInput {
  startTime: Date;
  endTime: Date;
  duration: number;       // 作業時間（分）
  taskId?: string | null; // タスクID（オプショナル）
}

/**
 * 作業記録取得時のオプション型
 */
export interface GetRecordsOptions {
  from?: Date;    // 開始日時
  to?: Date;      // 終了日時
  limit?: number; // 取得件数の上限
}

/**
 * 作業記録データの型（DBから取得したデータ）
 */
export interface Record {
  id: string;
  userId: string;
  taskId: string | null;
  startTime: Date;
  endTime: Date;
  duration: number;
  createdAt: Date;
}

/**
 * タスク情報を含む作業記録データの型
 */
export interface RecordWithTask extends Record {
  task: {
    id: string;
    name: string;
  } | null;
}

/**
 * 日別の作業統計
 */
export interface DailyStats {
  date: string;  // YYYY-MM-DD
  totalMinutes: number;
  recordCount: number;
}

/**
 * 月別の作業統計（年単位表示用）
 */
export interface MonthlyStats {
  month: string;  // YYYY-MM
  totalMinutes: number;
  recordCOunt: number;
}

/**
 * 週単位の統計データ
 */
export interface WeeklyStats {
  weekStart: Date;
  weekEnd: Date;
  totalMinutes: number;
  dailyStats: DailyStats[];
}

/**
 * 月単位の統計データ
 */
export interface MonthlyStatsDetail {
  monthStart: Date;
  monthEnd: Date;
  totalMinutes: number;
  dailyStats: DailyStats[];
}

/**
 * 年単位の統計データ
 */
export interface YearlyStats {
  yearStart: Date;
  yearEnd: Date;
  totalMinutes: number;
  monthlyStats: MonthlyStats[];
}

/**
 * 期間別統計の共通型
 */
export type PeriodStats = {
  period: 'week' | 'month' | 'year';
  totalMinutes: number;
  stats: DailyStats[] | MonthlyStats[];
};