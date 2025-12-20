import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Lock, Check, Unlock, Shield, TrendingUp, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SynthLocked = () => {
  const navigate = useNavigate();

  const keepBenefits = [
    { icon: Shield, text: 'Your Codename' },
    { icon: TrendingUp, text: 'Your last verified SYNTH Index snapshot' },
    { icon: Target, text: 'Your Dossier shell' },
  ];

  const unlockBenefits = [
    { icon: Calendar, text: '7/30/60/90-day ranking windows' },
    { icon: TrendingUp, text: 'Trend + consistency metrics' },
    { icon: Target, text: 'Protocol checkpoints every 7–14 days' },
  ];

  const pricingOptions = [
    { label: '7D', days: 7, price: '$4.99', recommended: false },
    { label: '30D', days: 30, price: '$14.99', recommended: true },
    { label: '60D', days: 60, price: '$24.99', recommended: false },
    { label: '90D', days: 90, price: '$34.99', recommended: false },
  ];

  return (
    <>
      <Helmet>
        <title>CALIBRATION COMPLETE - SYNTH Board™ | Valid™</title>
        <meta name="description" content="Your calibration window has ended. Unlock a ranking window to continue." />
      </Helmet>

      <div className="min-h-screen synth-bg text-foreground font-electrolize relative overflow-hidden">
        {/* Star noise background */}
        <div className="fixed inset-0 z-0 synth-grid opacity-30" />
        
        {/* Mars dust gradient - more severe tone */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 30%, rgba(239, 68, 68, 0.06), transparent 50%),
              radial-gradient(ellipse at 30% 70%, rgba(183, 65, 14, 0.08), transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.7), transparent 80%)
            `,
          }}
        />

        {/* Header bar */}
        <header className="fixed top-0 left-0 right-0 z-50 synth-header px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/synth')}
                className="p-2 rounded-full bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 transition"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
              </button>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">SYNTH BOARD</span>
            </div>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 pt-20 pb-12 px-4 flex items-center justify-center min-h-screen">
          <div 
            className="w-full max-w-[640px] synth-card rounded-2xl p-8 border border-amber-500/20"
            style={{
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 40px rgba(245, 158, 11, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
            }}
          >
            {/* Title section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-3 tracking-wide">
                CALIBRATION COMPLETE
              </h1>
              <p className="text-muted-foreground">
                Official ranking requires an active window.
              </p>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left column - What you keep */}
              <div 
                className="p-5 rounded-xl border border-cyan-500/20"
                style={{ background: 'rgba(0, 212, 255, 0.03)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-sm font-bold text-cyan-400 tracking-wider uppercase">YOU KEEP</h2>
                </div>
                <ul className="space-y-3">
                  {keepBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <benefit.icon className="w-4 h-4 text-cyan-400/60 flex-shrink-0" />
                      <span>{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right column - What unlocks */}
              <div 
                className="p-5 rounded-xl border border-amber-500/20"
                style={{ background: 'rgba(245, 158, 11, 0.03)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Unlock className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm font-bold text-amber-400 tracking-wider uppercase">UNLOCK</h2>
                </div>
                <ul className="space-y-3">
                  {unlockBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <benefit.icon className="w-4 h-4 text-amber-400/60 flex-shrink-0" />
                      <span>{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pricing grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {pricingOptions.map((option) => (
                <Button
                  key={option.label}
                  variant="outline"
                  className={`relative h-auto py-4 px-4 flex flex-col items-center gap-1 transition-all ${
                    option.recommended 
                      ? 'border-cyan-500/60 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400' 
                      : 'border-muted/30 bg-transparent hover:bg-muted/10 hover:border-muted/50'
                  }`}
                  onClick={() => {
                    // Future: handle payment
                    console.log(`Selected ${option.days} day plan`);
                  }}
                >
                  {option.recommended && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold bg-cyan-500 text-background rounded-full">
                      RECOMMENDED
                    </span>
                  )}
                  <span className={`text-lg font-bold ${option.recommended ? 'text-cyan-400' : 'text-foreground'}`}>
                    UNLOCK {option.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{option.price}</span>
                </Button>
              ))}
            </div>

            <p className="text-xs text-center text-muted-foreground mb-6">
              Recommended: <span className="text-cyan-400">30D</span> for real signal.
            </p>

            {/* Footer */}
            <div className="pt-6 border-t border-cyan-500/10">
              <p className="text-xs text-muted-foreground text-center italic">
                Reason codes remain auditable under the active policy. — <span className="text-cyan-400/70">SYNTH Board</span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SynthLocked;
