'use client';

import { SessionProvider as PomodoroSessionProvider } from '@/contexts/SessionContext';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { TaskProvider } from '@/contexts/TaskContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SettingsProvider>
        <TaskProvider>
          <PomodoroSessionProvider>
            {children}
          </PomodoroSessionProvider>
        </TaskProvider>
      </SettingsProvider>
    </NextAuthSessionProvider>
  );
}
