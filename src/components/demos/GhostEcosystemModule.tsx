import { useState } from "react";
import { Ghost, Eye, Mail, Lock, QrCode, Timer, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 shrink-0">
              <Ghost className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-foreground">Ghost Ecosystem Demos</h2>
                <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400 bg-amber-500/10">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-xs text-emerald-400 font-medium mb-3">Wallet + Pass mechanics (privacy-preserving)</p>
              <p className="text-muted-foreground text-sm mb-4">
                Ghost Pass and wallet demos are being packaged into interactive scenarios. 
                For now, you can preview the flow and request early access.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setPreviewOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Ghost Flow
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setRequestOpen(true)}
                  className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Request Ghost Demo Access
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled
                  className="opacity-50"
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
              Ghost Pass Flow Preview
            </DialogTitle>
            <DialogDescription>
              How privacy-preserving verification works — no records exposed
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="p-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                <Lock className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">1. User Chooses What to Share</h4>
                <p className="text-sm text-muted-foreground">
                  Before generating a Ghost QR, the user selects which verified attributes to include 
                  (e.g., "Age 21+", "ID Verified", "Health Status"). Everything else stays locked.
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Age: 21+ ✓</Badge>
                  <Badge variant="outline" className="text-xs">ID Verified ✓</Badge>
                  <Badge variant="outline" className="text-xs text-muted-foreground">Name: Hidden</Badge>
                  <Badge variant="outline" className="text-xs text-muted-foreground">DOB: Hidden</Badge>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="p-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                <QrCode className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">2. Generate Time-Limited Ghost QR</h4>
                <p className="text-sm text-muted-foreground">
                  A cryptographically signed QR code is generated containing only the selected claims. 
                  No underlying records are exposed — just a verifiable token.
                </p>
                <div className="mt-2 p-3 bg-background rounded border border-dashed border-emerald-500/30 text-center">
                  <QrCode className="h-16 w-16 text-emerald-400 mx-auto opacity-50" />
                  <p className="text-xs text-muted-foreground mt-1">QR Preview Placeholder</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="p-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">3. Scan → Returns Status Only</h4>
                <p className="text-sm text-muted-foreground">
                  When scanned, the verifier sees only the selected signals (PASS/FAIL for each claim). 
                  No names, no documents, no records transferred.
                </p>
                <div className="mt-2 p-3 bg-background rounded border border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-foreground">Age Verified: 21+</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-foreground">ID Status: Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="p-2 rounded-full bg-amber-500/20 border border-amber-500/30 shrink-0">
                <Timer className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">4. Token Expires + Can Be Revoked</h4>
                <p className="text-sm text-muted-foreground">
                  Ghost tokens expire automatically (e.g., 30 seconds). Users can also revoke active tokens 
                  at any time from their wallet. Once expired or revoked, the QR returns nothing.
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                  <Timer className="h-3 w-3" />
                  <span>Default TTL: 30 seconds • User-revocable at any time</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-center text-muted-foreground">
                <span className="text-foreground font-medium">Privacy by design:</span> Your data stays in your wallet. 
                Verifiers get signals, not records.
              </p>
            </div>
          </div>
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
