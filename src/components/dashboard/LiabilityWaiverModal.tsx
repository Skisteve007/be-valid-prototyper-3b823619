import { useState } from "react";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LiabilityWaiverModalProps {
  open: boolean;
  onClose: () => void;
  onSigned: () => void;
  userId: string;
}

const CURRENT_WAIVER_VERSION = "1.0";

const LiabilityWaiverModal = ({ open, onClose, onSigned, userId }: LiabilityWaiverModalProps) => {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSign = async () => {
    if (!agreed) {
      toast.error("Please read and agree to the liability release");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get IP address (best effort, uses public API)
      let ipAddress = "unknown";
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch {
        console.log("Could not fetch IP address");
      }

      const { error } = await supabase.from("user_agreements").insert({
        user_id: userId,
        waiver_version: CURRENT_WAIVER_VERSION,
        ip_address: ipAddress,
        user_agent: navigator.userAgent,
      });

      if (error) throw error;

      toast.success("Waiver signed successfully");
      onSigned();
    } catch (error) {
      console.error("Error signing waiver:", error);
      toast.error("Failed to sign waiver. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-amber-500" />
          </div>
          <DialogTitle className="text-xl md:text-2xl font-bold">
            Assumption of Risk & Liability Release
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Please read and acknowledge the following before generating your pass.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This digital agreement creates a legally binding record and audit trail.
            </p>
          </div>

          {/* Waiver Text */}
          <div className="bg-muted/50 border rounded-lg p-4 space-y-4">
            <p className="text-sm leading-relaxed">
              By generating this pass, I voluntarily assume all risks related to attendance at private events. 
              I hereby <span className="font-semibold">release, indemnify, and hold harmless</span> Clean Check, 
              its partner laboratories, and any participating Venue from any claims, liabilities, or health 
              consequences arising from my participation.
            </p>
            
            <p className="text-sm leading-relaxed">
              I understand that:
            </p>
            <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
              <li>Clean Check provides verification services only and is not a medical provider</li>
              <li>Test results do not guarantee health status beyond the date of testing</li>
              <li>I am responsible for my own health decisions and disclosures</li>
              <li>Partner venues may have additional requirements or policies</li>
            </ul>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-3 p-4 border rounded-lg bg-background">
            <Checkbox
              id="waiver-agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-0.5"
            />
            <label
              htmlFor="waiver-agree"
              className="text-sm font-medium leading-relaxed cursor-pointer"
            >
              I have read and agree to the <span className="text-primary font-semibold">Assumption of Risk & Liability Release</span>. 
              I understand this creates a digital record of my acknowledgment.
            </label>
          </div>

          {/* Sign Button */}
          <Button
            onClick={handleSign}
            disabled={!agreed || isSubmitting}
            className="w-full min-h-[48px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Sign & Generate Pass
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your signature, timestamp, and IP address will be securely logged for legal compliance.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiabilityWaiverModal;

// Hook to check waiver status
export const useWaiverStatus = (userId: string) => {
  const [hasSignedWaiver, setHasSignedWaiver] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waiverSignedAt, setWaiverSignedAt] = useState<string | null>(null);

  const checkWaiverStatus = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_agreements")
        .select("signed_at, waiver_version")
        .eq("user_id", userId)
        .eq("waiver_version", CURRENT_WAIVER_VERSION)
        .order("signed_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setHasSignedWaiver(true);
        setWaiverSignedAt(data[0].signed_at);
      } else {
        setHasSignedWaiver(false);
      }
    } catch (error) {
      console.error("Error checking waiver status:", error);
      setHasSignedWaiver(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { hasSignedWaiver, isLoading, waiverSignedAt, checkWaiverStatus, setHasSignedWaiver };
};