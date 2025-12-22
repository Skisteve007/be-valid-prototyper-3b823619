import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IDVStatusBadge } from "@/components/dashboard/IDVStatusBadge";
import { toast } from "sonner";
import { 
  ShieldCheck, 
  Globe, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2,
  Fingerprint,
  FileCheck,
  AlertCircle
} from "lucide-react";

const IDV_TIERS = {
  standard: {
    name: "Standard VIBE-ID",
    price: "$14.99",
    features: [
      "Passport/ID Document Scan",
      "Biometric Liveness Check",
      "Basic Criminal Background Check",
      "Instant Club & Venue Entry",
      "P2P Connection Verified Badge"
    ],
    turnaround: "Under 3 Minutes",
    icon: ShieldCheck,
    color: "emerald"
  },
  vip: {
    name: "Global Access",
    price: "$34.99",
    features: [
      "All Standard Features",
      "Full Global AML/PEP Screening",
      "Comprehensive Background Check",
      "International Transaction Ready",
      "Crypto-KYC Compliant",
      "Premium Travel Utility (DTC)"
    ],
    turnaround: "Under 5 Minutes",
    icon: Globe,
    color: "fuchsia"
  }
};

export default function IDVVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [idvStatus, setIdvStatus] = useState<{
    status: "unverified" | "pending" | "verified" | "failed";
    tier: "standard" | "vip" | null;
  }>({ status: "unverified", tier: null });

  useEffect(() => {
    checkAuth();
    
    const sessionId = searchParams.get("session_id");
    const status = searchParams.get("status");
    
    if (sessionId && status === "success") {
      verifyPayment(sessionId);
    }
  }, [searchParams]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to access identity verification");
      navigate("/auth");
      return;
    }
    setUser(session.user);
    fetchIdvStatus(session.user.id);
  };

  const fetchIdvStatus = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("idv_status, idv_tier")
      .eq("user_id", userId)
      .maybeSingle();

    if (profile) {
      setIdvStatus({
        status: (profile.idv_status as any) || "unverified",
        tier: profile.idv_tier as any
      });
    }
  };

  const verifyPayment = async (sessionId: string) => {
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-idv-payment", {
        body: { session_id: sessionId }
      });

      if (error) throw error;

      if (data.verified) {
        toast.success("Payment verified! Identity verification in progress...");
        setIdvStatus({ status: "pending", tier: data.tier });
        
        // Poll for verification completion
        const pollInterval = setInterval(async () => {
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("idv_status, idv_tier")
              .eq("user_id", user.id)
              .maybeSingle();

            if (profile?.idv_status === "verified") {
              clearInterval(pollInterval);
              setIdvStatus({
                status: "verified",
                tier: profile.idv_tier as any
              });
              toast.success("Identity verification complete!");
            }
          }
        }, 3000);

        // Stop polling after 2 minutes
        setTimeout(() => clearInterval(pollInterval), 120000);
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      toast.error(error.message || "Failed to verify payment");
    } finally {
      setVerifying(false);
    }
  };

  const handlePurchase = async (tier: "standard" | "vip") => {
    if (!user) {
      toast.error("Please sign in first");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-idv-checkout", {
        body: { tier }
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to create checkout session");
    } finally {
      setLoading(false);
    }
  };

  const renderTierCard = (tierKey: "standard" | "vip") => {
    const tier = IDV_TIERS[tierKey];
    const Icon = tier.icon;
    const isVip = tierKey === "vip";
    const isCurrentTier = idvStatus.tier === tierKey && idvStatus.status === "verified";
    const canPurchase = idvStatus.status === "unverified" || 
      (idvStatus.status === "verified" && idvStatus.tier === "standard" && tierKey === "vip");

    return (
      <Card 
        className={`relative overflow-hidden transition-all duration-300 ${
          isVip 
            ? "border-2 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.2)] bg-gradient-to-br from-fuchsia-950/50 to-purple-950/50" 
            : "border border-emerald-500/50 bg-gradient-to-br from-emerald-950/30 to-green-950/30"
        } ${isCurrentTier ? "ring-2 ring-offset-2 ring-offset-background" : ""}`}
      >
        {isVip && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-fuchsia-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
        )}
        {isCurrentTier && (
          <div className="absolute top-0 left-0 bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-br-lg flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> YOUR PLAN
          </div>
        )}
        
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
              isVip ? "bg-fuchsia-500/20" : "bg-emerald-500/20"
            }`}>
              <Icon className={`h-6 w-6 ${isVip ? "text-fuchsia-400" : "text-emerald-400"}`} />
            </div>
            <div>
              <CardTitle className="text-xl font-orbitron">{tier.name}</CardTitle>
              <CardDescription className={isVip ? "text-fuchsia-400" : "text-emerald-400"}>
                One-time verification
              </CardDescription>
            </div>
          </div>
          <div className={`text-4xl font-extrabold ${isVip ? "text-fuchsia-400" : "text-emerald-400"}`}>
            {tier.price}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {tier.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className={`h-4 w-4 mt-0.5 ${isVip ? "text-fuchsia-400" : "text-emerald-400"}`} />
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Loader2 className={`h-4 w-4 ${isVip ? "text-fuchsia-400" : "text-emerald-400"}`} />
            <span className="text-gray-400">Turnaround:</span>
            <span className="font-bold text-white">{tier.turnaround}</span>
          </div>

          {canPurchase ? (
            <Button
              onClick={() => handlePurchase(tierKey)}
              disabled={loading}
              className={`w-full font-bold ${
                isVip 
                  ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 shadow-[0_0_20px_rgba(217,70,239,0.4)]" 
                  : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {idvStatus.tier === "standard" && tierKey === "vip" ? "Upgrade to VIP" : "Get Verified"}
                </>
              )}
            </Button>
          ) : (
            <Button disabled className="w-full opacity-50">
              {isCurrentTier ? "Current Plan" : "Not Available"}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="container max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Status Banner */}
        {idvStatus.status !== "unverified" && (
          <Card className="mb-8 bg-black/40 border-white/10">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Fingerprint className="h-8 w-8 text-cyan-400" />
                  <div>
                    <h3 className="font-bold text-lg">Your Verification Status</h3>
                    <p className="text-gray-400 text-sm">
                      {idvStatus.status === "pending" 
                        ? "Your identity verification is being processed..." 
                        : idvStatus.status === "verified"
                        ? "Your identity has been verified and anchored."
                        : "Verification failed. Please try again."}
                    </p>
                  </div>
                </div>
                <IDVStatusBadge status={idvStatus.status} tier={idvStatus.tier} size="lg" />
              </div>
              
              {verifying && (
                <div className="mt-4 flex items-center gap-2 text-amber-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying payment...</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-4 py-1">
            IDENTITY AS A SERVICE
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-orbitron mb-4">
            Anchor Your <span className="text-cyan-400">Identity</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Upgrade to a Government-Verified Vibe-ID for maximum access and trust within the VALID ecosystem.
            Your identity is encrypted and stored as an immutable hash—never raw data.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: FileCheck, title: "1. Choose Your Tier", desc: "Select Standard or VIP based on your needs" },
            { icon: Fingerprint, title: "2. Complete Verification", desc: "Scan your ID and complete liveness check" },
            { icon: ShieldCheck, title: "3. Get Verified", desc: "Receive your encrypted identity hash" }
          ].map((step, idx) => (
            <Card key={idx} className="bg-black/40 border-white/10">
              <CardContent className="py-6 text-center">
                <step.icon className="h-8 w-8 mx-auto mb-3 text-cyan-400" />
                <h3 className="font-bold mb-1">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {renderTierCard("standard")}
          {renderTierCard("vip")}
        </div>

        {/* Trust Indicators */}
        <Card className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border-cyan-500/30">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Privacy-First Architecture</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  VALID never stores your raw identity documents. Your verification creates an <span className="text-cyan-400 font-semibold">Encrypted Verified Hash</span>—a 
                  cryptographic proof of your identity that venues can verify without accessing your personal data. 
                  This is the foundation of our zero-liability architecture.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
