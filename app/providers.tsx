'use client';

import { SessionProvider as PomodoroSessionProvider } from '@/contexts/SessionContext';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { TimerStateProvider } from '@/contexts/TimerStateContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SettingsProvider>
        <TimerStateProvider>
          <PomodoroSessionProvider>
            {children}
          </PomodoroSessionProvider>
        </TimerStateProvider>
      </SettingsProvider>
    </NextAuthSessionProvider>
  );
}
