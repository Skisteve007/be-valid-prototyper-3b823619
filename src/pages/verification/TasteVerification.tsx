import React from 'react';
import { Apple } from 'lucide-react';
import VerificationSignalPage from '@/components/trust-center/VerificationSignalPage';

const TasteVerification: React.FC = () => {
  return (
    <VerificationSignalPage
      title="Taste Sense"
      scientificName="Gustatory System Verification"
      description="Taste perception and gustatory function verification. Signal received from certified taste assessment sources."
      icon={<Apple className="w-12 h-12" />}
      iconColorClass="text-rose-400"
      glowColorClass="bg-rose-500/10"
    />
  );
};

export default TasteVerification;