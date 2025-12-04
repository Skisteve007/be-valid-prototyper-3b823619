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
      <AlertDialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-lg !top-[35%] md:!top-[40%] translate-y-[-35%] md:translate-y-[-40%]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl md:text-2xl text-center">
            🔞 Age Verification Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-xl md:text-lg py-4">
            You must be 18 years of age or older to enter this site.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              if (!acceptedTerms) return;
              onVerify();
            }}
            aria-disabled={!acceptedTerms}
            className={cn(
              "w-full h-14 text-lg",
              !acceptedTerms && "opacity-60 cursor-not-allowed"
            )}
          >
            <div className="flex items-center justify-center gap-2 px-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={acceptedTerms}
                onChange={(e) => {
                  e.stopPropagation();
                  setAcceptedTerms(e.target.checked);
                }}
              />
              <span className="text-sm">
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
            className="w-full h-14"
          >
            Exit
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
