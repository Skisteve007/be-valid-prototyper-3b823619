import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, TrendingUp, Target, Calendar, Award } from 'lucide-react';
import SynthDossierHeader from '@/components/synth/SynthDossierHeader';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SynthDossier = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [codename, setCodename] = useState('INITIATE-Σ00');
  const [tier, setTier] = useState('INITIATE');
  const [synthIndex, setSynthIndex] = useState(72.4);
  const [percentile, setPercentile] = useState(15);
  const [integrityScore, setIntegrityScore] = useState(94);
  const [windowDays, setWindowDays] = useState<7 | 30 | 60 | 90>(30);
  const [policyVersion, setPolicyVersion] = useState('v2.1.0');

  useEffect(() => {
    const fetchDossierData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // Get profile for codename
        const { data: profile } = await supabase
          .from('profiles')
          .select('synth_codename')
          .eq('user_id', user.id)
          .single();

        if (profile?.synth_codename) {
          setCodename(profile.synth_codename);
          // Derive tier from codename
          const tierPart = profile.synth_codename.split('-')[0];
          setTier(tierPart || 'INITIATE');
        }

        // Get entitlement for window info
        const { data: entitlement } = await supabase
          .rpc('get_or_create_synth_entitlement', { p_user_id: user.id });

        if (entitlement) {
          // If trial, locked, or no active plan, redirect to locked
          if (entitlement.plan === 'trial_24h' && entitlement.runs_remaining <= 0) {
            navigate('/synth/locked');
            return;
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dossier:', err);
        setLoading(false);
      }
    };

    fetchDossierData();
  }, [navigate]);

  const handleShareBadge = () => {
    toast.success('Badge link copied to clipboard');
  };

  const handleExportDossier = () => {
    toast.success('Dossier export started');
  };

  const handleDeleteData = () => {
    toast.error('Data deletion requires confirmation via email');
  };

  const handleExportData = () => {
    toast.success('Data export initiated');
  };

  if (loading) {
    return (
      <div className="min-h-screen synth-bg flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Loading dossier...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>SYNTH DOSSIER - {codename} | Valid™</title>
        <meta name="description" content="Your personal SYNTH dossier with tier, index, and performance metrics." />
      </Helmet>

      <div className="min-h-screen synth-bg text-foreground font-electrolize relative overflow-hidden">
        {/* Star noise background */}
        <div className="fixed inset-0 z-0 synth-grid opacity-30" />
        
        {/* Mars dust gradient */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.06), transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(183, 65, 14, 0.05), transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.6), transparent 80%)
            `,
          }}
        />

        {/* Header bar */}
        <header className="fixed top-0 left-0 right-0 z-50 synth-header px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/synth')}
                className="p-2 rounded-full bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 transition"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
              </button>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">SYNTH BOARD</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 pt-20 pb-12 px-4 max-w-6xl mx-auto">
          {/* Dossier Header */}
          <SynthDossierHeader
            codename={codename}
            tier={tier}
            synthIndex={synthIndex}
            percentile={percentile}
            integrityScore={integrityScore}
            windowDays={windowDays}
            policyVersion={policyVersion}
            isAnonymous={true}
            onShareBadge={handleShareBadge}
            onExportDossier={handleExportDossier}
            onDeleteData={handleDeleteData}
            onExportData={handleExportData}
          />

          {/* Dossier content sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Trend card */}
            <div className="synth-card rounded-xl p-5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-foreground tracking-wider">TREND</h3>
              </div>
              <div className="text-3xl font-mono font-bold text-emerald-400 mb-1">+12.6</div>
              <p className="text-xs text-muted-foreground">vs. 30 days ago</p>
            </div>

            {/* Consistency card */}
            <div className="synth-card rounded-xl p-5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-foreground tracking-wider">CONSISTENCY</h3>
              </div>
              <div className="text-3xl font-mono font-bold text-amber-400 mb-1">87%</div>
              <p className="text-xs text-muted-foreground">Response pattern stability</p>
            </div>

            {/* Next checkpoint card */}
            <div className="synth-card rounded-xl p-5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-foreground tracking-wider">NEXT CHECKPOINT</h3>
              </div>
              <div className="text-3xl font-mono font-bold text-purple-400 mb-1">6d</div>
              <p className="text-xs text-muted-foreground">Protocol mission in 6 days</p>
            </div>

            {/* Achievements card */}
            <div className="synth-card rounded-xl p-5 border border-cyan-500/20 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-foreground tracking-wider">RECENT ACHIEVEMENTS</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  First Calibration
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Top 20% Run
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  7-Day Streak
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SynthDossier;
