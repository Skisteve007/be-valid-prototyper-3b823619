import React from 'react';
import { Eye } from 'lucide-react';
import VerificationSignalPage from '@/components/trust-center/VerificationSignalPage';

const VisualVerification: React.FC = () => {
  return (
    <VerificationSignalPage
      title="Visual"
      scientificName="Ophthalmic System Verification"
      description="Vision and optical health verification. Signal received from certified ophthalmological and optometric sources."
      icon={<Eye className="w-12 h-12" />}
      iconColorClass="text-amber-400"
      glowColorClass="bg-amber-500/10"
    />
  );
};

export default VisualVerification;