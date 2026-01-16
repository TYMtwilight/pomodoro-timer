'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Settings, ListTodo } from 'lucide-react';
import { UserInfo } from './UserInfo';
import { LoginButton } from './LoginButton';
import { Button } from '@/components/ui/button';
import { SettingsModal } from '@/components/settings/SettingsMordal';
import { TasksModal } from '@/components/tasks';

export function Header() {
  const { data: session, status } = useSession();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);

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
    <>
      <header className="border-b border-neutral-800 bg-black">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* ロゴ・タイトル */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Pomodoro Timer</h1>
          </div>

          {/* 右側のコンテンツ */}
          <div className="flex items-between gap-4">
            {/* ログイン状態のみ表示されるボタン */}
            {status === 'authenticated' && (
              <>
                {/* 作業項目管理ボタン */}
                <Button
                  onClick={() => setIsTasksOpen(true)}
                  variant="default"
                  size="icon"
                  className="text-neutral-400 hover:text-white rounded-full"
                >
                  <ListTodo className="size-5" />
                  <span className="sr-only">作業項目管理</span>
                </Button>

                {/* 設定ボタン */}
                <Button
                  onClick={() => setIsSettingsOpen(true)}
                  variant="default"
                  size="icon"
                  className="text-neutral-400 hover:text-white rounded-full"
                >
                  <Settings className="size-5" />
                  <span className="sr-only">設定</span>
                </Button>
              </>
            )}
          
            {/* ログイン状態の表示 */}
            {renderAuthContent()}
          </div>
        </div>
      </header>

      {/* 作業項目管理モーダル */}
      <TasksModal
        open={isTasksOpen}
        onOpenChange={setIsTasksOpen}
      />

      {/* 設定モーダル */}
      <SettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
}