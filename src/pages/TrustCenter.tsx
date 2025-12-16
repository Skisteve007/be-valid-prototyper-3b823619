import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, ShieldCheck, ChevronLeft, Fingerprint, FlaskConical, Heart, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BackButton from '@/components/BackButton';

const TrustCenter: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [trustScore, setTrustScore] = useState(0);
  const [statuses, setStatuses] = useState({
    id: 'none' as 'verified' | 'pending' | 'none',
    healthLab: 'none' as 'verified' | 'pending' | 'none',
    toxicology: 'none' as 'verified' | 'pending' | 'none'
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
          toxicology: toxStatus as 'verified' | 'pending' | 'none'
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
        Not Started
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Trust Center | Valid™</title>
        <meta name="description" content="Manage your verification credentials and trust score" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-4">
          <BackButton />
          <h1 className="text-2xl font-bold tracking-wide">Trust Center</h1>
        </div>
        
        {/* Page Description */}
        <p className="text-muted-foreground text-sm mb-6">
          Your verification hub. Build your trust score by completing identity checks — all verified in real-time, never stored.
        </p>

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
      </div>
    </>
  );
};

export default TrustCenter;
