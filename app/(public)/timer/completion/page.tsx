'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';

export default function CompletionPage() {
  const searchParams = useSearchParams();
  const isWork = searchParams.get('isWork') === 'true';
  const router = useRouter();
  const { sessionCount, incrementSession, isLastSession } = useSession();

  // 作業完了時: セッション数に応じて短い休憩か長い休憩へ
  const handleStartBreak = () => {
    if (isLastSession()) {
      incrementSession(); // 長い休憩前にリセット（1に戻る）
      router.push('/timer/long-break?autoStart=true');
    } else {
      incrementSession(); // 次のセッションへ
      router.push('/timer/break?autoStart=true');
    }
  };

  // 休憩完了時: 次の作業へ
  const handleStartWork = () => {
    router.push('/timer/work?autoStart=true');
  };

  // 次の休憩タイプを判定
  const nextBreakType = isLastSession() ? '15分間の長い休憩' : '5分間の休憩';
  const nextBreakMessage = isLastSession()
    ? 'お疲れ様です。15分間ゆっくり休憩しましょう。'
    : 'お疲れ様です。5分間だけ頭を空っぽにしましょう。';

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <div className="flex flex-col flex-auto items-center max-w-3xl w-full h-480px relative">
        <div className="absolute top-4 text-3xl">
          <span>{isWork ? 'work completed' : 'break complete'}</span>
        </div>
        <div className="absolute top-15">
          <span className="text-center text-sm md:text-base">
            {isWork ? nextBreakMessage : 'さあ、集中タイムの始まりです！25分間、全力で取り組みましょう。'}
          </span>
        </div>
        <div className="absolute bottom-8">
          <span className="tracking-wider">
            next&gt;&gt; <span className="font-mono">{isWork ? nextBreakType : '25分間の作業'}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-end items-center w-full max-w-3xl gap-2">
        <label htmlFor="startBreak">{isWork ? '休憩を開始する' : '作業を開始する'}</label>
        <Button
          id="startBreak"
          onClick={isWork ? handleStartBreak : handleStartWork}
          size="lg"
          className="w-24 h-24 mb-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Play className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}
