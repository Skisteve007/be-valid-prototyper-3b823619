import { useState } from "react";
import { Ghost, Eye, Mail, Lock, QrCode, Timer, ShieldCheck, Scan, ShieldX, ArrowLeft, Wallet, CheckCircle, Clock, Users, Building, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const GhostEcosystemModule = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    useCase: "",
  });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Request submitted! We'll be in touch soon.");
    setRequestOpen(false);
    setFormData({ name: "", email: "", org: "", useCase: "" });
  };

  const includedAttributes = [
    { label: "Identity / Eligibility", desc: "Prove 'eligible' without exposing full ID" },
    { label: "Health Status", desc: "Proof-only; labs remain the source of truth" },
    { label: "Screening / Compliance", desc: "Proof-only verification status" },
    { label: "Funded Wallet Credential", desc: "Payment-ready signal" },
    { label: "Profile Share", desc: "User-approved profile fields" },
  ];

  return (
    <>
      <Card className="border-emerald-500/30 bg-emerald-500/5 mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                <Ghost className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-foreground">Ghost Ecosystem Demos</h2>
                  <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400 bg-amber-500/10 shrink-0">
                    Coming Soon
                  </Badge>
                </div>
                <p className="text-xs text-emerald-400 font-medium mb-3">Wallet + Pass mechanics (privacy-preserving)</p>
              </div>
            </div>

            {/* Core Explanation */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Ghost is a wallet + pass</strong> that lets users share only what's required—and reveal nothing else. 
                A Ghost Pass QR does not carry sensitive records. It carries <strong className="text-emerald-400">tokenized, permissioned access</strong> that 
                authorizes verification against the source of record (labs, IDV providers, issuers).
              </p>
            </div>

            {/* Time-bound Token */}
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="h-4 w-4 text-amber-400" />
                <h4 className="font-semibold text-foreground text-sm">Time-bound + User-controlled Token</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                By default, Ghost Pass rotates every <strong className="text-amber-400">30 seconds</strong> to reduce screenshot/replay risk. 
                Users can optionally extend the refresh window (30s / 2m / 5m) for longer check-ins (e.g., hospital workflows).
              </p>
            </div>

            {/* What Can Be Included */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h4 className="font-semibold text-foreground text-sm mb-3">What Can Be Included (User-selected, Permissioned)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {includedAttributes.map((attr, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-background/50">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-foreground">{attr.label}</p>
                      <p className="text-xs text-muted-foreground">{attr.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How Verification Works */}
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Scan className="h-4 w-4 text-emerald-400" />
                <h4 className="font-semibold text-foreground text-sm">How Verification Works (Simple for Ops)</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Vendors define requirements up front. At scan time, they receive a <strong className="text-emerald-400">Green / Yellow / Red</strong> decision 
                plus only the minimum authorized attributes. That decision is derived from issuer/source-of-record attestations (not user-entered claims).
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-lg font-bold text-emerald-400">GREEN</div>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-center">
                  <div className="text-lg font-bold text-amber-400">YELLOW</div>
                  <p className="text-xs text-muted-foreground">Limited</p>
                </div>
                <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-center">
                  <div className="text-lg font-bold text-red-400">RED</div>
                  <p className="text-xs text-muted-foreground">Denied</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                If deeper evidence is required, vendors can use their own direct integration/link to the issuer. 
                <strong className="text-foreground"> Ghost/VALID is a conduit—not the data warehouse.</strong>
              </p>
            </div>

            {/* Future-Ready */}
            <div className="p-3 rounded-lg bg-muted/20 border border-border">
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Future-ready interfaces:</strong> Today the pass is delivered via QR; the same Ghost token mechanics 
                  are designed to extend to spatial and next-gen interaction modes upon request.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-3">
                Ghost Pass and wallet demos are being packaged into interactive scenarios. 
                For now, you can preview the flow and request early access.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setPreviewOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Ghost Flow
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setRequestOpen(true)}
                  className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 w-full sm:w-auto"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Request Ghost Demo Access
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled
                  className="opacity-50 w-full sm:w-auto"
                >
                  Launch Ghost Demo (Coming Soon)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Ghost Flow Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ghost className="h-5 w-5 text-emerald-400" />
              Ghost Pass Flow (Preview)
            </DialogTitle>
            <DialogDescription>
              Share status, not records — with a time-limited QR that expires fast.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* SpaceX Analogy */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="h-5 w-5 text-emerald-400" />
                <h4 className="font-semibold text-foreground">The SpaceX Analogy</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Think of the Ghost Pass like <strong className="text-foreground">SpaceX transporting astronauts and precious cargo</strong>.
              </p>
              <p className="text-sm text-muted-foreground">
                SpaceX doesn't <em>become</em> the astronaut. It doesn't <em>become</em> NASA. 
                It's the <strong className="text-emerald-400">carrier</strong>—a secure, controlled transport layer that gets something valuable 
                from Point A to Point B safely, with the right checks, telemetry, and procedures.
              </p>
            </div>

            {/* What Ghost Is */}
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="font-semibold text-foreground mb-2">What Ghost Is</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Ghost is a privacy-preserving pass and wallet inside VALID. Users can share only what they choose, 
                as time-limited status signals. Underlying records stay with the system of record.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">The source of truth stays where it belongs:</strong> Labs hold lab records. IDV providers hold identity records. Issuers hold credential truth.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Ghost/VALID <strong className="text-foreground">doesn't warehouse those sensitive records</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Ghost carries a <strong className="text-emerald-400">time-bound, permissioned token</strong> that says: "This user authorizes this vendor to verify this specific thing for this specific purpose."
                  </p>
                </div>
              </div>
            </div>

            {/* The 4-Step Flow */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">The 4-Step Flow</h4>
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 shrink-0 text-emerald-400 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Choose What to Share</h5>
                    <p className="text-sm text-muted-foreground">
                      Users toggle lock/unlock controls (e.g., ID, Funds, Bio, Tox, Profile). Locked categories never leave the wallet.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-400">ID ✓ Unlocked</Badge>
                      <Badge variant="outline" className="text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-400">Funds ✓ Unlocked</Badge>
                      <Badge variant="outline" className="text-xs text-muted-foreground">Bio 🔒</Badge>
                      <Badge variant="outline" className="text-xs text-muted-foreground">Profile 🔒</Badge>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 shrink-0 text-emerald-400 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Generate the Ghost QR Pass</h5>
                    <p className="text-sm text-muted-foreground">
                      A dynamic QR is generated. It contains <strong className="text-foreground">tokenized permissions</strong> (not raw data). 
                      Short-lived by default (30s) to reduce replay/screenshot abuse. Can be extended (30s / 2m / 5m) when needed.
                    </p>
                    <div className="mt-2 p-3 bg-background rounded border border-dashed border-emerald-500/30 text-center">
                      <QrCode className="h-12 w-12 text-emerald-400 mx-auto opacity-60" />
                      <p className="text-xs text-muted-foreground mt-1">Dynamic QR • Tokenized Permissions • Time-bound</p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 shrink-0 text-emerald-400 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Scan & Verify</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      The scanner (venue or partner) receives:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• A simple operational result: <strong className="text-emerald-400">Green / Yellow / Red</strong></li>
                      <li>• Only the minimal fields the user authorized and the vendor requires</li>
                      <li>• An auditable trail of: what was requested, what was authorized, what decision was returned</li>
                    </ul>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 shrink-0 text-amber-400 font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Auto-Expire + Safety Controls</h5>
                    <p className="text-sm text-muted-foreground">
                      The share token expires quickly and can be revoked. Screenshots and stale tokens fail safely.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                      <Timer className="h-3 w-3" />
                      <span>30s default TTL • User-extendable • User-revocable • Screenshot-safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why This Reduces Exposure */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h4 className="font-semibold text-foreground text-sm">Why This Reduces Exposure</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You minimize custody of sensitive records</li>
                <li>• You reduce what vendors collect/store by default</li>
                <li>• You keep verification anchored to issuer attestations (the parties already responsible for the truth)</li>
              </ul>
            </div>

            {/* What the Scanner Sees */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Scanner Output (Example)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">GREEN</div>
                  <p className="text-xs text-muted-foreground">Verified. Admit.</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                  <div className="text-2xl font-bold text-amber-400 mb-1">YELLOW</div>
                  <p className="text-xs text-muted-foreground">Limited verification. Check ID.</p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">RED</div>
                  <p className="text-xs text-muted-foreground">Not verified. Do not admit.</p>
                </div>
              </div>
            </div>

            {/* What We Do NOT Do */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <ShieldX className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-foreground text-sm">What We Do NOT Do</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                We do not ask you to hand over databases. We do not expose PHI/PII in the QR. 
                We retain only minimal integrity artifacts needed for auditability and security.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left flex-1">
              For production deployments, Ghost policies and signal categories are configured under contract.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Demos
              </Button>
              <Button 
                onClick={() => { setPreviewOpen(false); setRequestOpen(true); }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Mail className="h-4 w-4 mr-2" />
                Request Ghost Demo Access
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Access Form Modal */}
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-emerald-400" />
              Request Ghost Demo Access
            </DialogTitle>
            <DialogDescription>
              Get early access to Ghost Pass interactive demos
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleRequestSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org">Organization</Label>
              <Input
                id="org"
                value={formData.org}
                onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                placeholder="Company or organization"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="useCase">Use Case</Label>
              <Textarea
                id="useCase"
                value={formData.useCase}
                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                placeholder="What would you use Ghost Pass for?"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setRequestOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Submit Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GhostEcosystemModule;
