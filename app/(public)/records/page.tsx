import { getRecords, getTodayStats } from '@/app/actions/records';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { RecordList } from '@/components/records/RecordList';

/**
 * 総作業時間を時間と分の形式にフォーマット
 */
const formatTotalDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}時間${minutes}分`;
  }
  return `${minutes}分`;
};

export default async function RecordsPage() {
  // 認証チェック: 未ログインの場合はタイマー画面にリダイレクト
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  // 本日の日付範囲を計算
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  // 本日のサマリーを取得
  const statsResult = await getTodayStats();

  // 本日の記録を取得（一覧表示用）
  const result = await getRecords({
    from: todayStart,
    to: todayEnd,
  });

  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-red-500">{result.error || '記録の取得に失敗しました'}</p>
      </div>
    );
  }

  const records = result.records || [];

  // 本日のサマリー（Server Actionで集計済み）
  const todayTotalMinutes = statsResult.success && statsResult.stats ? statsResult.stats.totalMinutes : 0;
  const todayRecordCount = statsResult.success && statsResult.stats ? statsResult.stats.recordCount : 0;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">作業記録</h1>

        {/* 本日のサマリー */}
        <div className="bg-linear-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-8 border border-blue-800/50">
          <h2 className="text-lg font-medium text-gray-300 mb-2">本日のサマリー</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">
              {formatTotalDuration(todayTotalMinutes)}
            </span>
            <span className="text-gray-400">
              （{todayRecordCount}回のポモドーロ）
            </span>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-300">本日の記録</h2>

        <RecordList records={records} />

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            タイマーに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
