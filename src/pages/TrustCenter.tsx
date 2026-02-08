import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, ShieldCheck, ChevronLeft, Fingerprint, FlaskConical, Heart, Lock, Ear, Eye, Apple, Hand, Wind, Upload, Radio, Droplets, Ghost, Database, Wifi } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BackButton from '@/components/BackButton';
import { toast } from 'sonner';

const TrustCenter: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [trustScore, setTrustScore] = useState(0);
  const [statuses, setStatuses] = useState({
    id: 'none' as 'verified' | 'pending' | 'none',
    healthLab: 'none' as 'verified' | 'pending' | 'none',
    toxicology: 'none' as 'verified' | 'pending' | 'none',
    audiology: 'none' as 'verified' | 'pending' | 'none',
    visual: 'none' as 'verified' | 'pending' | 'none',
    taste: 'none' as 'verified' | 'pending' | 'none',
    touch: 'none' as 'verified' | 'pending' | 'none',
    olfactory: 'none' as 'verified' | 'pending' | 'none',
    atmospheric: 'none' as 'verified' | 'pending' | 'none'
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUserId(session.user.id);
    fetchStatuses(session.user.id);
  };

  const fetchStatuses = async (uid: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('idv_status, lab_certified, health_document_url')
        .eq('user_id', uid)
        .single();

      if (profile) {
        const idStatus = profile.idv_status === 'verified' ? 'verified' : profile.idv_status === 'pending' ? 'pending' : 'none';
        const healthLabStatus = profile.lab_certified ? 'verified' : profile.health_document_url ? 'pending' : 'none';
        const toxStatus: 'verified' | 'pending' | 'none' = 'none'; // TODO: Add toxicology tracking
        
        setStatuses({
          id: idStatus as 'verified' | 'pending' | 'none',
          healthLab: healthLabStatus as 'verified' | 'pending' | 'none',
          toxicology: toxStatus as 'verified' | 'pending' | 'none',
          audiology: 'none', // Signal from API source of truth
          visual: 'none', // Signal from API source of truth
          taste: 'none', // Signal from API source of truth
          touch: 'none', // Signal from API source of truth
          olfactory: 'none', // Signal from API source of truth (pheromone detection)
          atmospheric: 'none' // Signal from API source of truth
        });
        
        // Calculate trust score
        let score = 25; // Base score
        if (idStatus === 'verified') score += 35;
        else if (idStatus === 'pending') score += 15;
        if (healthLabStatus === 'verified') score += 25;
        else if (healthLabStatus === 'pending') score += 10;
        // Toxicology score would be added here when tracking is implemented
        setTrustScore(score);
      }
    } catch (error) {
      console.error('Failed to fetch trust statuses:', error);
    }
  };

  const StatusBadge = ({ status }: { status: 'verified' | 'pending' | 'none' }) => {
    if (status === 'verified') {
      return (
        <span className="flex items-center gap-1 text-emerald-400 text-xs">
          <ShieldCheck className="w-3 h-3" />
          Verified
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="flex items-center gap-1 text-amber-400 text-xs">
          <Shield className="w-3 h-3" />
          Pending
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-muted-foreground text-xs">
        <Radio className="w-3 h-3" />
        Awaiting Signal
      </span>
    );
  };

  // Handler for signal-based verification (API conduit)
  const handleSignalVerification = (type: string) => {
    toast.info(`${type} verification ready`, {
      description: 'Awaiting signal from source of truth. Upload supported for manual verification.',
    });
  };

  // Handler for document upload (goes to API source of truth)
  const handleUpload = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Upload for ${type}`, {
      description: 'Document will be sent to source of truth for verification. No data stored locally.',
    });
    // TODO: Implement file upload that sends to API source of truth
  };

  return (
    <>
      <Helmet>
        <title>Trust Center | Valid™</title>
        <meta name="description" content="Manage your verification credentials and trust score" />
      </Helmet>
      
      <div
        className="min-h-screen overflow-y-auto bg-background text-foreground p-4 md:p-8 pt-20 md:pt-24"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-4">
          <BackButton />
          <h1 className="text-2xl font-bold tracking-wide">Trust Center</h1>
        </div>
        
        {/* Page Description */}
        <p className="text-muted-foreground text-sm mb-4">
          Your verification hub. Build your trust score by completing identity checks — all verified in real-time, never stored.
        </p>

        {/* Verification Credentials */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Verification Credentials
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Principal Cargo + client audit controls (B2C). Venue/admin operations remain separate (B2B).
          </p>
        </div>

        {/* GhostPass Portal - Primary Entry Point (B2C) */}
        <button
          type="button"
          onClick={() => navigate('/trust-center/ghostpass-portal')}
          className="w-full rounded-2xl p-5 flex items-center justify-between border-2 transition touch-manipulation mb-6 bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20 active:bg-amber-500/30 shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          data-testid="ghostpass-portal-pill"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
              <Ghost className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-left">
              <div className="text-foreground font-semibold">GhostPass Portal</div>
              <p className="text-muted-foreground text-xs">Client audit logs & sharing controls (B2C)</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Database className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-amber-400">Tokens</span>
                <span className="text-muted-foreground/50">•</span>
                <Wifi className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-amber-400">Real-time Sync</span>
              </div>
            </div>
          </div>
          <ChevronLeft className="w-6 h-6 text-amber-400 rotate-180" />
        </button>

        {/* Trust Score */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-2xl p-6 border border-cyan-500/30 mb-6 text-center">
          <div className="text-6xl font-bold text-foreground mb-2">{trustScore}</div>
          <div className="text-cyan-400 text-sm font-medium">Trust Score</div>
          <div className="text-muted-foreground text-xs mt-2">Complete all verifications to reach 100</div>
        </div>

        {/* Verification Options */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/idv-verification')}
            className="w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">Verify ID</div>
                <StatusBadge status={statuses.id} />
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-muted-foreground rotate-180" />
          </button>

          <button
            onClick={() => navigate('/lab-kit-order')}
            className="w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-destructive" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">Health Lab</div>
                <StatusBadge status={statuses.healthLab} />
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-muted-foreground rotate-180" />
          </button>

          <button
            onClick={() => navigate('/toxicology-kit-order')}
            className="w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">Toxicology</div>
                <StatusBadge status={statuses.toxicology} />
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-muted-foreground rotate-180" />
          </button>

          {/* Sensory Verification Section */}
          <div className="pt-4 pb-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sensory Verification</h2>
            <p className="text-xs text-muted-foreground mt-1">Signal conduit — no data stored, only verification signals received</p>
          </div>

          {/* Audiology */}
          <button
            onClick={() => navigate('/verification/audiology')}
            className="w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Ear className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">Audiology</div>
                <p className="text-muted-foreground text-xs max-w-[200px]">Hearing acuity & auditory processing assessment</p>
                <StatusBadge status={statuses.audiology} />
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-muted-foreground rotate-180" />
          </button>

          {/* Visual */}
          <button
            onClick={() => navigate('/verification/visual')}
            className="w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">Visual</div>
                <p className="text-muted-foreground text-xs max-w-[200px]">Ophthalmic health & vision clarity verification</p>
                <StatusBadge status={statuses.visual} />
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-muted-foreground rotate-180" />
          </button>

          {/* Taste */}
          <button
            onClick={() => navigate('/verification/taste')}
            className="w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center">
                <Apple className="w-6 h-6 text-rose-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">Taste Sense</div>
                <p className="text-muted-foreground text-xs max-w-[200px]">Gustatory function & taste receptor sensitivity</p>
                <StatusBadge status={statuses.taste} />
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-muted-foreground rotate-180" />
          </button>

          {/* Touch */}
          <button
            onClick={() => navigate('/verification/touch')}
            className="w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Hand className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">Touch Sense</div>
                <p className="text-muted-foreground text-xs max-w-[200px]">Tactile perception & nerve response testing</p>
                <StatusBadge status={statuses.touch} />
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-muted-foreground rotate-180" />
          </button>

          {/* Olfactory (Smell/Pheromones) */}
          <button
            onClick={() => navigate('/verification/olfactory')}
            className="w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">Olfactory</div>
                <p className="text-muted-foreground text-xs max-w-[200px]">Pheromone signature & scent receptor analysis</p>
                <StatusBadge status={statuses.olfactory} />
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-muted-foreground rotate-180" />
          </button>

          {/* Atmospheric Balance */}
          <button
            onClick={() => navigate('/verification/atmospheric')}
            className="w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Wind className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">Atmospheric Balance</div>
                <p className="text-muted-foreground text-xs max-w-[200px]">Environmental equilibrium & biometric harmony</p>
                <StatusBadge status={statuses.atmospheric} />
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-muted-foreground rotate-180" />
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-8 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-2 text-cyan-400 text-sm mb-2">
            <Lock className="w-4 h-4" />
            Privacy Protected
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            All verification data is processed in real-time and immediately purged. VALID™ is a conduit, not a warehouse. 
            You control who sees your trust score.
          </p>
        </div>

        {/* AI Governance Section */}
        <div className="mt-6 p-4 bg-card rounded-xl border border-cyan-500/30">
          <div className="flex items-center gap-2 text-cyan-400 text-sm mb-2">
            <Shield className="w-4 h-4" />
            AI Governance
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed mb-3">
            SYNTH™ provides enterprise-grade AI governance: policy enforcement, audit logs, and proof records for every AI-assisted decision.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate('/synth/logs')}
              className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition"
            >
              View Audit Logs
            </button>
            <button
              onClick={() => navigate('/synth/docs')}
              className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition"
            >
              SYNTH™ Docs
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrustCenter;
