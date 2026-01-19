'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { User, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { LoginButton } from './LoginButton';
import { Button } from '@/components/ui/button';


export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // 記録画面にいるかどうか
  const isRecordsPage = pathname === '/records';

  /**
   * ログアウト処理
   */
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  /**
   * 左側のコンテンツを返す
   * - 記録画面: 戻るボタン
   * - ローディング中: スケルトン
   * - 未ログイン: ログインボタン
   * - ログイン済み: ユーザーアバター
   */
  const renderLeftContent = () => {
    // 記録画面: 戻るボタン
    if (isRecordsPage) {
      return (
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          aria-label="前のページに戻る"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      );
    }

    // ローディング中: スケルトン
    if (status === 'loading') {
      return <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-800" />;
    }

    // 未ログイン: ログインボタン
    if (status === 'unauthenticated') {
      return <LoginButton />;
    }

    // ログイン済み: ユーザーアバター
    return (
      <Link
        href="/records"
        className="group flex items-center justify-center w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all"
        aria-label="作業記録を見る"
      >
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || 'ユーザーアバター'}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-white" />
        )}
      </Link>
    );
  };

  /**
   * 右側のコンテンツを返す
   * - ログイン済み: ログアウトボタン
   * - それ以外: 空白（レイアウト維持用）
   */
  const renderRightContent = () => {
    if (status === 'authenticated') {
      return (
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-white hover:text-red-400 hover:bg-transparent transition-colors"
        >
          <span className="text-sm font-medium">logout</span>
          <LogOut className="w-4 h-4" />
        </Button>
      );
    }

    // 未ログイン時は空白（レイアウト維持用）
    return <div className="w-10" />;
  };

  return (
    <>
      <header className="w-full bg-black/50">
        <div className="flex items-center justify-between px-6 py-2">
          {/* 左: 戻るボタン or ユーザーアバター */}
          <div>{renderLeftContent()}</div>

          {/* 右: ログアウトボタン */}
          <div>{renderRightContent()}</div>
        </div>
      </header>


    </>
  );
}
