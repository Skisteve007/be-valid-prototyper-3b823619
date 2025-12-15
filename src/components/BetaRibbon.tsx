import { isBetaPeriodActive } from '@/config/betaConfig';

interface BetaRibbonProps {
  className?: string;
}

export const BetaRibbon = ({ className = '' }: BetaRibbonProps) => {
  const isActive = isBetaPeriodActive();

  return (
    <div 
      className={`absolute top-4 right-[-40px] z-10 ${
        isActive 
          ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' 
          : 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
      } text-black font-bold px-9 py-2 shadow-lg text-xs uppercase tracking-wide ${className}`}
      style={{ 
        transform: 'rotate(-15deg)',
      }}
    >
      {isActive ? 'FREE BETA' : 'INTRO PRICE'}
    </div>
  );
};

export default BetaRibbon;
