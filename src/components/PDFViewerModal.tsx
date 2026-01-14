import React from "react";
import { X, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

export const PDFViewerModal = ({ isOpen, onClose, pdfUrl, title }: PDFViewerModalProps) => {
  // Build full URL for the PDF
  const fullPdfUrl = pdfUrl.startsWith('http') ? pdfUrl : `${window.location.origin}${pdfUrl}`;
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfUrl.split('/').pop() || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(fullPdfUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-background border-border flex flex-col">
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between shrink-0">
          <DialogTitle className="text-lg font-semibold text-foreground pr-8">
            {title}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenInNewTab}
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Tab
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 w-full overflow-hidden bg-muted">
          <object
            data={fullPdfUrl}
            type="application/pdf"
            className="w-full h-full"
          >
            <embed
              src={fullPdfUrl}
              type="application/pdf"
              className="w-full h-full"
            />
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Unable to display PDF inline. Please use the buttons below to view or download.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleOpenInNewTab}
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
                <Button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </object>
        </div>
      </DialogContent>
    </Dialog>
  );
};
