'use client';

import { useState } from 'react';
import { createRecord, getRecords, getWeeklyStats } from '@/app/actions/records';

export default function TestRecordsPage() {
  const [message, setMessage] = useState<string>('');

  // テストデータを作成
  const handleCreateTestData = async () => {
    setMessage('テストデータを作成中...');

    const now = new Date();
    const startTime = new Date(now.getTime() - 25 * 60 * 1000); // 25分前

    const result = await createRecord({
      startTime: startTime,
      endTime: now,
      duration: 25,
      taskId: null,
    });

    if(result.success) {
      setMessage(`作業記録を作成しました！ ID: ${result.recordId}`);
    } else {
      setMessage(`エラー：${result.error}`);
    }
  };

  // 記録を取得
  const handleGetRecords = async () => {
    setMessage('記録を取得中...');

    const result = await getRecords({ limit: 10 });

    if (result.success && result.records) {
      setMessage(`${result.records.length}件の記録を取得しました`);
      console.log('取得した記録:', result.records);
    } else {
      setMessage(`エラー：${result.error}`);
    }
  };

  // 週単位の統計を取得
  const handleGetWeeklyStats = async () => {
    setMessage('週単位統計を取得中...');

    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    // 週の開始日（weekStart）をその日の0時0分0秒0ミリ秒にリセット
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    // 週の終了日（weekEnd）をその日の23時59分59秒999ミリ秒にリセット
    weekEnd.setHours(23, 59, 59, 999);

    const result = await getWeeklyStats(weekStart, weekEnd);

    if (result.success && result.stats) {
      setMessage(`今週の合計： ${result.stats.totalMinutes}分`);
      console.log('週単位統計：', result.stats);
    } else {
      setMessage(`エラー： ${result.error}`)
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">作業記録テスト</h1>

      <div className="space-y-4">
        <button
          onClick={handleCreateTestData}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded"  
        >
          テストデータを作成
        </button>
        
        <button
          onClick={handleGetRecords}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded ml-4"
          >
            記録を取得
        </button>

        <button
          onClick={handleGetWeeklyStats}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded ml-4"
          >
          週単位統計を取得
        </button>
      </div>

      {message && (
        <div className="mt-8 p-4 bg-gray-900 rounded">
          <p>{message}</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-900 rounded">
        <p className="text-sm text-gray-400">
          ブラウザの開発者ツール（console）も確認してください
        </p>
      </div>
    </div>
  );
}