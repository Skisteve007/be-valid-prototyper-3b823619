import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthGateProps {
  children: ReactNode;
}

export const AuthGate = ({ children }: AuthGateProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("AuthGate: Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    // Redirect to auth with return URL
    navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated → Show sign in prompt
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 mb-8">
          <Lock className="w-12 h-12 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">
          Sign In <span className="text-primary">Required</span>
        </h1>

        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <p className="text-muted-foreground leading-relaxed mb-6">
            You must be signed in to access the <span className="text-foreground font-semibold">Research & Governance Labs</span>. 
            Create an account or sign in to continue.
          </p>

          <Button
            onClick={handleSignIn}
            className="w-full bg-primary text-primary-foreground font-bold py-6 text-lg"
          >
            Sign In to Continue
          </Button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};
