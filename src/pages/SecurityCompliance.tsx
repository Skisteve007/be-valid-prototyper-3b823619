import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, Lock, Database, Server, FileCheck, Fingerprint, 
  ShieldCheck, Eye, Globe, Zap, CheckCircle, AlertTriangle,
  Key, RefreshCw, Clock, Users, Code, HardDrive
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SecurityCompliance = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Clean Check</h1>
              <p className="text-xs text-muted-foreground">Security & Compliance Documentation</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex justify-center gap-3 mb-6">
            <Badge variant="outline" className="px-4 py-2 text-emerald-600 border-emerald-600">
              <ShieldCheck className="h-4 w-4 mr-2" />
              HIPAA Compliant
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-violet-600 border-violet-600">
              <Lock className="h-4 w-4 mr-2" />
              SOC 2 Type II
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sky-600 border-sky-600">
              <Globe className="h-4 w-4 mr-2" />
              GDPR Ready
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Enterprise Security Architecture</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Clean Check implements a Zero-Trust security model with defense-in-depth strategies 
            to protect sensitive health data and ensure regulatory compliance.
          </p>
        </section>

        {/* Security Overview Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Database Security */}
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-emerald-600">Row-Level Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                PostgreSQL-native RLS policies enforce data isolation at the database layer. 
                Users can only access their own records—enforced server-side, not client-side.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  30+ tables with RLS policies
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Role-based access control (RBAC)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Security definer functions
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Encryption */}
          <Card className="border-violet-500/30 bg-violet-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-violet-500 rounded-lg flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-violet-600">AES-256 Encryption</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                All sensitive data encrypted using AES-256-GCM. TLS 1.3 enforced for all 
                data in transit. Zero plaintext storage of PII or PHI.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-violet-500" />
                  Encryption at rest (AES-256)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-violet-500" />
                  Encryption in transit (TLS 1.3)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-violet-500" />
                  No plaintext PII/PHI storage
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card className="border-sky-500/30 bg-sky-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-sky-500 rounded-lg flex items-center justify-center">
                  <Fingerprint className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-sky-600">JWT Authentication</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Stateless JWT tokens with role-based access control. Token expiration 
                and refresh rotation enforced for all sessions.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-sky-500" />
                  5 user roles (guest → admin)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-sky-500" />
                  Token refresh rotation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-sky-500" />
                  Session persistence control
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* API Security */}
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-amber-600">Edge Functions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Deno-based serverless functions with isolated execution environments. 
                API keys stored in encrypted vault with automatic rotation.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500" />
                  Isolated execution environments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500" />
                  CORS protection enabled
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500" />
                  Rate limiting per endpoint
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card className="border-pink-500/30 bg-pink-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-pink-500 rounded-lg flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-pink-600">HIPAA & GDPR</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                FHIR R4 compatible data schemas. Privacy firewall requires explicit 
                user consent before status publication. Complete audit trail.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-pink-500" />
                  Privacy firewall (consent-based)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-pink-500" />
                  Complete audit logging
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-pink-500" />
                  Data retention policies
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Identity Verification */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-red-600">KYC Verification</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Government ID upload and verification for affiliate partners. 
                KYC-compliant document storage in encrypted buckets.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  2257 compliance ready
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  Admin-only document access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  Encrypted document storage
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Zero Trust Architecture */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            Zero-Trust Security Model
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-lg">Core Principles</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Never Trust, Always Verify</p>
                        <p className="text-sm text-muted-foreground">Every API request is authenticated and authorized, regardless of source.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Least Privilege Access</p>
                        <p className="text-sm text-muted-foreground">Users only access data and functions required for their role.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Assume Breach</p>
                        <p className="text-sm text-muted-foreground">Defense-in-depth with multiple security layers even if one is compromised.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-lg">Implementation Details</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Key className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">JWT Token Verification</p>
                        <p className="text-sm text-muted-foreground">All edge functions verify JWT signatures before processing.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <RefreshCw className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Token Refresh Rotation</p>
                        <p className="text-sm text-muted-foreground">Automatic token refresh with rotation to prevent replay attacks.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-violet-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Time-Limited Access Tokens</p>
                        <p className="text-sm text-muted-foreground">QR codes expire after 6 hours, viewing window limited to 3 minutes.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Flow & Privacy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <HardDrive className="h-6 w-6 text-primary" />
            Data Flow & Privacy Controls
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <h3 className="font-semibold text-emerald-600 mb-2">✓ Compliance Badge Only</h3>
                  <p className="text-sm text-muted-foreground">
                    The front-end (user device/venue scanner) only receives a simplified <strong>COMPLIANCE STATUS</strong> badge—not the raw medical data. 
                    Lab results remain encrypted and never exposed to third parties.
                  </p>
                </div>
                <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                  <h3 className="font-semibold text-violet-600 mb-2">✓ Privacy Firewall</h3>
                  <p className="text-sm text-muted-foreground">
                    Lab results are locked in "Private Inbox" until the user explicitly consents to publish their status. 
                    No automatic profile updates—complete user control over data visibility.
                  </p>
                </div>
                <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-lg">
                  <h3 className="font-semibold text-sky-600 mb-2">✓ Audit Trail</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete logging of all data access events with IP addresses, timestamps, and user agents. 
                    Immutable audit logs for regulatory compliance and forensic analysis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* API & Integration Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            API & Integration Security
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lab Partner Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    API key authentication per partner
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Webhook event logging with payloads
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Rate limiting per partner
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    IP allowlisting (optional)
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    PCI-DSS compliant (via PayPal)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    No card data stored locally
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Tokenized payment references
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Webhook signature verification
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Compliance Certifications
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="text-center p-6">
              <div className="h-16 w-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="font-bold">HIPAA</h3>
              <p className="text-xs text-muted-foreground">Health Insurance Portability & Accountability Act</p>
            </Card>
            <Card className="text-center p-6">
              <div className="h-16 w-16 mx-auto bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-violet-500" />
              </div>
              <h3 className="font-bold">SOC 2 Type II</h3>
              <p className="text-xs text-muted-foreground">Service Organization Control</p>
            </Card>
            <Card className="text-center p-6">
              <div className="h-16 w-16 mx-auto bg-sky-500/10 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="font-bold">GDPR</h3>
              <p className="text-xs text-muted-foreground">General Data Protection Regulation</p>
            </Card>
            <Card className="text-center p-6">
              <div className="h-16 w-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="font-bold">PCI-DSS</h3>
              <p className="text-xs text-muted-foreground">Payment Card Industry Data Security Standard</p>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center py-8 border-t border-border">
          <h2 className="text-xl font-bold mb-4">Security Questions?</h2>
          <p className="text-muted-foreground mb-6">
            For security concerns, compliance inquiries, or to report vulnerabilities, contact our security team.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="mailto:security@cleancheck.fit">Contact Security Team</a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/api-docs">View API Documentation</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SecurityCompliance;
