'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export default function CompletionPage() {
  const searchParams = useSearchParams();
  const isWork = searchParams.get('isWork') === 'true';
  const router = useRouter();
  
  const handleStartBreak = () => {
    router.push('/timer/break');
  };
  const handleStartWork = () => {
    router.push('/timer/work');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">    
      <div className="flex flex-col flex-auto items-center max-w-3xl w-full h-480px relative">
        <div className="absolute top-4 text-3xl">
          <span>{isWork ? 'work completed' : 'break complete'}</span>
        </div>
        <div className="absolute top-15">
          <span className="text-center text-sm md:text-base">
            {isWork ? 'お疲れ様です。5分間だけ頭を空っぽにしましょう。' : 'さあ、集中タイムの始まりです！25分間、全力で取り組みましょう。'}
          </span>
        </div>
        <div className="absolute bottom-8">
          <span className="tracking-wider">
            next&gt;&gt; <span className="font-mono">{isWork ? '5分間の休憩' : '25分間の作業'}</span>
          </span>
        </div>        
      </div>

      <div className="flex flex-col justify-end items-center w-full max-w-3xl gap-2">
        <label htmlFor="startBreak">{isWork ? '休憩を開始する' : '作業を開始する'}</label>
        <Button
          id="startBreak"
          onClick={
            isWork ? handleStartBreak : handleStartWork
          }
          size="lg"
          className="w-24 h-24 mb-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Play className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}
