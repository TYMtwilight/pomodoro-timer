'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useSettings } from './SettingsContext';

interface SessionContextType {
  sessionCount: number;
  maxSessions: number;
  incrementSession: () => void;
  resetSession: () => void;
  isLastSession: () => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionCount, setSessionCount] = useState(0);
  const { settings } = useSettings();
  const maxSessions = settings.pomodorosUntilLongBreak;

  const incrementSession = useCallback(() => {
    setSessionCount((current: number) => {
      const next = current >= maxSessions ? 1 : current + 1;
      return next;
    });
  }, [maxSessions]);

  const resetSession = useCallback(() => {
    setSessionCount(1);
  }, []);

  const isLastSession = useCallback(() => {
    return sessionCount === maxSessions;
  }, [sessionCount, maxSessions]);

  return (
    <SessionContext.Provider
      value={{
        sessionCount,
        maxSessions,
        incrementSession,
        resetSession,
        isLastSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
