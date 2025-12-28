import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Ghost, Eye, EyeOff, RefreshCw, Shield, Clock } from "lucide-react";
import { toast } from "sonner";

const QR_TTL_SECONDS = 60;

export default function GhostwareQR() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(QR_TTL_SECONDS);
  const [isHidden, setIsHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaporated, setIsEvaporated] = useState(false);

  // Generate new QR token
  const generateToken = useCallback(async () => {
    setIsLoading(true);
    setIsEvaporated(false);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to generate a code");
        navigate("/auth");
        return;
      }

      // Get profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        toast.error("Profile not found");
        return;
      }

      setProfileId(profile.id);

      // Generate new token
      const { data, error } = await supabase.functions.invoke('generate-qr-token', {
        body: { profileId: profile.id }
      });

      if (error) throw error;

      setToken(data.token);
      setTimeLeft(QR_TTL_SECONDS);
      setIsHidden(false);
    } catch (error) {
      console.error('Error generating token:', error);
      toast.error("Failed to generate code");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Initial token generation
  useEffect(() => {
    generateToken();
  }, [generateToken]);

  // Countdown timer
  useEffect(() => {
    if (isHidden || !token) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsEvaporated(true);
          setToken(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [token, isHidden]);

  // Kill/Hide toggle
  const handleKill = () => {
    setIsHidden(true);
    toast.info("Code hidden");
  };

  // Calculate progress for ring
  const progress = (timeLeft / QR_TTL_SECONDS) * 100;
  const circumference = 2 * Math.PI * 54; // radius 54
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // QR data
  const qrData = token ? JSON.stringify({
    t: token,
    p: profileId,
    v: 'ghostware',
    exp: Date.now() + (timeLeft * 1000)
  }) : '';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Ghost className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ghostware™
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Your secure entry code</p>
        </div>

        {/* QR Container */}
        <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
          {/* Countdown Ring */}
          <div className="relative flex items-center justify-center mb-4">
            <svg className="w-40 h-40 -rotate-90">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted/20"
              />
              {/* Progress ring */}
              <circle
                cx="80"
                cy="80"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-1000 ${
                  timeLeft <= 10 ? 'text-red-500' :
                  timeLeft <= 30 ? 'text-amber-500' :
                  'text-purple-500'
                }`}
              />
            </svg>

            {/* QR Code or State */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isLoading ? (
                <RefreshCw className="w-12 h-12 text-muted-foreground animate-spin" />
              ) : isHidden ? (
                <div className="text-center">
                  <EyeOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">Code hidden</span>
                </div>
              ) : isEvaporated ? (
                <div className="text-center animate-pulse">
                  <Ghost className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <span className="text-xs text-muted-foreground">Evaporated</span>
                </div>
              ) : token ? (
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <QRCodeSVG
                    value={qrData}
                    size={96}
                    level="M"
                    includeMargin={false}
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Timer Text */}
          <div className="text-center mb-6">
            {isHidden ? (
              <p className="text-muted-foreground">Code hidden — tap REVEAL to show</p>
            ) : isEvaporated ? (
              <p className="text-amber-400 font-medium">
                Code evaporated — tap REVEAL NEW CODE
              </p>
            ) : (
              <div className="flex items-center justify-center gap-2 text-foreground">
                <Clock className="w-4 h-4" />
                <span className={`font-mono text-lg ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
                  {timeLeft}s
                </span>
                <span className="text-muted-foreground text-sm">until evaporation</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={generateToken}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              REVEAL NEW CODE
            </Button>

            <Button
              onClick={handleKill}
              disabled={isHidden || isEvaporated || !token}
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              KILL / HIDE CODE
            </Button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>Single-use code • Auto-evaporates • Never stored</span>
        </div>

        {/* Back to Dashboard */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="w-full mt-4 text-muted-foreground"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
