import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Shield, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const SynthAccepted = () => {
  const navigate = useNavigate();
  const [codename, setCodename] = useState<string>('INITIATE-Σ00');
  const [clearanceId, setClearanceId] = useState<string>('SYN-0000');
  const [runsRemaining, setRunsRemaining] = useState<number>(10);
  const [timeRemaining, setTimeRemaining] = useState<string>('24:00:00');
  const [showStamp, setShowStamp] = useState(false);
  const [showCodename, setShowCodename] = useState(false);

  useEffect(() => {
    const fetchEntitlement = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get profile for codename
      const { data: profile } = await supabase
        .from('profiles')
        .select('synth_codename')
        .eq('user_id', user.id)
        .single();

      if (profile?.synth_codename) {
        setCodename(profile.synth_codename);
      }

      // Generate clearance ID from user id
      setClearanceId(`SYN-${user.id.substring(0, 4).toUpperCase()}`);

      // Get entitlement
      const { data: entitlement } = await supabase
        .rpc('get_or_create_synth_entitlement', { p_user_id: user.id });

      if (entitlement) {
        setRunsRemaining(entitlement.runs_remaining || 10);
        const expiresAt = new Date(entitlement.expires_at);
        const now = new Date();
        const diff = expiresAt.getTime() - now.getTime();
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }
    };

    fetchEntitlement();

    // Animation sequence
    const stampTimer = setTimeout(() => setShowStamp(true), 200);
    const codenameTimer = setTimeout(() => setShowCodename(true), 500);

    return () => {
      clearTimeout(stampTimer);
      clearTimeout(codenameTimer);
    };
  }, []);

  const progressPercentage = (runsRemaining / 10) * 100;

  return (
    <>
      <Helmet>
        <title>ACCEPTED - SYNTH Board™ | Valid™</title>
        <meta name="description" content="Initiate status confirmed. Begin calibration protocol." />
      </Helmet>

      <div className="min-h-screen synth-bg text-foreground font-electrolize relative overflow-hidden">
        {/* Star noise background */}
        <div className="fixed inset-0 z-0 synth-grid opacity-30" />
        
        {/* Mars dust gradient overlay */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 70%, rgba(183, 65, 14, 0.08), transparent 50%),
              radial-gradient(ellipse at 70% 30%, rgba(0, 212, 255, 0.06), transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.6), transparent 80%)
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
            <span className="text-xs font-mono text-cyan-400/70">CLEARANCE ID: {clearanceId}</span>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 pt-20 pb-12 px-4 flex items-center justify-center min-h-screen">
          <div 
            className="w-full max-w-[560px] synth-card rounded-2xl p-8 border border-cyan-500/20"
            style={{
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 40px rgba(0, 212, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
            }}
          >
            {/* Row 1: Stamp row */}
            <div className="flex items-center justify-between mb-6">
              <div 
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 ${
                  showStamp ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{
                  background: 'rgba(183, 65, 14, 0.25)',
                  border: '1px solid rgba(183, 65, 14, 0.6)',
                  color: '#e07b4f',
                  boxShadow: '0 0 15px rgba(183, 65, 14, 0.3)'
                }}
              >
                ACCEPTED
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                INITIATE STATUS
              </div>
            </div>

            {/* Row 2: Title */}
            <h1 className="text-2xl font-bold text-foreground mb-8 tracking-wide">
              ACCEPTED: <span className="text-cyan-400">INITIATE STATUS</span>
            </h1>

            {/* Row 3: Codename block */}
            <div 
              className={`mb-8 transition-all duration-500 ${
                showCodename ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">CODENAME ASSIGNED</p>
              <p 
                className="text-3xl font-mono font-bold synth-neon-blue mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {codename}
              </p>
              <p className="text-sm text-muted-foreground">Identity not required for public ranking.</p>
            </div>

            {/* Row 4: Calibration meter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-foreground font-medium">CALIBRATION WINDOW</span>
                </div>
              </div>
              
              <div className="relative h-3 synth-progress rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full synth-progress-bar rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400">{runsRemaining}/10 RUNS</span>
                <span className="font-mono text-amber-400">{timeRemaining} LEFT</span>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3">
                Calibration runs generate your initial SYNTH Index baseline.
              </p>
            </div>

            {/* Row 5: Primary CTA */}
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/synth/console')}
                className="w-full synth-btn-primary font-bold text-base py-6 synth-pulse"
              >
                <Zap className="w-5 h-5 mr-2" />
                BEGIN CALIBRATION
              </Button>
              
              <button 
                onClick={() => navigate('/synth/policies')}
                className="w-full text-center text-sm text-cyan-400/70 hover:text-cyan-400 transition underline-offset-4 hover:underline"
              >
                VIEW PRIVACY & DATA USE
              </button>
            </div>

            {/* Row 6: Footer */}
            <div className="mt-8 pt-6 border-t border-cyan-500/10">
              <p className="text-xs text-muted-foreground text-center italic">
                Rank is earned over time. — <span className="text-cyan-400/70">SYNTH Board</span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SynthAccepted;
