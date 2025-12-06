import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface AgeVerificationDialogProps {
  open: boolean;
  onVerify: () => void;
  onExit: () => void;
}

export const AgeVerificationDialog = ({ open, onVerify, onExit }: AgeVerificationDialogProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-[90vw] max-w-sm sm:max-w-md mx-auto p-4 sm:p-6 top-[20%] translate-y-0">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl sm:text-2xl text-center">
            🔞 Age Verification Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base sm:text-lg py-2 sm:py-4">
            You must be 18 years of age or older to enter this site.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span className="text-[11px] sm:text-xs leading-tight text-foreground">
              I am 18+ and I agree to the{" "}
              <a 
                href="/terms" 
                className="underline hover:opacity-80 text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                VALID Terms of Use
              </a>.
            </span>
          </div>

          <Button
            onClick={() => {
              if (!acceptedTerms) return;
              onVerify();
            }}
            disabled={!acceptedTerms}
            className="w-full h-10 sm:h-12 text-sm sm:text-base"
          >
            Enter Site
          </Button>

          <Button
            variant="outline"
            onClick={onExit}
            className="w-full h-9 sm:h-10 text-sm"
          >
            Exit
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
