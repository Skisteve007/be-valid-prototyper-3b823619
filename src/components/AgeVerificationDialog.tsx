import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
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
        <AlertDialogFooter className="flex-col sm:flex-col gap-3">
          <AlertDialogAction
            onClick={onVerify}
            className="w-full h-14 text-lg"
          >
            ✅ I am 18+ (Enter)
          </AlertDialogAction>
          <Button
            variant="outline"
            onClick={onExit}
            className="w-full h-14"
          >
            ❌ Exit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
