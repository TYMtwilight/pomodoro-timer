'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SessionContextType {
  sessionCount: number;
  incrementSession: () => void;
  resetSession: () => void;
  isLastSession: () => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const MAX_SESSIONS = 4;

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionCount, setSessionCount] = useState(1);

  const incrementSession = useCallback(() => {
    setSessionCount((current: number) => {
      const next = current >= MAX_SESSIONS ? 1 : current + 1;
      return next;
    });
  }, []);

  const resetSession = useCallback(() => {
    setSessionCount(1);
  }, []);

  const isLastSession = useCallback(() => {
    return sessionCount === MAX_SESSIONS;
  }, [sessionCount]);

  return (
    <SessionContext.Provider
      value={{
        sessionCount,
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
