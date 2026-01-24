'use client';
import { useState,useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/contexts/SessionContext';
import { getTodayStats } from '@/app/actions/records';
import { getNextTimerType} from '@/utils/timerFlow';
import { CompletionLabel } from './CompletionLabel';
import { Button } from '@/components/ui/button';
import { Play, DoorOpen } from 'lucide-react';
import { TimerType } from '@/types/timerType';

const TIMER_LABELS = {
  focus: 'FOCUS',
  break: 'BREAK',
  'long-break': 'LONG BREAK',
}

const NEXT_TIMER_URLS = {
  focus: '/?autoStart=true',
  break: '/break?autoStart=true',
  'long-break': '/long-break?autoStart=true',
}

const BLUE_300 = '#9db7f9';
const BLUE_500 = '#4979f5';

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

export default function CompletionPage() {
  const searchParams = useSearchParams();
  const timerType: TimerType = searchParams.get('timerType') as TimerType;
  const [todayTotalMinutes, setTodayTotalMinutes] = useState(0);
  const [todayRecordCount, setTodayRecordCount] = useState(0);
  const { sessionCount, incrementSession, resetSession } = useSession();

  useEffect(() => {
    if (timerType === 'focus') {
      incrementSession();
    } else if (timerType === 'long-break') {
      resetSession();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerType]);

  useEffect(() => {
    const fetchTodayStats = async () => {
      const statsResult = await getTodayStats();
      if (statsResult.success && statsResult.stats) {
        setTodayTotalMinutes(statsResult.stats.totalMinutes);
        setTodayRecordCount(statsResult.stats.recordCount);
      }
    };
    fetchTodayStats();
  }, []);

  // 現在のセッション数と完了したタイマータイプから次のタイマータイプを決定
  const nextTimerType = getNextTimerType(timerType, sessionCount);
  const nextTimerLabel = TIMER_LABELS[nextTimerType];
  const nextTimerUrl = NEXT_TIMER_URLS[nextTimerType];

  return (
    
      <div className="flex flex-col items-center h-[calc(100vh-56px)]">
        {CompletionLabel(timerType)}
        {/* 本日のサマリー */}
        <div className="absolute top-1/3 bg-linear-to-r from-blue-950/40 to-purple-700/50 rounded-xl p-6 mb-8 border border-blue-800/50">
          <h2 className="text-lg font-medium text-gray-300 mb-2">本日のサマリー</h2>
          <div className="flex items-baseline gap-2">
            <span 
              className="text-4xl font-bold text-white"
              style={{
                textShadow: `0 0 2px ${BLUE_300}, 0 0 10px ${BLUE_500}`,
              }}  
            >
              {formatTotalDuration(todayTotalMinutes)}
            </span>
            <span className="text-white text-md ml-4">
              ポモドーロ回数：
              <span 
                className="text-2xl font-bold ml-2"
                style={{
                  textShadow: `0 0 5px ${BLUE_300}, 0 0 10px ${BLUE_500}`,
                }}
              >
                {todayRecordCount}
              </span>    
            </span>
          </div>
        </div>
        <div className="absolute top-3/4 text-md font-bold">
          次のタイマー：
          <span className="text-2xl ml-2 font-bold tracking-wider text-blue-300">
            {nextTimerLabel}
          </span>
        </div>
        <div className="flex gap-4 w-full max-w-md absolute z-10 bottom-0 py-8 px-8">
          {/* 左: Exitボタン */}
          <div className="basis-[40%]">
            <div className="min-w-max">
              <Link href="/">
                <Button
                  variant="outline"
                  className="h-14 w-full rounded-lg border border-white bg-black hover:bg-white text-white font-semibold text-md transition-all duration-200 active:scale-95"
                  aria-label="作業を終了する"
                >
                  <DoorOpen className="w-6 h-6 mr-2" />
                  終了する
                </Button>
              </Link>
            </div>
          </div>
          {/* 右: STARTボタン */}
          <div className="flex-1 transition-all duration-500 ease-out">
            <Button 
              size="lg"
              className="h-14 w-full rounded-lg bg-blue-700 hover:bg-blue-500 text-white font-semibold text-md transition-all duration-200 active:scale-95"
              aria-label="次のタイマーを開始する"
            >
              <Play className="w-6 h-6 mr-2" />
              <Link href={nextTimerUrl}>START</Link>
            </Button>
          </div>
        </div>
      </div>
  );
}
