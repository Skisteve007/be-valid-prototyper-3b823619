import React, { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; objectUrl: string; fileName: string }
  | { status: "error"; message: string };

export const PDFViewerModal = ({ isOpen, onClose, pdfUrl, title }: PDFViewerModalProps) => {
  const fileName = useMemo(() => {
    const fallback = "document.pdf";
    if (!pdfUrl) return fallback;
    return pdfUrl.split("/").pop() || fallback;
  }, [pdfUrl]);

  const fullPdfUrl = useMemo(() => {
    if (!pdfUrl) return "";
    return pdfUrl.startsWith("http") ? pdfUrl : `${window.location.origin}${pdfUrl}`;
  }, [pdfUrl]);

  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });

  useEffect(() => {
    let abort = new AbortController();
    let createdObjectUrl: string | null = null;

    const run = async () => {
      if (!isOpen || !pdfUrl) return;

      setLoadState({ status: "loading" });
      try {
        // Fetch the PDF as a Blob and render from a local object URL.
        // This avoids issues where browser/extension blocks direct PDF navigation/embedding.
        const res = await fetch(fullPdfUrl, {
          signal: abort.signal,
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!res.ok) {
          throw new Error(`PDF request failed (${res.status})`);
        }

        const blob = await res.blob();
        createdObjectUrl = URL.createObjectURL(blob);
        setLoadState({ status: "ready", objectUrl: createdObjectUrl, fileName });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load PDF";
        setLoadState({ status: "error", message });
      }
    };

    run();

    return () => {
      abort.abort();
      if (createdObjectUrl) URL.revokeObjectURL(createdObjectUrl);
      setLoadState({ status: "idle" });
    };
  }, [isOpen, pdfUrl, fullPdfUrl, fileName]);

  const handleDownload = () => {
    const link = document.createElement("a");

    if (loadState.status === "ready") {
      link.href = loadState.objectUrl;
      link.download = loadState.fileName;
    } else {
      link.href = fullPdfUrl;
      link.download = fileName;
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    const urlToOpen = loadState.status === "ready" ? loadState.objectUrl : fullPdfUrl;
    if (!urlToOpen) return;
    window.open(urlToOpen, "_blank", "noopener,noreferrer");
  };

  const content = (() => {
    if (loadState.status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Loading document…</p>
        </div>
      );
    }

    if (loadState.status === "error") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Couldn't display the PDF inline ({loadState.message}).
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
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
      );
    }

    if (loadState.status === "ready") {
      return (
        <iframe
          src={loadState.objectUrl}
          className="w-full h-full border-0"
          title={title}
        />
      );
    }

    return null;
  })();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
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

        <div className="flex-1 w-full overflow-hidden bg-muted">{content}</div>
      </DialogContent>
    </Dialog>
  );
};
