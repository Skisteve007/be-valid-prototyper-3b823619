import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgeVerificationDialogProps {
  open: boolean;
  onVerify: () => void;
  onExit: () => void;
}

export const AgeVerificationDialog = ({ open, onVerify, onExit }: AgeVerificationDialogProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-[90vw] max-w-sm sm:max-w-md mx-auto p-4 sm:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl sm:text-2xl text-center">
            🔞 Age Verification Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base sm:text-lg py-2 sm:py-4">
            You must be 18 years of age or older to enter this site.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2 sm:gap-3">
          <Button
            onClick={() => {
              if (!acceptedTerms) return;
              onVerify();
            }}
            aria-disabled={!acceptedTerms}
            className={cn(
              "w-full h-12 sm:h-14 text-base sm:text-lg",
              !acceptedTerms && "opacity-60 cursor-not-allowed"
            )}
          >
            <div className="flex items-center justify-center gap-2 px-1 sm:px-2">
              <input
                type="checkbox"
                className="h-4 w-4 flex-shrink-0"
                checked={acceptedTerms}
                onChange={(e) => {
                  e.stopPropagation();
                  setAcceptedTerms(e.target.checked);
                }}
              />
              <span className="text-xs sm:text-sm leading-tight">
                I am 18+ and I agree to the{" "}
                <a 
                  href="/terms" 
                  className="underline hover:opacity-80"
                  onClick={(e) => e.stopPropagation()}
                >
                  CleanCheck Terms of Use
                </a>.
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={onExit}
            className="w-full h-10 sm:h-14"
          >
            Exit
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
