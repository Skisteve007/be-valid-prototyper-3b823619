import React from 'react';
import { Ear } from 'lucide-react';
import VerificationSignalPage from '@/components/trust-center/VerificationSignalPage';

const AudiologyVerification: React.FC = () => {
  return (
    <VerificationSignalPage
      title="Audiology"
      scientificName="Auditory System Verification"
      description="Comprehensive hearing assessment measuring frequency response, speech recognition, and auditory processing capabilities."
      signalType="Audiometric data signals including pure-tone thresholds (250Hz-8kHz), speech discrimination scores, and tympanometry readings from certified audiological facilities."
      howItWorks="Your hearing test results are transmitted directly from certified audiology centers. We receive only the verification signal (pass/caution/fail) — never the raw audiogram data. Results reflect your current auditory health status."
      icon={<Ear className="w-12 h-12" />}
      iconColorClass="text-blue-400"
      glowColorClass="bg-blue-500/10"
      accentColor="blue"
    />
  );
};

export default AudiologyVerification;