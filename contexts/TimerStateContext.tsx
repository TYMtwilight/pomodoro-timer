'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TimerType } from '@/types/timerType';

interface TimerState {
  timerType: TimerType;
  timeLeft: number;
  isRunning: boolean;
  hasStarted: boolean;
  startTime: Date | null;
}

interface TimerStateContextType {
  savedState: TimerState | null;
  saveTimerState: (state: TimerState) => void;
  clearTimerState: () => void;
  getSavedState: (timerType: TimerType) => TimerState | null;
}

const TimerStateContext = createContext<TimerStateContextType | undefined>(undefined);

export function TimerStateProvider({ children }: { children: ReactNode }) {
  const [savedState, setSavedState] = useState<TimerState | null>(null);

  const saveTimerState = useCallback((state: TimerState) => {
    setSavedState(state);
  }, []);

  const clearTimerState = useCallback(() => {
    setSavedState(null);
  }, []);

  const getSavedState = useCallback((timerType: TimerType) => {
    // 保存された状態が存在し、かつtimerTypeが一致する場合のみ返す
    if (savedState && savedState.timerType === timerType) {
      return savedState;
    }
    return null;
  }, [savedState]);

  return (
    <TimerStateContext.Provider
      value={{
        savedState,
        saveTimerState,
        clearTimerState,
        getSavedState,
      }}
    >
      {children}
    </TimerStateContext.Provider>
  );
}

export function useTimerState() {
  const context = useContext(TimerStateContext);
  if (context === undefined) {
    throw new Error('useTimerState must be used within a TimerStateProvider');
  }
  return context;
}
