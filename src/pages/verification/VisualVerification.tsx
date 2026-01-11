import React from 'react';
import { Eye } from 'lucide-react';
import VerificationSignalPage from '@/components/trust-center/VerificationSignalPage';

const VisualVerification: React.FC = () => {
  return (
    <VerificationSignalPage
      title="Visual"
      scientificName="Ophthalmic System Verification"
      description="Complete vision and ocular health assessment including acuity, color perception, peripheral vision, and retinal health indicators."
      signalType="Ophthalmic signals including visual acuity (20/20 scale), intraocular pressure readings, retinal scan markers, and color vision test results from certified ophthalmological sources."
      howItWorks="Eye examination results are transmitted from licensed optometrists and ophthalmologists. We verify vision health status through encrypted signal relay — your actual exam details remain with your healthcare provider."
      icon={<Eye className="w-12 h-12" />}
      iconColorClass="text-amber-400"
      glowColorClass="bg-amber-500/10"
      accentColor="amber"
    />
  );
};

export default VisualVerification;