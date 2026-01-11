import React from 'react';
import { Droplets } from 'lucide-react';
import VerificationSignalPage from '@/components/trust-center/VerificationSignalPage';

const OlfactoryVerification: React.FC = () => {
  return (
    <VerificationSignalPage
      title="Olfactory"
      scientificName="Olfactory System & Pheromone Detection"
      description="Smell perception and pheromone signature verification. Signal received from certified olfactory and biochemical assessment sources."
      icon={<Droplets className="w-12 h-12" />}
      iconColorClass="text-pink-400"
      glowColorClass="bg-pink-500/10"
    />
  );
};

export default OlfactoryVerification;