import React, { useState } from 'react';
import { FileText, Rocket } from 'lucide-react';
import { PDFViewerModal } from '@/components/PDFViewerModal';

const AdoptionRunwayPill: React.FC = () => {
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsPdfOpen(true)}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full
          border transition-all duration-300 touch-manipulation
          bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 
          border-cyan-500/60 shadow-[0_0_20px_rgba(0,229,229,0.4)] 
          hover:shadow-[0_0_30px_rgba(0,229,229,0.6)]
        `}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {/* Animated glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/15 to-blue-500/15 animate-pulse" />

        {/* Icon */}
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500/30 border border-cyan-400/50">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <Rocket className="absolute -top-1 -right-1 w-2.5 h-2.5 text-blue-400 animate-pulse" />
        </div>

        {/* Label */}
        <div className="relative flex flex-col items-start">
          <span className="font-bold text-xs tracking-wide text-cyan-400">
            Adoption Runway
          </span>
          <span className="text-[9px] text-cyan-300/80">
            Implementation Doctrine
          </span>
        </div>
      </button>

      <PDFViewerModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        pdfUrl="/documents/AI_GOVERNANCE_ADOPTION_RUNWAY-THE_GRILLO_STANDARD.pdf"
        title="The Grillo AI Governance Adoption Runway"
      />
    </>
  );
};

export default AdoptionRunwayPill;
