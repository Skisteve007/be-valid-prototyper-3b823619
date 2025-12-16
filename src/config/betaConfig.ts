// Beta configuration - easy to update
export const BETA_CONFIG = {
  // End date: 48 days from Dec 16, 2025 = Feb 2, 2026 at 11:59 PM EST
  endDate: new Date('2026-02-02T23:59:59-05:00'),
  
  // Display settings
  maxBetaMembers: 100,
  
  // Pricing display
  regularPrice: '$19 at sign-up',
  standardPrice: '$39/60 days',
  
  // Beta duration for users (60 days free from signup)
  betaUserFreeDays: 60,
};

export const isBetaPeriodActive = (): boolean => {
  // FORCED BETA MODE - Always return true until Jan 16, 2025
  // This ensures FREE BETA displays everywhere regardless of date checks
  return true;
  
  // DISABLED until Jan 16, 2025:
  // const now = new Date();
  // const end = BETA_CONFIG.endDate;
  // return now.getTime() < end.getTime();
};

export const getBetaTimeRemaining = () => {
  const now = new Date();
  const end = BETA_CONFIG.endDate;
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, expired: false };
};
