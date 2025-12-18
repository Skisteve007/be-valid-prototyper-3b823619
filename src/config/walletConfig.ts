// Convenience fee tiers for wallet funding
export const CONVENIENCE_FEE_TIERS = [
  { min: 10, max: 25, fee: 1.99 },
  { min: 26, max: 50, fee: 2.99 },
  { min: 51, max: 100, fee: 4.99 },
  { min: 101, max: 250, fee: 9.99 },
  { min: 251, max: 500, fee: 19.99 },
  { min: 501, max: 1000, fee: 39.99 },
  { min: 1001, max: 2500, fee: 74.99 },
  { min: 2501, max: 5000, fee: 149.99 },
];

export const WALLET_LIMITS = {
  MIN_DEPOSIT: 10,
  MAX_DEPOSIT: 5000,
  DAILY_LIMIT: 5000,
  MONTHLY_LIMIT: 10000,
};

export const PRESET_AMOUNTS = [25, 50, 100, 250, 500, 1000];

export function getConvenienceFee(amount: number): number {
  const tier = CONVENIENCE_FEE_TIERS.find(t => amount >= t.min && amount <= t.max);
  return tier ? tier.fee : 0;
}

export function isValidAmount(amount: number): boolean {
  return amount >= WALLET_LIMITS.MIN_DEPOSIT && amount <= WALLET_LIMITS.MAX_DEPOSIT;
}
