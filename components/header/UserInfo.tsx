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
        <span className="text-sm text-white">{user.name}</span>
      </div>

      {/* ログアウトボタン */}
      <Button
        onClick={() => signOut()}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        ログアウト
      </Button>
    </div>
  );
}