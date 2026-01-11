import { useState, useCallback } from 'react';

export interface RatifyCorrection {
  id: string;
  originalText: string;
  suggestedCorrection: string;
  context?: string;
  severity: 'error' | 'warning' | 'info';
  category: 'hallucination' | 'factual_error' | 'logical_inconsistency' | 'citation_needed' | 'outdated_info';
  confidence: number; // 0-100
  source?: string;
  timestamp: Date;
  ratified: boolean;
}

interface UseRatifyReturn {
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

export const useRatify = (): UseRatifyReturn => {
  const [corrections, setCorrections] = useState<RatifyCorrection[]>([]);
  const [activeCorrection, setActiveCorrection] = useState<RatifyCorrection | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const pendingCorrections = corrections.filter(c => !c.ratified);
  const hasCorrections = corrections.length > 0;
  const hasPendingCorrections = pendingCorrections.length > 0;

  const addCorrection = useCallback((correction: Omit<RatifyCorrection, 'id' | 'timestamp' | 'ratified'>) => {
    const newCorrection: RatifyCorrection = {
      ...correction,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ratified: false,
    };
    setCorrections(prev => [...prev, newCorrection]);
    
    // Auto-open panel when new correction arrives
    if (!isPanelOpen) {
      setIsPanelOpen(true);
      setActiveCorrection(newCorrection);
    }
  }, [isPanelOpen]);

  const ratifyCorrection = useCallback((id: string) => {
    const correction = corrections.find(c => c.id === id);
    if (!correction) return null;

    setCorrections(prev => 
      prev.map(c => c.id === id ? { ...c, ratified: true } : c)
    );

    // Move to next pending correction
    const remainingPending = corrections.filter(c => c.id !== id && !c.ratified);
    if (remainingPending.length > 0) {
      setActiveCorrection(remainingPending[0]);
    } else {
      setActiveCorrection(null);
    }

    return {
      original: correction.originalText,
      corrected: correction.suggestedCorrection,
    };
  }, [corrections]);

  const ratifyAll = useCallback(() => {
    const results = pendingCorrections.map(c => ({
      original: c.originalText,
      corrected: c.suggestedCorrection,
    }));

    setCorrections(prev => prev.map(c => ({ ...c, ratified: true })));
    setActiveCorrection(null);
    setIsPanelOpen(false);

    return results;
  }, [pendingCorrections]);

  const dismissCorrection = useCallback((id: string) => {
    setCorrections(prev => prev.filter(c => c.id !== id));
    
    if (activeCorrection?.id === id) {
      const remaining = corrections.filter(c => c.id !== id && !c.ratified);
      setActiveCorrection(remaining.length > 0 ? remaining[0] : null);
    }
  }, [activeCorrection, corrections]);

  const clearAll = useCallback(() => {
    setCorrections([]);
    setActiveCorrection(null);
    setIsPanelOpen(false);
  }, []);

  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
    if (pendingCorrections.length > 0 && !activeCorrection) {
      setActiveCorrection(pendingCorrections[0]);
    }
  }, [pendingCorrections, activeCorrection]);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  return {
    corrections,
    pendingCorrections,
    hasCorrections,
    hasPendingCorrections,
    addCorrection,
    ratifyCorrection,
    ratifyAll,
    dismissCorrection,
    clearAll,
    activeCorrection,
    setActiveCorrection,
    isPanelOpen,
    openPanel,
    closePanel,
  };
};

export default useRatify;
