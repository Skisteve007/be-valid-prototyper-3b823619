// Beta configuration - easy to update
export const BETA_CONFIG = {
  // End date: January 15, 2025 at 11:59 PM EST
  endDate: new Date('2025-01-15T23:59:59-05:00'),
  
  // Display settings
  maxBetaMembers: 100,
  
  // Pricing display
  regularPrice: '$19/60 days',
  standardPrice: '$39/60 days',
  
  // Beta duration for users (60 days free from signup)
  betaUserFreeDays: 60,
};

export const isBetaPeriodActive = (): boolean => {
  const now = new Date();
  const end = BETA_CONFIG.endDate;
  // Beta is active if current time is before end date
  return now.getTime() < end.getTime();
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
