import React, { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TextDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  textUrl: string;
  title: string;
}

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; text: string; fileName: string }
  | { status: "error"; message: string };

export const TextDocumentModal = ({ isOpen, onClose, textUrl, title }: TextDocumentModalProps) => {
  const fileName = useMemo(() => {
    const fallback = "document.txt";
    if (!textUrl) return fallback;
    return textUrl.split("/").pop() || fallback;
  }, [textUrl]);

  const fullTextUrl = useMemo(() => {
    if (!textUrl) return "";
    return textUrl.startsWith("http") ? textUrl : `${window.location.origin}${textUrl}`;
  }, [textUrl]);

  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });

  useEffect(() => {
    const abort = new AbortController();

    const run = async () => {
      if (!isOpen || !textUrl) return;

      setLoadState({ status: "loading" });
      try {
        const res = await fetch(fullTextUrl, {
          signal: abort.signal,
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!res.ok) throw new Error(`Text request failed (${res.status})`);

        const text = await res.text();
        setLoadState({ status: "ready", text, fileName });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load document";
        setLoadState({ status: "error", message });
      }
    };

    run();

    return () => {
      abort.abort();
      setLoadState({ status: "idle" });
    };
  }, [isOpen, textUrl, fullTextUrl, fileName]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fullTextUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (!fullTextUrl) return;
    window.open(fullTextUrl, "_blank", "noopener,noreferrer");
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
            Couldn't load the document ({loadState.message}).
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={handleOpenInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Text
            </Button>
          </div>
        </div>
      );
    }

    if (loadState.status === "ready") {
      return (
        <ScrollArea className="h-full w-full">
          <article className="p-6">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-sans">
              {loadState.text}
            </pre>
          </article>
        </ScrollArea>
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
          <DialogTitle className="text-lg font-semibold text-foreground pr-8">{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleOpenInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Tab
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Text
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 w-full overflow-hidden">{content}</div>
      </DialogContent>
    </Dialog>
  );
};
