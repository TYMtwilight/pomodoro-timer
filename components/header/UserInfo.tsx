'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


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
      {/* ユーザー情報（クリックで作業記録ページへ） */}
      <Link
        href="/records"
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
        title="作業記録を見る"
      >
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || 'User'}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full ring-2 ring-transparent hover:ring-blue-500 transition-all"
          />
        )}
      </Link>

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