import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FileCheck, CheckCircle, XCircle, AlertTriangle, Search, Shield, Clock, Hash, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoShareButton from "@/components/demos/DemoShareButton";

// Example tokens for demo
const DEMO_TOKENS = {
  valid: "vld_demo_valid_8f2k9x3m",
  expired: "vld_demo_expired_7a1m3n2p",
  tampered: "vld_demo_tampered_6b4p2q1r",
};

interface VerificationResult {
  status: "valid" | "expired" | "tampered" | "not_found";
  token: string;
  issuedAt?: string;
  expiresAt?: string;
  issuer?: string;
  signatureValid?: boolean;
  hashMatch?: boolean;
  claims?: Record<string, string>;
  tamperedFields?: string[];
}

const DemoAuditVerifier = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = () => {
    setIsVerifying(true);
    setResult(null);

    setTimeout(() => {
      let verificationResult: VerificationResult;

      if (tokenInput.includes("valid") || tokenInput === DEMO_TOKENS.valid) {
        verificationResult = {
          status: "valid",
          token: tokenInput || DEMO_TOKENS.valid,
          issuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
          issuer: "Valid/SYNTH Senate v2.1",
          signatureValid: true,
          hashMatch: true,
          claims: {
            verification_type: "age_21_plus",
            source_attestation: "verified_by_vendor",
            governance_pass: "approved_by_senate",
          },
        };
      } else if (tokenInput.includes("expired") || tokenInput === DEMO_TOKENS.expired) {
        verificationResult = {
          status: "expired",
          token: tokenInput || DEMO_TOKENS.expired,
          issuedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          issuer: "Valid/SYNTH Senate v2.1",
          signatureValid: true,
          hashMatch: true,
        };
      } else if (tokenInput.includes("tampered") || tokenInput === DEMO_TOKENS.tampered) {
        verificationResult = {
          status: "tampered",
          token: tokenInput || DEMO_TOKENS.tampered,
          issuedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
          issuer: "Valid/SYNTH Senate v2.1",
          signatureValid: false,
          hashMatch: false,
          tamperedFields: ["claims.verification_type", "claims.expiry_timestamp"],
        };
      } else if (tokenInput.trim()) {
        verificationResult = {
          status: "not_found",
          token: tokenInput,
        };
      } else {
        // Use valid demo token if empty
        verificationResult = {
          status: "valid",
          token: DEMO_TOKENS.valid,
          issuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
          issuer: "Valid/SYNTH Senate v2.1",
          signatureValid: true,
          hashMatch: true,
          claims: {
            verification_type: "age_21_plus",
            source_attestation: "verified_by_vendor",
            governance_pass: "approved_by_senate",
          },
        };
      }

      setResult(verificationResult);
      setIsVerifying(false);
    }, 1200);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "valid":
        return {
          icon: CheckCircle,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10 border-emerald-500/30",
          badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
          label: "VALID",
          description: "Token is authentic and has not been tampered with.",
        };
      case "expired":
        return {
          icon: Clock,
          color: "text-amber-400",
          bgColor: "bg-amber-500/10 border-amber-500/30",
          badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/50",
          label: "EXPIRED",
          description: "Token was valid but has passed its expiration time.",
        };
      case "tampered":
        return {
          icon: AlertTriangle,
          color: "text-red-400",
          bgColor: "bg-red-500/10 border-red-500/30",
          badgeClass: "bg-red-500/20 text-red-400 border-red-500/50",
          label: "TAMPERED",
          description: "Token signature is invalid. Possible modification detected.",
        };
      default:
        return {
          icon: XCircle,
          color: "text-muted-foreground",
          bgColor: "bg-muted/50 border-border",
          badgeClass: "bg-muted text-muted-foreground border-muted",
          label: "NOT FOUND",
          description: "Token not found in our audit log.",
        };
    }
  };

  return (
    <>
      <Helmet>
        <title>Demo D — Audit Proof Verifier | Valid™</title>
        <meta name="description" content="Verify token authenticity, check signatures, and detect tampering. Security auditor's toolkit." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <DemoBanner />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Demo D — Audit Proof Verifier</h1>
                  <p className="text-sm text-muted-foreground">Detect tampering & verify authenticity</p>
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

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Explainer */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">Integrity Proof Verification</h2>
                  <p className="text-muted-foreground text-sm">
                    Every Valid token includes an audit hash and timestamp. This verifier checks:
                    (1) hash integrity, (2) timestamp validity, (3) match against our audit log.
                    Any modification is immediately detected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Enter Token to Verify
              </CardTitle>
              <CardDescription>Paste a token or use one of the demo tokens below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Token</Label>
                <Input
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="vld_..."
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setTokenInput(DEMO_TOKENS.valid)}>
                  Demo: Valid Token
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTokenInput(DEMO_TOKENS.expired)}>
                  Demo: Expired Token
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTokenInput(DEMO_TOKENS.tampered)}>
                  Demo: Tampered Token
                </Button>
              </div>

              <Button onClick={handleVerify} disabled={isVerifying} className="w-full">
                {isVerifying ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Verify Token
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          {result && (
            <Card className={`border ${getStatusConfig(result.status).bgColor}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const config = getStatusConfig(result.status);
                    const Icon = config.icon;
                    return (
                      <>
                        <div className={`p-2 rounded-full ${config.bgColor}`}>
                          <Icon className={`h-6 w-6 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle>Verification Result</CardTitle>
                            <Badge variant="outline" className={config.badgeClass}>
                              {config.label}
                            </Badge>
                          </div>
                          <CardDescription>{config.description}</CardDescription>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/50 rounded-lg border border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Token</span>
                    <code className="text-xs text-primary font-mono">{result.token}</code>
                  </div>

                  {result.issuedAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Issued At</span>
                      <span className="text-foreground">{new Date(result.issuedAt).toLocaleString()}</span>
                    </div>
                  )}

                  {result.expiresAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expires At</span>
                      <span className={result.status === "expired" ? "text-amber-400" : "text-foreground"}>
                        {new Date(result.expiresAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {result.issuer && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Issuer</span>
                      <span className="text-foreground">{result.issuer}</span>
                    </div>
                  )}

                  {result.signatureValid !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        Signature
                      </span>
                      <Badge 
                        variant="outline" 
                        className={result.signatureValid 
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                          : "bg-red-500/20 text-red-400 border-red-500/50"
                        }
                      >
                        {result.signatureValid ? "Valid" : "Invalid"}
                      </Badge>
                    </div>
                  )}

                  {result.hashMatch !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Hash Match
                      </span>
                      <Badge 
                        variant="outline" 
                        className={result.hashMatch 
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                          : "bg-red-500/20 text-red-400 border-red-500/50"
                        }
                      >
                        {result.hashMatch ? "Match" : "Mismatch"}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Tampered Fields Warning */}
                {result.tamperedFields && result.tamperedFields.length > 0 && (
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-400">Tampered Fields Detected</p>
                        <ul className="text-xs text-red-300/80 mt-1">
                          {result.tamperedFields.map((field, i) => (
                            <li key={i}>• {field}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Claims (for valid tokens) */}
                {result.claims && Object.keys(result.claims).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Verified Claims</p>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border space-y-2">
                      {Object.entries(result.claims).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{key}</span>
                          <span className="text-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </>
  );
};

export default DemoAuditVerifier;
