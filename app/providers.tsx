'use client';

import { SessionProvider as PomodoroSessionProvider } from '@/contexts/SessionContext';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { SettingsProvider } from '@/contexts/SettingContsxt';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SettingsProvider>
        <PomodoroSessionProvider>
          {children}
        </PomodoroSessionProvider>
      </SettingsProvider>
    </NextAuthSessionProvider>
  );
}
