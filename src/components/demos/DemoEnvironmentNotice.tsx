import { useState } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DemoEnvironmentNoticeProps {
  variant?: "inline" | "footer" | "banner";
  showAdminIndicator?: boolean;
}

const DemoEnvironmentNotice = ({ 
  variant = "footer", 
  showAdminIndicator = false 
}: DemoEnvironmentNoticeProps) => {
  const [open, setOpen] = useState(false);

  const NoticeContent = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Demo Mode Notice — Limited Input, Real Governance Signals
        </DialogTitle>
        <DialogDescription className="text-left pt-4 space-y-4">
          <p>
            This interface is currently operating in demo mode to demonstrate how 
            VALID | SYNTH™ performs governed AI validation.
          </p>
          <p>
            For the purposes of this demo, the system processes only the data you 
            explicitly and permissibly provide through this form. Do not submit 
            sensitive, regulated, or production data unless you are authorized to do so.
          </p>
          <p>
            In a live deployment, VALID | SYNTH™ does not rely on uploaded documents. 
            Instead, it operates simultaneously alongside your existing AI platform or 
            source of truth, observing the same data at the same time—without intercepting, 
            storing, or retaining it.
          </p>
          <p>
            All content evaluated during validation is immediately purged. The system emits 
            only a governance signal (scores, verdicts, and cryptographic proof), never the 
            underlying data.
          </p>
          <p className="font-medium text-foreground/80">
            This demo reflects the exact governance logic and audit mechanics used in 
            production—only the data ingestion method differs.
          </p>
        </DialogDescription>
      </DialogHeader>
    </>
  );

  if (variant === "banner") {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              This experience demonstrates the Valid/SYNTH governance workflow, 
              proof-record verification, and integration patterns. Outputs shown 
              may be produced using demo-safe simulation and sample data.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Production deployments run with client-specific rule packs and verified integrations under contract.
            </p>
          </div>
          {showAdminIndicator && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/30">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">Demo Mode ON</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <p className="text-xs text-muted-foreground italic mt-2">
        About this verdict: In production, verdicts are computed using your configured 
        rule packs, connected systems, and agreed verification sources.
      </p>
    );
  }

  // Footer variant - clickable link that opens modal
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <Info className="h-3 w-3 mr-1" />
          Demo Environment Notice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <NoticeContent />
      </DialogContent>
    </Dialog>
  );
};

export default DemoEnvironmentNotice;
