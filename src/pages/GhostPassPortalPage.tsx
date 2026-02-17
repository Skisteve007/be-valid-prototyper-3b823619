import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { CommandCenterTab } from '@/components/admin/CommandCenterTab';
import { Shield, AlertCircle } from 'lucide-react';
import { useEnsureUserSync } from '@/hooks/useEnsureUserSync';

const GhostPassPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Ensure user is synced to ghost-pass database
  const { syncing: userSyncing, synced: userSynced, error: syncError } = useEnsureUserSync();

  useEffect(() => {
    // DEV MODE: Skip admin check for development
    const DEV_SKIP_AUTH = import.meta.env.VITE_DEV_SKIP_AUTH === 'true';
    
    if (DEV_SKIP_AUTH) {
      console.warn('⚠️ DEV MODE: Admin check disabled for Ghost Pass Command Center');
      setIsAdmin(true);
      setUserId('dev-user');
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Check if user has admin role
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'administrator')
        .maybeSingle();

      if (error || !roleData) {
        // Not an admin, redirect to dashboard
        console.log('User is not an admin, redirecting to dashboard');
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
      setUserId(session.user.id);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading || userSyncing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">
            {userSyncing ? 'Syncing user to Ghost Pass database...' : 'Verifying admin access...'}
          </p>
        </div>
      </div>
    );
  }

  if (syncError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">User Sync Error</h2>
          <p className="text-slate-400 text-sm">
            Failed to sync your account to Ghost Pass database. Please try again or contact support.
          </p>
          <p className="text-red-400 text-xs font-mono">{syncError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin || !userId) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Helmet>
        <title>Ghost Pass Command Center | Valid™</title>
        <meta name="description" content="Ghost Pass Command Center — operations and audit hub for tokens, scans, and permissions" />
      </Helmet>
      
      <div className="min-h-screen bg-slate-950 text-white pt-24 md:pt-32">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="text-red-400" size={32} />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                Ghost Pass Command Center
              </h1>
            </div>
            <p className="text-slate-400 text-sm md:text-base">
              Operations and audit hub for tokens, scans, and permissions
            </p>
          </div>

          {/* Command Center Content */}
          <CommandCenterTab />
        </div>
      </div>
    </>
  );
};

export default GhostPassPortalPage;
