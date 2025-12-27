'use client';

import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const BLUE_100 = '#d9e6ff';
const BLUE_300 = '#9db7f9';
const BLUE_500 = '#4979f5';

export default function CompletionPage() {
  const handleStartBreak = () => {
    console.log('休憩を開始');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">    
      <div className="flex flex-col flex-2 items-center justify-center max-w-3xl w-full gap-4">
        <h1 className="text-3xl tracking-wider md:text-5xl"
          style={{
            textShadow: `0 0 10px ${BLUE_300}, 0 0 10px ${BLUE_500}`,
          }}
        >
          completed.
        </h1>
        <p className="text-center text-sm md:text-base">
          お疲れ様です。5分間だけ頭を空っぽにしましょう。
        </p>
      </div>
      <div className="flex flex-6 items-end justify-center w-full max-w-3xl">
        <p className="mb-8 text-xl tracking-wider">
          next&gt;&gt; <span className="font-mono">5分間の休憩</span>
        </p>
      </div>
      <div className="flex flex-col items-center justify-end w-full max-w-3xl gap-2">
        <label htmlFor="startBreak">休憩を開始する</label>
        <Button
          id="startBreak"
          onClick={handleStartBreak}
          size="lg"
          className="w-32 h-32 mb-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Play className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}
