'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export function LoginButton() {
  return (
    <Button
      onClick={() => signIn('google')}
      variant="default"
      size="sm"
      className="gap-2 text-neutral-400 hover:text-white"
    >
      <LogIn className="h-4 w-4" />
      ログイン
    </Button>
  );
}