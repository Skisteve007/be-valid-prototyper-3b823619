import { isBetaPeriodActive } from '@/config/betaConfig';

interface BetaRibbonProps {
  text?: string;
}

export const BetaRibbon = ({ text = 'FREE' }: BetaRibbonProps) => {
  if (!isBetaPeriodActive()) {
    return null;
  }

  return (
    <div 
      className="absolute -top-1 -right-1 z-10 overflow-hidden w-24 h-24 pointer-events-none"
    >
      <div 
        className="absolute top-5 -right-8 w-32 text-center py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-black text-xs font-bold uppercase tracking-wide shadow-lg"
        style={{ 
          transform: 'rotate(45deg)',
          transformOrigin: 'center',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default BetaRibbon;
