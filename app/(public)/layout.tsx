import '@/app/globals.css';
import type { Metadata } from 'next';
import { Major_Mono_Display } from 'next/font/google';

const majorMono = Major_Mono_Display({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'Pomodoro Timer 作業開始！',
  description: '作業時間を計測するタイマー画面です。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      /* majorMono.classNameは、Next.jsが生成したCSSクラス名（例: __className_xxxxx）を返します */
      <div className={majorMono.className}>{children}</div>
  );
}
