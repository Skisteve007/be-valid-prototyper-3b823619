import React from 'react';
import { Hand } from 'lucide-react';
import VerificationSignalPage from '@/components/trust-center/VerificationSignalPage';

const TouchVerification: React.FC = () => {
  return (
    <VerificationSignalPage
      title="Touch Sense"
      scientificName="Somatosensory System Verification"
      description="Tactile perception and nerve response assessment including pressure sensitivity, temperature discrimination, and proprioceptive accuracy."
      signalType="Somatosensory signals including two-point discrimination thresholds, vibration sensitivity scores, thermal perception accuracy, and nerve conduction velocity markers from neurological assessment centers."
      howItWorks="Neurological tactile assessments transmit verification signals confirming somatosensory function. Essential for roles requiring fine motor control, safety-sensitive positions, and comprehensive health verification."
      icon={<Hand className="w-12 h-12" />}
      iconColorClass="text-emerald-400"
      glowColorClass="bg-emerald-500/10"
      accentColor="emerald"
    />
  );
};

export default TouchVerification;