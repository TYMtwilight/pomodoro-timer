'use client';

import { SessionProvider as PomodoroSessionProvider } from '@/contexts/SessionContext';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <PomodoroSessionProvider>
        {children}
      </PomodoroSessionProvider>
    </NextAuthSessionProvider>
  );
}
