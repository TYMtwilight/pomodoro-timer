'use client';

import { useSession } from 'next-auth/react';
import { UserInfo } from './UserInfo';
import { LoginButton } from './LoginButton';

export function Header() {
  const { data: session, status } = useSession();

  /**
  * 認証状態に応じた表示コンテンツを返す
  * - loading: ローディングスケルトン
  * - authenticated: ユーザー情報とログアウトボタン
  * - unauthenticated: ログインボタン
  */
  const renderAuthContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="h-8 w-24 animate-pulse rounded bg-neutral-800" />
        );
      case 'authenticated':
        return <UserInfo user={session.user!} />;
      case 'unauthenticated':
        return <LoginButton />;
      default:
        return null;
    }
  };

  return (
    <header className="border-b border-neutral-800 bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* ロゴ・タイトル */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white">Pomodoro Timer</h1>
        </div>

        {/* ログイン状態の表示 */}
        <div className="flex items-center gap-4">
          {renderAuthContent()}
        </div>
      </div>
    </header>
  );
}