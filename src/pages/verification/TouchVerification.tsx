import React from 'react';
import { Hand } from 'lucide-react';
import VerificationSignalPage from '@/components/trust-center/VerificationSignalPage';

const TouchVerification: React.FC = () => {
  return (
    <VerificationSignalPage
      title="Touch Sense"
      scientificName="Somatosensory System Verification"
      description="Tactile perception and sensory function verification. Signal received from certified neurological assessment sources."
      icon={<Hand className="w-12 h-12" />}
      iconColorClass="text-emerald-400"
      glowColorClass="bg-emerald-500/10"
    />
  );
};

export default TouchVerification;