import React, { createContext, useContext, ReactNode } from 'react';
import { useRatify, RatifyCorrection } from '@/hooks/useRatify';

interface RatifyContextValue {
  corrections: RatifyCorrection[];
  pendingCorrections: RatifyCorrection[];
  hasCorrections: boolean;
  hasPendingCorrections: boolean;
  addCorrection: (correction: Omit<RatifyCorrection, 'id' | 'timestamp' | 'ratified'>) => void;
  ratifyCorrection: (id: string) => { original: string; corrected: string } | null;
  ratifyAll: () => { original: string; corrected: string }[];
  dismissCorrection: (id: string) => void;
  clearAll: () => void;
  activeCorrection: RatifyCorrection | null;
  setActiveCorrection: (correction: RatifyCorrection | null) => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
}

const RatifyContext = createContext<RatifyContextValue | undefined>(undefined);

export const RatifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ratifyState = useRatify();

  return (
    <RatifyContext.Provider value={ratifyState}>
      {children}
    </RatifyContext.Provider>
  );
};

export const useRatifyContext = (): RatifyContextValue => {
  const context = useContext(RatifyContext);
  if (!context) {
    throw new Error('useRatifyContext must be used within a RatifyProvider');
  }
  return context;
};

export default RatifyContext;
