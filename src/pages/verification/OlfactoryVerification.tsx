import React from 'react';
import { Droplets } from 'lucide-react';
import VerificationSignalPage from '@/components/trust-center/VerificationSignalPage';

const OlfactoryVerification: React.FC = () => {
  return (
    <VerificationSignalPage
      title="Olfactory"
      scientificName="Olfactory System & Pheromone Detection"
      description="Smell perception and pheromone signature analysis measuring odorant detection thresholds, scent identification accuracy, and biochemical marker emissions."
      signalType="Olfactory signals including smell identification test (SIT) scores, pheromone signature profiles, odorant threshold measurements, and biochemical emission patterns from certified olfactory and endocrine assessment sources."
      howItWorks="Pheromone and olfactory assessments from specialized biochemistry labs transmit encrypted verification signals. Your unique chemical signature remains private — we receive only the verification status for compatibility and health applications."
      icon={<Droplets className="w-12 h-12" />}
      iconColorClass="text-pink-400"
      glowColorClass="bg-pink-500/10"
      accentColor="pink"
    />
  );
};

export default OlfactoryVerification;