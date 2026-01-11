import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Radio, Upload, ChevronLeft } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { cn } from '@/lib/utils';

type SignalStatus = 'awaiting' | 'pass' | 'caution' | 'fail';

interface VerificationSignalPageProps {
  title: string;
  scientificName?: string;
  description: string;
  icon: React.ReactNode;
  iconColorClass: string;
  glowColorClass: string;
}

const VerificationSignalPage: React.FC<VerificationSignalPageProps> = ({
  title,
  scientificName,
  description,
  icon,
  iconColorClass,
  glowColorClass
}) => {
  const navigate = useNavigate();
  const [signalStatus, setSignalStatus] = useState<SignalStatus>('awaiting');
  const [isGlowing, setIsGlowing] = useState(true);

  // Simulate awaiting signal with pulsing glow
  useEffect(() => {
    if (signalStatus === 'awaiting') {
      const interval = setInterval(() => {
        setIsGlowing(prev => !prev);
      }, 1500);
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
        return 'shadow-[0_0_30px_rgba(16,185,129,0.6)]';
      case 'caution':
        return 'shadow-[0_0_30px_rgba(245,158,11,0.6)]';
      case 'fail':
        return 'shadow-[0_0_30px_rgba(239,68,68,0.6)]';
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

      <div className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-20 md:pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
            {scientificName && (
              <p className="text-muted-foreground text-sm">{scientificName}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-8 ml-12">
          {description}
        </p>

        {/* Central Glowing Pill Box */}
        <div className="flex flex-col items-center justify-center py-12">
          <div
            className={cn(
              "relative w-40 h-40 rounded-3xl flex items-center justify-center transition-all duration-1000",
              glowColorClass,
              signalStatus === 'awaiting' && isGlowing && "shadow-[0_0_40px_rgba(0,200,255,0.5)]",
              signalStatus !== 'awaiting' && getSignalGlow()
            )}
          >
            {/* Inner pill content */}
            <div className={cn(
              "w-32 h-32 rounded-2xl bg-card border-2 border-border flex items-center justify-center transition-all duration-500",
              signalStatus === 'awaiting' && isGlowing && "border-cyan-500/50"
            )}>
              <div className={iconColorClass}>
                {icon}
              </div>
            </div>

            {/* Pulsing ring for awaiting state */}
            {signalStatus === 'awaiting' && (
              <div className={cn(
                "absolute inset-0 rounded-3xl border-2 border-cyan-500/30 animate-ping",
                !isGlowing && "opacity-0"
              )} />
            )}
          </div>

          {/* Signal Indicator */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {/* Signal Light */}
            <div className={cn(
              "w-6 h-6 rounded-full transition-all duration-500",
              getSignalColor(),
              signalStatus !== 'awaiting' && getSignalGlow(),
              signalStatus === 'awaiting' && "animate-pulse"
            )} />

            {/* Signal Status Text */}
            <div className="flex items-center gap-2">
              <Radio className={cn("w-4 h-4", signalInfo.color)} />
              <span className={cn("text-sm font-medium tracking-wider", signalInfo.color)}>
                {signalInfo.text}
              </span>
            </div>

            {/* Signal Bars */}
            <div className="flex items-end gap-1 h-8">
              <div className={cn(
                "w-2 rounded-t transition-all duration-300",
                signalStatus === 'awaiting' ? "h-2 bg-muted animate-pulse" : "h-2",
                signalStatus === 'pass' && "bg-emerald-500 h-2",
                signalStatus === 'caution' && "bg-amber-500 h-2",
                signalStatus === 'fail' && "bg-red-500 h-2"
              )} />
              <div className={cn(
                "w-2 rounded-t transition-all duration-300",
                signalStatus === 'awaiting' ? "h-4 bg-muted animate-pulse" : "h-4",
                signalStatus === 'pass' && "bg-emerald-500 h-4",
                signalStatus === 'caution' && "bg-amber-500 h-4",
                signalStatus === 'fail' && "bg-muted h-4"
              )} />
              <div className={cn(
                "w-2 rounded-t transition-all duration-300",
                signalStatus === 'awaiting' ? "h-6 bg-muted animate-pulse" : "h-6",
                signalStatus === 'pass' && "bg-emerald-500 h-6",
                signalStatus === 'caution' && "bg-muted h-6",
                signalStatus === 'fail' && "bg-muted h-6"
              )} />
              <div className={cn(
                "w-2 rounded-t transition-all duration-300",
                signalStatus === 'awaiting' ? "h-8 bg-muted animate-pulse" : "h-8",
                signalStatus === 'pass' && "bg-emerald-500 h-8",
                signalStatus === 'caution' && "bg-muted h-8",
                signalStatus === 'fail' && "bg-muted h-8"
              )} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 max-w-md mx-auto mt-8">
          <button
            onClick={handleUpload}
            className="w-full bg-card border border-border rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
          >
            <Upload className="w-5 h-5 text-cyan-400" />
            <span className="text-foreground font-medium">Upload Documentation</span>
          </button>

          <p className="text-center text-muted-foreground text-xs px-4">
            Upload your verification documents. Data is sent directly to the source of truth — 
            VALID™ acts as a conduit only. No data is stored locally.
          </p>
        </div>

        {/* API Connection Status */}
        <div className="mt-12 p-4 bg-card rounded-xl border border-border max-w-md mx-auto">
          <div className="flex items-center gap-2 text-cyan-400 text-sm mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            API Connection Ready
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            This verification channel is open and awaiting signals from the source of truth. 
            Once connected, status will update automatically.
          </p>
        </div>
      </div>
    </>
  );
};

export default VerificationSignalPage;