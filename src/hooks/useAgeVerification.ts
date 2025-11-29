import { useState, useEffect } from 'react';

const AGE_VERIFICATION_KEY = 'cleancheck_age_verified';

export const useAgeVerification = () => {
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    return localStorage.getItem(AGE_VERIFICATION_KEY) === 'true';
  });

  const setVerified = (verified: boolean) => {
    if (verified) {
      localStorage.setItem(AGE_VERIFICATION_KEY, 'true');
    } else {
      localStorage.removeItem(AGE_VERIFICATION_KEY);
    }
    setIsVerified(verified);
  };

  const clearVerification = () => {
    localStorage.removeItem(AGE_VERIFICATION_KEY);
    setIsVerified(false);
  };

  return { isVerified, setVerified, clearVerification };
};
