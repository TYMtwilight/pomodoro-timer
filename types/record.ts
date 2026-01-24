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
 * 作業記録データの型（フォーマットされたデータ）
 */
export interface FormattedRecord {
  id: string;
  /** 日付（例: "2024/01/15"） */
  date: string;
  /** 開始時刻（例: "14:30"） */
  startTime: string;
  /** 終了時刻（例: "15:00"） */
  endTime: string;
  /** 作業時間（分） */
  duration: number;
}


/**
 * 本日の作業サマリー
 */
export interface TodayStats {
  totalMinutes: number;
  recordCount: number;
}