import React from 'react';
import { Apple } from 'lucide-react';
import VerificationSignalPage from '@/components/trust-center/VerificationSignalPage';

const TasteVerification: React.FC = () => {
  return (
    <VerificationSignalPage
      title="Taste Sense"
      scientificName="Gustatory System Verification"
      description="Taste receptor sensitivity and gustatory function assessment measuring response to sweet, sour, salty, bitter, and umami compounds."
      signalType="Gustatory function signals including taste threshold measurements, papillae density indicators, and chemosensory response patterns from certified taste assessment laboratories."
      howItWorks="Taste function assessments from specialized clinics transmit verification signals indicating gustatory health. Used in contexts requiring confirmed sensory capabilities — food industry, medical assessments, and wellness verification."
      icon={<Apple className="w-12 h-12" />}
      iconColorClass="text-rose-400"
      glowColorClass="bg-rose-500/10"
      accentColor="rose"
    />
  );
};

export default TasteVerification;