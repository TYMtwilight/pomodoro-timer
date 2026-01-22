/**
 * 作業記録作成時の入力データ型
 */
export interface CreateRecordInput {
  startTime: Date;
  endTime: Date;
  duration: number; // 作業時間（分）
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
  startTime: Date;
  endTime: Date;
  duration: number;
  createdAt: Date;
}

/**
 * 本日の作業サマリー
 */
export interface TodayStats {
  totalMinutes: number;
  recordCount: number;
}