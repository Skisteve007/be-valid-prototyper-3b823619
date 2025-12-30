import { useState } from "react";
import { Ghost, Eye, Mail, Lock, QrCode, Timer, ShieldCheck, Scan, ShieldX, ArrowLeft } from "lucide-react";
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
    // In production, this would submit to a contact pipeline
    toast.success("Request submitted! We'll be in touch soon.");
    setRequestOpen(false);
    setFormData({ name: "", email: "", org: "", useCase: "" });
  };

  return (
    <>
      <Card className="border-emerald-500/30 bg-emerald-500/5 mb-8">
        <CardContent className="pt-6">
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
              <p className="text-muted-foreground text-sm mb-4">
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
            {/* What Ghost Is */}
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="font-semibold text-foreground mb-2">What Ghost Is</h4>
              <p className="text-sm text-muted-foreground">
                Ghost is a privacy-preserving pass and wallet inside VALID. Users can share only what they choose, 
                as time-limited status signals. Underlying records stay with the system of record (your systems or 
                approved verification sources).
              </p>
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
                      A dynamic QR is generated for sharing. It contains an opaque reference — not personal data.
                    </p>
                    <div className="mt-2 p-3 bg-background rounded border border-dashed border-emerald-500/30 text-center">
                      <QrCode className="h-12 w-12 text-emerald-400 mx-auto opacity-60" />
                      <p className="text-xs text-muted-foreground mt-1">Dynamic QR • Opaque Reference Only</p>
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
                    <p className="text-sm text-muted-foreground">
                      The scanner (venue or partner) receives a status response (e.g., verified/not verified + allowed signals). No raw records are exposed.
                    </p>
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
                      The share token expires quickly (e.g., ~30 seconds) and can be revoked. Screenshots and stale tokens fail safely.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                      <Timer className="h-3 w-3" />
                      <span>~30 second TTL • User-revocable • Screenshot-safe</span>
                    </div>
                  </div>
                </div>
              </div>
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
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Optional: "Proof Record Available" indicator (yes/no)
              </p>
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
