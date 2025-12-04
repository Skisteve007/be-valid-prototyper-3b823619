import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AgeVerificationDialogProps {
  open: boolean;
  onVerify: () => void;
  onExit: () => void;
}

export const AgeVerificationDialog = ({ open, onVerify, onExit }: AgeVerificationDialogProps) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-lg !top-[35%] md:!top-[40%] translate-y-[-35%] md:translate-y-[-40%]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl md:text-2xl text-center">
            🔞 Age Verification Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-xl md:text-lg py-4">
            You must be 18 years of age or older to enter this site.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex items-start space-x-3 py-4">
          <Checkbox 
            id="terms-agreement" 
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
          />
          <Label 
            htmlFor="terms-agreement" 
            className="text-sm leading-relaxed cursor-pointer"
          >
            I am 18+ and I agree to the CleanCheck{" "}
            <Link 
              to="/terms" 
              className="text-primary underline hover:text-primary/80"
              onClick={(e) => e.stopPropagation()}
            >
              Terms of Use
            </Link>
            .
          </Label>
        </div>

        <AlertDialogAction
          onClick={onVerify}
          disabled={!agreed}
          className="w-full h-14 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          I am 18+ (Enter)
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
};
