import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAgeVerification } from '@/hooks/useAgeVerification';

interface AgeGateProps {
  children: React.ReactNode;
}

export const AgeGate = ({ children }: AgeGateProps) => {
  const { isVerified } = useAgeVerification();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isVerified && location.pathname !== '/age-verification') {
      navigate('/age-verification', { replace: true, state: { from: location.pathname } });
    }
  }, [isVerified, navigate, location]);

  if (!isVerified && location.pathname !== '/age-verification') {
    return null;
  }

  return <>{children}</>;
};
