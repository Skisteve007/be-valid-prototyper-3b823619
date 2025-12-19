import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, ChevronDown, Fingerprint, FlaskConical, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TrustCenterPillProps {
  userId?: string;
  isVerified?: boolean;
  healthLabStatus?: 'verified' | 'pending' | 'none';
  toxicologyStatus?: 'verified' | 'pending' | 'none';
  idStatus?: 'verified' | 'pending' | 'none';
}

const TrustCenterPill: React.FC<TrustCenterPillProps> = ({
  userId,
  isVerified = false,
  healthLabStatus = 'none',
  toxicologyStatus = 'none',
  idStatus = 'none'
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [statuses, setStatuses] = useState({
    healthLab: healthLabStatus,
    toxicology: toxicologyStatus,
    id: idStatus
  });

  // Fetch actual verification statuses
  useEffect(() => {
    if (userId) {
      fetchStatuses();
    }
  }, [userId]);

  const fetchStatuses = async () => {
    if (!userId) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('idv_status, lab_certified, health_document_url')
        .eq('user_id', userId)
        .single();

      if (profile) {
        setStatuses({
          id: profile.idv_status === 'verified' ? 'verified' : profile.idv_status === 'pending' ? 'pending' : 'none',
          healthLab: profile.lab_certified ? 'verified' : profile.health_document_url ? 'pending' : 'none',
          toxicology: 'none' // Would need separate toxicology tracking
        });
      }
    } catch (error) {
      console.error('Failed to fetch trust statuses:', error);
    }
  };

  // Navigate directly to Trust Center upload page
  const handlePillClick = () => {
    navigate('/trust-center');
  };

  // Navigate to Trust Center full page
  const handleTrustCenterNav = () => {
    navigate('/trust-center');
  };

  // Navigate to specific verification pages
  const handleHealthLab = () => {
    navigate('/lab-kit-order');
  };

  const handleToxicology = () => {
    navigate('/toxicology-kit-order');
  };

  const handleVerifyID = () => {
    navigate('/idv-verification');
  };

  // Status indicator component
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
        <Shield className="w-3 h-3" />
        Not Started
      </span>
    );
  };

  const overallVerified = statuses.id === 'verified' && statuses.healthLab === 'verified';

  return (
    <div className="block w-full">
      {/* MAIN PILL - CLICKABLE ON MOBILE & DESKTOP */}
      <button
        onClick={handlePillClick}
        className="w-full bg-card border-2 border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation shadow-[0_0_20px_rgba(0,240,255,0.15)]"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="flex items-center gap-3">
          {/* Shield Icon */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            overallVerified 
              ? 'bg-emerald-500/20 border border-emerald-500/50' 
              : 'bg-cyan-500/20 border border-cyan-500/50'
          }`}>
            <ShieldCheck className={`w-5 h-5 ${overallVerified ? 'text-emerald-400' : 'text-cyan-400'}`} />
          </div>
          
          <div className="text-left">
            <div className="text-foreground font-semibold text-base tracking-wide">Trust Center</div>
            <div className="text-muted-foreground text-xs">
              {overallVerified ? 'Fully Verified' : 'Tap to verify'}
            </div>
          </div>
        </div>

        {/* Expand/Collapse Arrow */}
        <ChevronDown 
          className={`w-6 h-6 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* EXPANDED CONTENT - SUB-BUTTONS */}
      {isExpanded && (
        <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
          
          {/* Health Lab Button */}
          <button
            onClick={handleHealthLab}
            className="w-full bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                <Heart className="w-4 h-4 text-destructive" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-medium text-sm">Health Lab</div>
                <StatusBadge status={statuses.healthLab} />
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90" />
          </button>

          {/* Toxicology Button */}
          <button
            onClick={handleToxicology}
            className="w-full bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-medium text-sm">Toxicology</div>
                <StatusBadge status={statuses.toxicology} />
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90" />
          </button>

          {/* Verify ID Button */}
          <button
            onClick={handleVerifyID}
            className="w-full bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 active:bg-muted/70 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Fingerprint className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-medium text-sm">Verify ID</div>
                <StatusBadge status={statuses.id} />
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90" />
          </button>

          {/* View All / Trust Center Page Link */}
          <button
            onClick={handleTrustCenterNav}
            className="w-full bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 active:bg-cyan-500/30 transition touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            View Full Trust Center →
          </button>
        </div>
      )}
    </div>
  );
};

export default TrustCenterPill;
