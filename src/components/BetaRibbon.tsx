// FORCED BETA MODE - Do not change until Jan 16, 2025
interface BetaRibbonProps {
  className?: string;
}

export const BetaRibbon = ({ className = '' }: BetaRibbonProps) => {
  // FORCE: Always show FREE BETA until Jan 16, 2025
  return (
    <div 
      className={`absolute top-4 right-[-40px] z-10 text-black font-bold px-9 py-2 text-xs uppercase tracking-wide ${className}`}
      style={{ 
        transform: 'rotate(-15deg)',
        backgroundColor: '#22c55e',
        boxShadow: '0 0 15px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.4)',
      }}
    >
      FREE BETA
    </div>
  );
};

export default BetaRibbon;
