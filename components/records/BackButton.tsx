'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="fixed bottom-6 right-4 flex items-center justify-center w-14 h-14 rounded-full bg-blue-700 hover:bg-blue-400 transition-colors shadow-lg z-50"
      aria-label="戻る"
    >
      <ArrowLeft className="w-6 h-6 text-white" />
    </button>
  );
}