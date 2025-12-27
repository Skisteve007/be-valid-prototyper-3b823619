import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowRight, CheckCircle, Database, Lock, QrCode, Sparkles, AlertTriangle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoShareButton from "@/components/demos/DemoShareButton";
import FlowDiagram from "@/components/demos/FlowDiagram";

const DemoEnterpriseSandbox = () => {
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [verificationResult, setVerificationResult] = useState<null | {
    verified: boolean;
    token: string;
    expires: string;
    hash: string;
  }>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSimulateVerification = () => {
    // Require login to run
    if (!isLoggedIn) {
      navigate(`/auth?mode=login&redirect=${encodeURIComponent('/demos/enterprise-sandbox')}`);
      return;
    }

    // Simulate the verification process
    setTimeout(() => {
      setVerificationResult({
        verified: true,
        token: `vld_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        hash: `sha256:${Math.random().toString(36).substr(2, 40)}`,
      });
      setStep(4);
    }, 1500);
    setStep(3);
  };

  const resetDemo = () => {
    setStep(1);
    setVerificationResult(null);
  };

  return (
    <>
      <Helmet>
        <title>Demo C — Enterprise Sandbox | Valid™</title>
        <meta name="description" content="Experience the conduit architecture. Your data stays with you — we only return verified tokens." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <DemoBanner />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <Shield className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Demo C — Enterprise Sandbox</h1>
                  <p className="text-sm text-muted-foreground">Data Stays With You</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DemoShareButton />
                <Button variant="outline" size="sm" asChild>
                  <Link to="/demos">← All Demos</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Explainer Card */}
          <Card className="mb-8 border-cyan-500/20 bg-cyan-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-cyan-400 shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">Conduit Architecture</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Valid/SYNTH is a <strong>governance conduit</strong>, not a data warehouse. Your foundational sources 
                    (KYC vendors, EHRs, authoritative systems) house raw data. We orchestrate verification, apply multi-model 
                    governance, and return a time-limited token linked to an integrity proof. We retain only minimal metadata.
                  </p>
                  <FlowDiagram variant="conduit" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${
                    step >= s 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                </div>
                {s < 4 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>

          {/* Step 1: Configure Source */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Step 1: Select Your Source of Truth
                </CardTitle>
                <CardDescription>Choose the authoritative source for verification (simulated)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Data Source Type</Label>
                  <Select defaultValue="kyc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kyc">KYC Vendor (Jumio, Footprint, etc.)</SelectItem>
                      <SelectItem value="ehr">EHR/Hospital System</SelectItem>
                      <SelectItem value="lab">Lab Partner API</SelectItem>
                      <SelectItem value="hr">HR/Workforce System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Your source credentials are never sent to Valid — verification happens via secure API callback.</span>
                  </div>
                </div>

                <Button onClick={() => setStep(2)} className="w-full">
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Enter Verification Request */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Step 2: Verification Request
                </CardTitle>
                <CardDescription>Enter the verification criteria (simulated — no real data needed)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Verification Type</Label>
                    <Select defaultValue="age">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="age">Age (21+)</SelectItem>
                        <SelectItem value="identity">Identity Verified</SelectItem>
                        <SelectItem value="health">Health Status</SelectItem>
                        <SelectItem value="employment">Employment Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Token Validity</Label>
                    <Select defaultValue="24h">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="30d">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Reference ID (optional)</Label>
                  <Input placeholder="Your internal reference ID" />
                </div>

                <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <div className="flex items-start gap-2 text-sm text-amber-300">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>This is a simulation. In production, Valid queries your source via secure API and never stores raw data.</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={handleSimulateVerification} className="flex-1">
                      {!isLoggedIn ? (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign in to Run
                        </>
                      ) : (
                        <>
                          Run Verification
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Viewing is public. Running requires sign-in (for trace/audit and rate limiting).
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Processing */}
          {step === 3 && (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-pulse">
                    <div className="p-4 rounded-full bg-primary/20 border border-primary/40">
                      <Sparkles className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Verifying...</h3>
                    <p className="text-sm text-muted-foreground">
                      Querying source → Applying governance → Generating token
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Result */}
          {step === 4 && verificationResult && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle>Verification Complete</CardTitle>
                    <CardDescription>Signed token generated — your data was never stored</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/50 rounded-lg border border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">VERIFIED</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Token</span>
                    <code className="text-xs text-primary font-mono">{verificationResult.token}</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expires</span>
                    <span className="text-foreground">{new Date(verificationResult.expires).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Integrity Ref</span>
                    <code className="text-xs text-muted-foreground font-mono truncate max-w-48">{verificationResult.hash}</code>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                  <QrCode className="h-12 w-12 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Ghost QR Ready</p>
                    <p className="text-xs text-muted-foreground">
                      This token can be embedded in a Ghost QR for sharing — verifiers see status, not underlying records.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <div className="flex items-start gap-2 text-sm text-cyan-300">
                    <Shield className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>
                      <strong>What we retained:</strong> Minimal metadata and token ID. 
                      <strong> What we didn't store:</strong> Your source credentials, raw verification data, PII.
                    </span>
                  </div>
                </div>

                <Button onClick={resetDemo} variant="outline" className="w-full">
                  Run Another Verification
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </>
  );
};

export default DemoEnterpriseSandbox;
