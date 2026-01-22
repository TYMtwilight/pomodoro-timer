'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { TimerType } from '@/types/timerType';
import { useSession } from '@/contexts/SessionContext';
import { getNextTimerType, getCompletionMessages } from '@/utils/timerFlow';

export default function CompletionPage() {
  const searchParams = useSearchParams();
  const timerType: TimerType = searchParams.get('timerType') as TimerType;
  const router = useRouter();
  const { sessionCount, incrementSession, resetSession } = useSession();

  // 現在のセッション数と完了したタイマータイプから次のタイマータイプを決定
  const nextTimerType = getNextTimerType(timerType, sessionCount);

  // 完了メッセージを取得
  const { completionTitle, nextTimerMessage, nextTimerTitle } = getCompletionMessages(timerType, sessionCount);

  let startLabel: string;
  switch(nextTimerType) {
    case 'focus':
      startLabel = '作業を開始する';
      break;
    case 'break':
      startLabel = '休憩を開始する';
      break;
    case 'long-break':
      startLabel = '長い休憩を開始する';
      break;
    default:
      startLabel = '開始する';
      break;
  }

  const handleStartNextTimer = () => {
    // work完了時はセッションをインクリメント
    if (timerType === 'focus') {
      incrementSession();
    }
    // long-break完了時はセッションをリセット
    else if (timerType === 'long-break') {
      resetSession();
    }

    // 次のタイマーページのURLを決定
    let nextUrl: string;
    switch (nextTimerType) {
      case 'focus':
        nextUrl = '/?autoStart=true';
        break;
      case 'break':
        nextUrl = '/break?autoStart=true';
        break;
      case 'long-break':
        nextUrl = '/long-break?autoStart=true';
        break;
      default:
        nextUrl = '/?autoStart=true';
        break;
    }
    router.push(nextUrl);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <div className="flex flex-col flex-auto items-center max-w-3xl w-full h-480px relative">
        <div className="absolute top-4 text-3xl">
          <span>{completionTitle}</span>
        </div>
        <div className="absolute top-15">
          <span className="text-center text-sm md:text-base">
            {nextTimerMessage}
          </span>
        </div>
        <div className="absolute bottom-8">
          <span className="tracking-wider">
            next&gt;&gt; <span className="font-mono">{nextTimerTitle}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-end items-center w-full max-w-3xl gap-2">
        <label htmlFor="startBreak" className="text-sm">{startLabel}</label>
        <Button
          id="startBreak"
          onClick={handleStartNextTimer}
          size="lg"
          className="w-24 h-24 mb-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Play className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}
