'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Image from 'next/image';


interface UserInfoProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="flex items-center gap-4">
      {/* ユーザー情報 */}
      <div className="flex items-center gap-2">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || 'User'}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
        )}
      </div>

      {/* ログアウトボタン */}
      <Button
        onClick={() => signOut()}
        variant="default"
        size="sm"
        className="gap-2 text-neutral-400 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        <span className="text-sm">ログアウト</span>
      </Button>
    </div>
  );
}