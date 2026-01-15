import { getRecords } from '@/app/actions/records';
import type { RecordWithTask } from '@/types/record';
import Link from 'next/link';

const formatDate = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatTime = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default async function RecordsPage() {
  const result = await getRecords({ limit: 20 });

  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-red-500">{result.error || '記録の取得に失敗しました'}</p>
      </div>
    );
  }

  const records: RecordWithTask[] | undefined = result.records || [];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">作業記録</h1>

        {records.length === 0 ? (
          <p className="text-gray-400">まだ作業記録がありません</p>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">
                      {formatDate(record.startTime)}
                    </p>
                    <p className="text-lg font-semibold mt-1">
                      {formatTime(record.startTime)} - {formatTime(record.endTime)}
                    </p>
                    {record.task && (
                      <p className="text-sm text-blue-400 mt-2">
                        {record.task.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{record.duration}分</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/timer/focus"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            タイマーに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
