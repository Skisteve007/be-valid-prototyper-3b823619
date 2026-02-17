import { useNavigate } from 'react-router-dom';
import { AuditTrail } from '@/components/admin/AuditTrail';
import { SteveOwnerGate } from '@/components/SteveOwnerGate';
import { useEnsureUserSync } from '@/hooks/useEnsureUserSync';
import { AlertCircle } from 'lucide-react';

const AuditTrailPage = () => {
  const navigate = useNavigate();
  const from = new URLSearchParams(window.location.search).get('from') || '/trust-center/ghostpass-portal';
  
  // Ensure user is synced to ghost-pass database
  const { syncing, synced, error } = useEnsureUserSync();

  if (syncing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Syncing user to Ghost Pass database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">User Sync Error</h2>
          <p className="text-slate-400 text-sm">
            Failed to sync your account to Ghost Pass database. Please try again or contact support.
          </p>
          <p className="text-red-400 text-xs font-mono">{error}</p>
          <button
            onClick={() => navigate(from)}
            className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <SteveOwnerGate>
      <AuditTrail onBack={() => navigate(from)} />
    </SteveOwnerGate>
  );
};

export default AuditTrailPage;
