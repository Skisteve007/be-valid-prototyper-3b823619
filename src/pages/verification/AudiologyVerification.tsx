import React from 'react';
import { Ear } from 'lucide-react';
import VerificationSignalPage from '@/components/trust-center/VerificationSignalPage';

const AudiologyVerification: React.FC = () => {
  return (
    <VerificationSignalPage
      title="Audiology"
      scientificName="Auditory System Verification"
      description="Hearing and auditory processing verification. Signal received from certified audiological assessment sources."
      icon={<Ear className="w-12 h-12" />}
      iconColorClass="text-blue-400"
      glowColorClass="bg-blue-500/10"
    />
  );
};

export default AudiologyVerification;