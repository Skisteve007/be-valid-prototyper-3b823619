import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsSteveOwner } from '@/hooks/useIsSteveOwner';
import { Shield, Lock } from 'lucide-react';

interface SteveOwnerGateProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const SteveOwnerGate = ({ children, fallbackPath = '/' }: SteveOwnerGateProps) => {
  const { isSteveOwner, loading } = useIsSteveOwner();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isSteveOwner) {
      // Log unauthorized access attempt
      console.warn('[SECURITY] Unauthorized Tier-0 access attempt blocked');
      navigate(fallbackPath, { replace: true });
    }
  }, [isSteveOwner, loading, navigate, fallbackPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Shield className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isSteveOwner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center p-8">
          <div className="p-4 rounded-full bg-destructive/10 border border-destructive/30">
            <Lock className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            This area is restricted to authorized personnel only. 
            If you believe you should have access, please contact the system administrator.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-4">
            Error Code: 403 — Tier-0 Access Required
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
