import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Radio, Upload, Zap, Waves, Activity } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { cn } from '@/lib/utils';

type SignalStatus = 'awaiting' | 'pass' | 'caution' | 'fail';

interface VerificationSignalPageProps {
  title: string;
  scientificName?: string;
  description: string;
  howItWorks?: string;
  signalType?: string;
  icon: React.ReactNode;
  iconColorClass: string;
  glowColorClass: string;
  accentColor?: string;
}

const VerificationSignalPage: React.FC<VerificationSignalPageProps> = ({
  title,
  scientificName,
  description,
  howItWorks,
  signalType,
  icon,
  iconColorClass,
  glowColorClass,
  accentColor = 'cyan'
}) => {
  const navigate = useNavigate();
  const [signalStatus, setSignalStatus] = useState<SignalStatus>('awaiting');
  const [isGlowing, setIsGlowing] = useState(true);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Simulate awaiting signal with pulsing glow
  useEffect(() => {
    if (signalStatus === 'awaiting') {
      const interval = setInterval(() => {
        setIsGlowing(prev => !prev);
        setPulsePhase(prev => (prev + 1) % 4);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [signalStatus]);

  const getSignalColor = () => {
    switch (signalStatus) {
      case 'pass':
        return 'bg-emerald-500';
      case 'caution':
        return 'bg-amber-500';
      case 'fail':
        return 'bg-red-500';
      default:
        return 'bg-muted';
    }
  };

  const getSignalGlow = () => {
    switch (signalStatus) {
      case 'pass':
        return 'shadow-[0_0_40px_rgba(16,185,129,0.7)]';
      case 'caution':
        return 'shadow-[0_0_40px_rgba(245,158,11,0.7)]';
      case 'fail':
        return 'shadow-[0_0_40px_rgba(239,68,68,0.7)]';
      default:
        return '';
    }
  };

  const getSignalText = () => {
    switch (signalStatus) {
      case 'pass':
        return { text: 'VERIFIED', color: 'text-emerald-400' };
      case 'caution':
        return { text: 'PENDING REVIEW', color: 'text-amber-400' };
      case 'fail':
        return { text: 'NOT VERIFIED', color: 'text-red-400' };
      default:
        return { text: 'AWAITING SIGNAL', color: 'text-muted-foreground' };
    }
  };

  const handleUpload = () => {
    // TODO: Implement file upload to API source of truth
    console.log('Upload triggered for', title);
  };

  const signalInfo = getSignalText();

  return (
    <>
      <Helmet>
        <title>{title} Verification | Valid™</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-20 md:pt-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className={cn(
            "absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-10 transition-all duration-3000",
            glowColorClass
          )} style={{ animation: 'float 8s ease-in-out infinite' }} />
          <div className={cn(
            "absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-5 transition-all duration-3000",
            glowColorClass
          )} style={{ animation: 'float 10s ease-in-out infinite reverse' }} />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-4 mb-2">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
            {scientificName && (
              <p className="text-muted-foreground text-sm font-mono">{scientificName}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="relative z-10 text-muted-foreground text-sm mb-6 ml-12 max-w-md">
          {description}
        </p>

        {/* Central Glowing Pill Box */}
        <div className="relative z-10 flex flex-col items-center justify-center py-8">
          {/* Outer rotating ring */}
          <div className="relative">
            {signalStatus === 'awaiting' && (
              <>
                <div 
                  className={cn(
                    "absolute inset-[-20px] rounded-full border border-dashed opacity-30",
                    iconColorClass.replace('text-', 'border-')
                  )}
                  style={{ animation: 'spin 20s linear infinite' }}
                />
                <div 
                  className={cn(
                    "absolute inset-[-35px] rounded-full border border-dotted opacity-20",
                    iconColorClass.replace('text-', 'border-')
                  )}
                  style={{ animation: 'spin 30s linear infinite reverse' }}
                />
              </>
            )}
            
            <div
              className={cn(
                "relative w-44 h-44 rounded-3xl flex items-center justify-center transition-all duration-700",
                glowColorClass,
                signalStatus === 'awaiting' && isGlowing && "shadow-[0_0_60px_rgba(0,200,255,0.4)]",
                signalStatus !== 'awaiting' && getSignalGlow()
              )}
            >
              {/* Hexagon pattern overlay */}
              <div className="absolute inset-0 rounded-3xl opacity-10 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_50%,currentColor_50%,currentColor_51%,transparent_51%)] bg-[length:20px_20px]" />
              
              {/* Inner pill content */}
              <div className={cn(
                "w-36 h-36 rounded-2xl bg-card border-2 border-border flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden",
                signalStatus === 'awaiting' && isGlowing && iconColorClass.replace('text-', 'border-').replace('-400', '-500/50')
              )}>
                {/* Scanning line effect */}
                {signalStatus === 'awaiting' && (
                  <div 
                    className={cn(
                      "absolute w-full h-1 opacity-50",
                      iconColorClass.replace('text-', 'bg-')
                    )}
                    style={{ 
                      animation: 'scanLine 2s ease-in-out infinite',
                      boxShadow: `0 0 20px 5px currentColor`
                    }}
                  />
                )}
                
                <div className={cn(iconColorClass, "relative z-10 transition-transform duration-500", isGlowing && "scale-110")}>
                  {icon}
                </div>
                
                {/* Mini signal wave */}
                <div className="flex items-end gap-0.5 mt-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 rounded-full transition-all duration-300",
                        iconColorClass.replace('text-', 'bg-'),
                        signalStatus === 'awaiting' ? 'opacity-50' : 'opacity-100'
                      )}
                      style={{
                        height: `${8 + (pulsePhase === i ? 8 : Math.sin((pulsePhase + i) * 0.8) * 4 + 4)}px`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Pulsing rings for awaiting state */}
              {signalStatus === 'awaiting' && (
                <>
                  <div className={cn(
                    "absolute inset-0 rounded-3xl border-2 opacity-40",
                    iconColorClass.replace('text-', 'border-')
                  )} style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                  <div className={cn(
                    "absolute inset-[-8px] rounded-3xl border opacity-20",
                    iconColorClass.replace('text-', 'border-')
                  )} style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.5s' }} />
                </>
              )}
            </div>
          </div>

          {/* Signal Indicator */}
          <div className="mt-10 flex flex-col items-center gap-4">
            {/* Signal Light with glow */}
            <div className="relative">
              <div className={cn(
                "w-8 h-8 rounded-full transition-all duration-500",
                getSignalColor(),
                signalStatus !== 'awaiting' && getSignalGlow(),
                signalStatus === 'awaiting' && "animate-pulse"
              )} />
              {signalStatus === 'awaiting' && (
                <div className="absolute inset-0 rounded-full bg-muted animate-ping opacity-50" />
              )}
            </div>

            {/* Signal Status Text */}
            <div className="flex items-center gap-2">
              <Radio className={cn("w-4 h-4", signalInfo.color)} />
              <span className={cn("text-sm font-bold tracking-widest", signalInfo.color)}>
                {signalInfo.text}
              </span>
            </div>

            {/* Animated Signal Bars */}
            <div className="flex items-end gap-1.5 h-10">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2.5 rounded-t transition-all duration-500",
                    signalStatus === 'awaiting' ? "bg-muted" : 
                    signalStatus === 'pass' ? "bg-emerald-500" :
                    signalStatus === 'caution' && i < 3 ? "bg-amber-500" :
                    signalStatus === 'fail' && i < 1 ? "bg-red-500" : "bg-muted"
                  )}
                  style={{
                    height: signalStatus === 'awaiting' 
                      ? `${12 + Math.sin((pulsePhase + i) * 1.2) * 8 + i * 4}px`
                      : `${(i + 1) * 8}px`,
                    transition: 'height 0.3s ease-out'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Signal Type Info */}
        {signalType && (
          <div className="relative z-10 max-w-md mx-auto mt-4 p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className={cn("w-4 h-4", iconColorClass)} />
              <span className="text-sm font-semibold text-foreground">Signal Type</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">{signalType}</p>
          </div>
        )}

        {/* How It Works */}
        {howItWorks && (
          <div className="relative z-10 max-w-md mx-auto mt-4 p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Activity className={cn("w-4 h-4", iconColorClass)} />
              <span className="text-sm font-semibold text-foreground">How It Works</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">{howItWorks}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col gap-4 max-w-md mx-auto mt-8">
          <button
            onClick={handleUpload}
            className={cn(
              "w-full bg-card border rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-muted/50 active:bg-muted/70 transition-all touch-manipulation group",
              iconColorClass.replace('text-', 'border-').replace('-400', '-500/30'),
              "hover:shadow-lg"
            )}
          >
            <Upload className={cn("w-5 h-5 transition-transform group-hover:scale-110", iconColorClass)} />
            <span className="text-foreground font-medium">Upload Documentation</span>
          </button>

          <p className="text-center text-muted-foreground text-xs px-4">
            Upload your verification documents. Data is sent directly to the source of truth — 
            VALID™ acts as a conduit only. No data is stored locally.
          </p>
        </div>

        {/* API Connection Status */}
        <div className="relative z-10 mt-10 p-4 bg-card/50 rounded-xl border border-border max-w-md mx-auto backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm mb-2">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", iconColorClass.replace('text-', 'bg-'))} />
            <span className={iconColorClass}>API Connection Ready</span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            This verification channel is open and awaiting signals from the source of truth. 
            Once connected, status will update automatically in real-time.
          </p>
          
          {/* Connection wave animation */}
          <div className="mt-3 flex items-center gap-1">
            <Waves className={cn("w-4 h-4", iconColorClass)} />
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div 
                className={cn("h-full rounded-full", iconColorClass.replace('text-', 'bg-'))}
                style={{ 
                  width: '30%', 
                  animation: 'slideRight 2s ease-in-out infinite' 
                }}
              />
            </div>
          </div>
        </div>

        {/* CSS Keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes scanLine {
            0% { top: 0; opacity: 0; }
            10% { opacity: 0.5; }
            90% { opacity: 0.5; }
            100% { top: 100%; opacity: 0; }
          }
          @keyframes slideRight {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        `}</style>
      </div>
    </>
  );
};

export default VerificationSignalPage;