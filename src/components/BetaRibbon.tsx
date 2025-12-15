import { isBetaPeriodActive } from '@/config/betaConfig';

interface BetaRibbonProps {
  className?: string;
}

export const BetaRibbon = ({ className = '' }: BetaRibbonProps) => {
  const isBeta = isBetaPeriodActive();

  return (
    <div 
      className={`absolute top-4 right-[-40px] z-10 text-black font-bold px-9 py-2 text-xs uppercase tracking-wide ${className}`}
      style={{ 
        transform: 'rotate(-15deg)',
        backgroundColor: isBeta ? '#22c55e' : '#06b6d4',
        boxShadow: isBeta 
          ? '0 0 15px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.4)' 
          : '0 0 15px rgba(6, 182, 212, 0.6)',
      }}
    >
      {isBeta ? 'FREE BETA' : 'INTRO PRICE'}
    </div>
  );
};

export default BetaRibbon;
