/**
 * SINGLE SOURCE OF TRUTH - FUNDRAISING TERMS
 * 
 * All fundraising terms, tranche definitions, and investment parameters
 * are defined here. Use this config throughout the app for consistency.
 * 
 * DO NOT hardcode fundraising numbers elsewhere - import from this file.
 */

export type TrancheStatus = 'open' | 'upcoming' | 'planned' | 'closed';
export type InstrumentType = 'convertible_note' | 'safe' | 'priced_equity';

export interface TrancheConfig {
  id: number;
  name: string;
  shortName: string;
  instrumentType: InstrumentType;
  targetRaiseUsd: number;
  minCheckUsd: number;
  valuationCapUsd: number;
  valuationCapRangeUsd?: { min: number; max: number };
  discountPercent: number;
  discountRangePercent?: { min: number; max: number };
  mfnEnabled: boolean;
  status: TrancheStatus;
  purposeCopy: string;
  interestRate: number; // Annual interest rate percentage (0 = no interest)
  maturityMonths: number;
  timeline?: string;
}

// ===== TRANCHE DEFINITIONS =====

export const TRANCHE_0: TrancheConfig = {
  id: 0,
  name: 'Tranche 0: Emergency Bridge',
  shortName: 'Emergency Bridge',
  instrumentType: 'convertible_note',
  targetRaiseUsd: 50000,
  minCheckUsd: 2500,
  valuationCapUsd: 6000000,
  discountPercent: 25,
  mfnEnabled: true,
  status: 'open',
  purposeCopy: 'Close fast to fund SF trip + wiring Ghost + security hardening + Jan 8 demo readiness.',
  interestRate: 0,
  maturityMonths: 18,
};

export const TRANCHE_1: TrancheConfig = {
  id: 1,
  name: 'Tranche 1: Launch Round',
  shortName: 'Launch Round',
  instrumentType: 'convertible_note',
  targetRaiseUsd: 200000,
  minCheckUsd: 5000,
  valuationCapUsd: 8000000,
  discountPercent: 20,
  mfnEnabled: false,
  status: 'upcoming',
  purposeCopy: 'Launch tranche after demo + initial LOIs/pilots.',
  interestRate: 0,
  maturityMonths: 18,
};

export const TRANCHE_2: TrancheConfig = {
  id: 2,
  name: 'Tranche 2: Seed',
  shortName: 'Seed Round',
  instrumentType: 'convertible_note', // Placeholder - will be priced equity
  targetRaiseUsd: 1500000,
  minCheckUsd: 10000,
  valuationCapUsd: 10000000,
  valuationCapRangeUsd: { min: 10000000, max: 12000000 },
  discountPercent: 15,
  discountRangePercent: { min: 15, max: 20 },
  mfnEnabled: false,
  status: 'planned',
  purposeCopy: 'Series Seed round for scaling operations.',
  interestRate: 0,
  maturityMonths: 18,
  timeline: 'Q2 2026',
};

export const TRANCHE_3: TrancheConfig = {
  id: 3,
  name: 'Tranche 3: Priced Round',
  shortName: 'Series A',
  instrumentType: 'priced_equity',
  targetRaiseUsd: 6000000,
  minCheckUsd: 25000,
  valuationCapUsd: 0, // Not applicable for priced round
  discountPercent: 0, // Not applicable for priced round
  mfnEnabled: false,
  status: 'planned',
  purposeCopy: 'Priced equity round for major expansion.',
  interestRate: 0,
  maturityMonths: 0, // Not applicable
  timeline: 'TBD',
};

// ===== ACTIVE TRANCHES FOR UI =====

export const ALL_TRANCHES: TrancheConfig[] = [
  TRANCHE_0,
  TRANCHE_1,
  TRANCHE_2,
  TRANCHE_3,
];

export const ACTIVE_TRANCHES: TrancheConfig[] = [
  TRANCHE_0,
  TRANCHE_1,
];

// ===== INVESTMENT TIER OPTIONS (for dropdowns) =====

export const getInvestmentTiers = (tranche: TrancheConfig) => {
  const tiers = [];
  const min = tranche.minCheckUsd;
  
  if (min <= 2500) tiers.push({ value: '2500', label: '$2,500' });
  if (min <= 5000) tiers.push({ value: '5000', label: '$5,000' });
  tiers.push({ value: '10000', label: '$10,000' });
  tiers.push({ value: '25000', label: '$25,000' });
  tiers.push({ value: '50000', label: '$50,000' });
  tiers.push({ value: '100000', label: '$100,000' });
  
  return tiers.filter(t => parseInt(t.value) >= min);
};

// ===== HELPER FUNCTIONS =====

export const formatUsd = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatUsdCompact = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  }
  return formatUsd(amount);
};

export const getTrancheById = (id: number): TrancheConfig | undefined => {
  return ALL_TRANCHES.find(t => t.id === id);
};

export const getOpenTranches = (): TrancheConfig[] => {
  return ALL_TRANCHES.filter(t => t.status === 'open');
};

export const validateMinimumCheck = (amount: number, tranche: TrancheConfig): boolean => {
  return amount >= tranche.minCheckUsd;
};

export const getMinCheckError = (tranche: TrancheConfig): string => {
  return `Minimum investment for ${tranche.shortName} is ${formatUsd(tranche.minCheckUsd)}`;
};

// ===== COMPANY INFO (for contracts) =====

export const COMPANY_INFO = {
  legalName: 'Giant Ventures, LLC',
  dba: 'Valid',
  state: 'Texas',
  entityType: 'Texas Limited Liability Company',
  ceo: 'Steven Grillo',
  address: 'Boca Raton, FL 33487',
};

// ===== SAFE PLACEHOLDER =====

export const SAFE_ENABLED = false;
export const SAFE_NOTICE = 'SAFE (coming soon — pending counsel-approved template)';
