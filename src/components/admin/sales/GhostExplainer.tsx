import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Rocket, Ghost, Timer, CheckCircle, Scan, ShieldCheck, QrCode, GraduationCap, Code } from "lucide-react";
import { toast } from "sonner";

export const GhostExplainer = () => {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const handleCopy = async (content: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedBlock(blockId);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedBlock(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const highSchoolContent = `GHOST PASS - EXPLAINED SIMPLY

What is Ghost?
Ghost is like a special digital badge that proves things about you WITHOUT showing your private information.

The SpaceX Example:
Think about SpaceX rockets. SpaceX doesn't BECOME the astronaut. SpaceX doesn't BECOME NASA. SpaceX is just the CARRIER - it safely transports valuable cargo from one place to another.

Ghost works the same way:
• Your private records (ID, health info, credentials) stay where they belong - with the companies that created them
• Ghost just carries a PERMISSION SLIP that says "yes, this person is verified for this specific thing"
• The permission slip expires quickly (like 30 seconds) so nobody can screenshot it and use it later

What happens when you scan a Ghost Pass?
1. You see a GREEN, YELLOW, or RED light
2. GREEN = verified, let them in
3. YELLOW = needs more checking
4. RED = not verified, don't let them in

That's it! No complicated data, no private information - just a simple yes/no answer.

Why is this better?
• Venues don't need to store your private data (less risk for everyone)
• You control what gets shared (toggle things on/off like a light switch)
• The pass expires fast so it can't be copied or stolen
• Everything gets logged so there's proof of what happened

The Bottom Line:
Ghost is a secure delivery system for trust. It doesn't hold your secrets - it just proves you're good to go.`;

  const technicalContent = `GHOST TOKEN CARRIER - TECHNICAL ARCHITECTURE

CORE CONCEPT
Ghost is a tokenized, permissioned access layer that authorizes verification against sources of record (labs, IDV providers, issuers) without carrying sensitive payloads.

TOKEN STRUCTURE
• Format: JWT (Header.Payload.Signature)
• Claims: subject_hash, issuer, expiry, audience, allowed_claims[]
• TTL: 30s default, user-extendable (30s / 2m / 5m)
• Revocation: Immediate via user action or system trigger

SOURCE OF TRUTH ARCHITECTURE
┌─────────────────────────────────────────────────────────────┐
│ Labs          → Lab records (PHI stays at lab)             │
│ IDV Providers → Identity records (PII stays at IDV)        │
│ Issuers       → Credential truth (attestations stay here)  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Ghost/VALID: Conduit layer - carries time-bound tokens      │
│ Token says: "User X authorizes Vendor Y to verify Z"        │
│ NO RAW DATA TRANSITS - only tokenized permissions           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Vendor receives:                                            │
│ • Operational signal: GREEN / YELLOW / RED                  │
│ • Minimal authorized attributes (user-permissioned)         │
│ • Audit trail: request → authorization → decision           │
└─────────────────────────────────────────────────────────────┘

VERIFICATION FLOW
1. User configures share profile (toggles: ID, Funds, Bio, Compliance, Profile)
2. Ghost generates time-bound QR with tokenized permissions
3. Vendor scans → token validated against issuer attestations
4. Vendor receives decision signal + minimal attributes
5. Token expires; audit event logged

SECURITY PROPERTIES
• Anti-replay: Short TTL (30s default) + one-time use validation
• Anti-screenshot: Dynamic rotation + server-side signature verification
• User control: Immediate revocation capability
• Audit integrity: Hash-chained event log
• Data minimization: No PHI/PII in token payload

API ENDPOINTS
POST /api/generate-ghost-token
→ Input: user_id, share_profile, audience, ttl_seconds
→ Output: { token: JWT, qr_data: string, expires_at: ISO8601 }

POST /api/validate-ghost-token
→ Input: token, venue_id, required_claims[]
→ Output: { valid: boolean, decision: GREEN|YELLOW|RED, claims: {}, audit_id: string }

POST /api/revoke-ghost-token
→ Input: jti (token ID)
→ Output: { revoked: true, revoked_at: ISO8601 }

RISK REDUCTION MODEL
• Minimizes custody of sensitive records (liability reduction)
• Reduces vendor data collection footprint (compliance simplification)
• Anchors verification to issuer attestations (trusted sources)
• Provides auditable proof records (defensibility)

FUTURE INTERFACES
Current: QR-based delivery
Planned: Spatial/device-native/next-gen modalities (interface-agnostic token mechanics)`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ghost className="h-5 w-5 text-emerald-400" />
            <CardTitle>Ghost Token Explainer</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Two versions: High School Level (for anyone) and Technical (for engineers/architects)
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="simple" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                High School Level
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Technical
              </TabsTrigger>
            </TabsList>

            <TabsContent value="simple">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-400" />
                      Ghost Pass — Simple Explanation
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use this when explaining to non-technical stakeholders, ops staff, or anyone new to the concept
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(highSchoolContent, "simple")}
                  >
                    {copiedBlock === "simple" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg print:bg-white print:text-black font-mono">
                    {highSchoolContent}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="h-5 w-5 text-emerald-400" />
                      Ghost Token Carrier — Technical Architecture
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use this when explaining to engineers, architects, or technical due diligence teams
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(technicalContent, "technical")}
                  >
                    {copiedBlock === "technical" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg print:bg-white print:text-black font-mono overflow-x-auto">
                    {technicalContent}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Visual Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Reference — The SpaceX Analogy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
            <div className="flex items-start gap-4">
              <Rocket className="h-8 w-8 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium mb-2">
                  "Ghost is like SpaceX for your credentials"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-3 rounded bg-background/50 border border-border">
                    <p className="text-xs font-semibold text-foreground mb-1">SpaceX ≠ Astronaut</p>
                    <p className="text-xs text-muted-foreground">Ghost ≠ Your Data</p>
                  </div>
                  <div className="p-3 rounded bg-background/50 border border-border">
                    <p className="text-xs font-semibold text-foreground mb-1">SpaceX = Carrier</p>
                    <p className="text-xs text-muted-foreground">Ghost = Token Carrier</p>
                  </div>
                  <div className="p-3 rounded bg-background/50 border border-border">
                    <p className="text-xs font-semibold text-foreground mb-1">Safe Transport</p>
                    <p className="text-xs text-muted-foreground">Secure Delivery of Trust</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
