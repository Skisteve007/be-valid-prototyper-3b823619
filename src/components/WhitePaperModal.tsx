import React from "react";
import { Download, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WhitePaperContent } from "@/components/WhitePaperContent";

interface WhitePaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl?: string;
}

export const WhitePaperModal = ({ isOpen, onClose, title, pdfUrl }: WhitePaperModalProps) => {
  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfUrl.split("/").pop() || "whitepaper.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-background border-border flex flex-col">
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between shrink-0">
          <DialogTitle className="text-lg font-semibold text-foreground pr-8">
            {title}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {pdfUrl && (
              <Button
                size="sm"
                onClick={handleDownload}
                className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 w-full overflow-hidden bg-card">
          <WhitePaperContent />
        </div>
      </DialogContent>
    </Dialog>
  );
};
