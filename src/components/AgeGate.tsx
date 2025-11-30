import { useAgeVerification } from '@/hooks/useAgeVerification';
import { AgeVerificationDialog } from './AgeVerificationDialog';

interface AgeGateProps {
  children: React.ReactNode;
}

export const AgeGate = ({ children }: AgeGateProps) => {
  const { isVerified, setVerified } = useAgeVerification();

  const handleVerify = () => {
    setVerified(true);
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <>
      <AgeVerificationDialog 
        open={!isVerified} 
        onVerify={handleVerify}
        onExit={handleExit}
      />
      {children}
    </>
  );
};
