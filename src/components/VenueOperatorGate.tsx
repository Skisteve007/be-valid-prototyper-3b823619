import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsVenueOperator } from '@/hooks/useIsVenueOperator';
import { Shield, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VenueOperatorGateProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const VenueOperatorGate = ({ children, fallbackPath = '/' }: VenueOperatorGateProps) => {
  const { isVenueOperator, loading, userEmail } = useIsVenueOperator();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isVenueOperator) {
      console.warn('[SECURITY] Unauthorized venue operator access attempt blocked');
    }
  }, [isVenueOperator, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isVenueOperator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="p-4 rounded-full bg-destructive/10 border border-destructive/30">
            <Lock className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Access Restricted</h1>
            <p className="text-muted-foreground">
              This area is restricted to authorized venue operators only.
            </p>
            {userEmail && (
              <p className="text-sm text-muted-foreground/80">
                Logged in as: {userEmail}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => navigate(fallbackPath)}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              className="flex-1"
            >
              Sign In
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-4">
            Error Code: 403 — Venue Operator Access Required
          </p>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              <strong>Need access?</strong> Contact your venue administrator to request venue operator permissions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
