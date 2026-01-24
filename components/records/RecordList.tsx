'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteRecord } from '@/app/actions/records';
import type { FormattedRecord } from '@/types/record';
import { Trash2 } from 'lucide-react';

interface RecordListProps {
  records: FormattedRecord[];
}

export function RecordList({ records }: RecordListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (recordId: string) => {
    setDeletingId(recordId);
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  const handleConfirmDelete = async (recordId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteRecord(recordId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || '削除に失敗しました');
      }
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除中にエラーが発生しました');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  // 作業記録が0件の場合、まだ作業記録が登録されていない旨を表示する
  if (records.length === 0) {
    return <p className="text-gray-400">まだ作業記録がありません</p>;
  }

  // 作業記録が1件以上の場合、作業記録を表示する
  return (
    <div className="space-y-4">
      {records.map((record) => {

        const isConfirming = deletingId === record.id;
        return (
          <div
            key={record.id}
            className="bg-gray-900 rounded-lg px-8 py-2 border border-gray-800"
          >
            
              <div className="flex gap-4">
                <p className="text-sm text-gray-400">
                  {record.date}
                </p>
                <p className="text-lg font-semibold mt-1">
                  {record.startTime} - {record.endTime}
                </p>
              </div>
              <div className="flex items-center h-10 gap-4">
                <p className="text-2xl font-bold h-8">{record.duration}分</p>
                {isConfirming ? (
                  // 削除確認中の場合、削除ボタンとキャンセルボタンを表示する
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleConfirmDelete(record.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 text-sm  bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
                    >
                      {isDeleting ? '削除中...' : '削除'}
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      disabled={isDeleting}
                      className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
                    >
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(record.id)}
                    className="p-2 hover:bg-gray-800 rounded transition-colors"
                    aria-label="記録を削除"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                )}
              </div>

          </div>
        );
      })}
    </div>
  );
}
