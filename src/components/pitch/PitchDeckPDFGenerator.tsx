import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Share2, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { pitchSlides } from "./PitchSlideData";

interface PitchDeckPDFGeneratorProps {
  variant?: "inline" | "button";
  className?: string;
}

const PitchDeckPDFGenerator: React.FC<PitchDeckPDFGeneratorProps> = ({
  variant = "button",
  className = "",
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const generatePDF = async (): Promise<Blob | null> => {
    try {
      setIsGenerating(true);
      
      // Dynamic import to reduce bundle size
      const { default: jsPDF } = await import("jspdf");
      
      // Use a standard page size for better mobile PDF viewer compatibility
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const contentWidth = pageWidth - margin * 2;
      const footerY = pageHeight - 28;
      const maxY = pageHeight - 64;

      const DEBUG = import.meta.env.DEV;

      const lh = (fontSize: number) => Math.round(fontSize * 1.35);

      const setRgb = (rgb: [number, number, number]) => {
        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
      };

      const drawCenteredWrapped = (text: string, y: number, fontSize: number, rgb: [number, number, number]) => {
        doc.setFontSize(fontSize);
        setRgb(rgb);
        const lines = doc.splitTextToSize(text, contentWidth) as string[];
        doc.text(lines, pageWidth / 2, y, { align: "center" });
        return y + lines.length * lh(fontSize);
      };

      const drawLeftWrapped = (text: string, y: number, fontSize: number, rgb: [number, number, number]) => {
        doc.setFontSize(fontSize);
        setRgb(rgb);
        const lines = doc.splitTextToSize(text, contentWidth) as string[];
        doc.text(lines, margin, y);
        return y + lines.length * lh(fontSize);
      };

      const drawBullet = (bullet: string, y: number, fontSize: number) => {
        doc.setFontSize(fontSize);
        // Bullet dot
        setRgb([0, 229, 229]);
        doc.text("•", margin, y);

        // Wrapped bullet text
        setRgb([230, 230, 230]);
        const bulletLines = doc.splitTextToSize(bullet, contentWidth - 18) as string[];
        doc.text(bulletLines, margin + 14, y);
        return y + bulletLines.length * lh(fontSize) + 6;
      };

      // Add each slide as its own page (16 pages total)
      for (let index = 0; index < pitchSlides.length; index++) {
        const slide = pitchSlides[index];

        if (index > 0) {
          doc.addPage("letter", "portrait");
        }

        if (DEBUG) {
          console.debug("[PitchDeckPDF] slide", index + 1, slide);
        }

        // Background
        doc.setFillColor(10, 10, 15);
        doc.rect(0, 0, pageWidth, pageHeight, "F");

        // Choose tighter typography for dense slides so nothing gets dropped.
        const density = (slide.stats?.length ?? 0) + (slide.bullets?.length ?? 0) + (slide.content?.length ?? 0);
        const titleSize = slide.layout === "cover" ? 30 : 26;
        const subtitleSize = density > 10 ? 12 : 13;
        const bodySize = density > 10 ? 10 : 11;

        let y = margin + 28;

        // Title / subtitle
        y = drawCenteredWrapped(slide.title, y, titleSize, [0, 229, 229]);
        if (slide.subtitle) {
          y += 8;
          y = drawCenteredWrapped(slide.subtitle, y, subtitleSize, [230, 230, 230]);
        }

        y += 18;

        // Stats (render as a wrapped list so long labels don't get cut off)
        if (slide.stats && slide.stats.length > 0) {
          for (const stat of slide.stats) {
            const fontSize = y > maxY ? 8 : bodySize;
            y = drawLeftWrapped(`${stat.label}: ${stat.value}`, y, fontSize, [255, 255, 255]);
          }
          y += 10;
        }

        // Content paragraphs
        if (slide.content && slide.content.length > 0) {
          for (const paragraph of slide.content) {
            const fontSize = y > maxY ? 8 : bodySize;
            y = drawLeftWrapped(paragraph, y, fontSize, [230, 230, 230]);
            y += 6;
          }
          y += 6;
        }

        // Bullets
        if (slide.bullets && slide.bullets.length > 0) {
          for (const bullet of slide.bullets) {
            const fontSize = y > maxY ? 8 : bodySize;
            y = drawBullet(bullet, y, fontSize);
          }
        }

        // Highlight (CTA / callout)
        if (slide.highlight) {
          y += 10;
          const fontSize = y > maxY ? 8 : bodySize + 1;
          y = drawLeftWrapped(slide.highlight, y, fontSize, [0, 229, 229]);
        }

        // Footer
        doc.setFontSize(10);
        setRgb([160, 160, 160]);
        doc.text("VALID™ — Confidential", margin, footerY);
        doc.text(`Slide ${index + 1} of ${pitchSlides.length}`, pageWidth - margin, footerY, {
          align: "right",
        });

        if (DEBUG && y > maxY) {
          console.warn(`[PitchDeckPDF] slide ${index + 1} content approached page limit`, { y, maxY });
        }
      }

      // Generate blob
      const pdfOutput = doc.output("blob");
      setPdfBlob(pdfOutput);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      return pdfOutput;
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("PDF generation failed. Please try again.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = pdfBlob || await generatePDF();
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "VALID-Investor-Deck-2025.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      const blob = pdfBlob || await generatePDF();
      if (!blob) return;

      // Check if Web Share API is available (mobile browsers)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], "VALID-Investor-Deck-2025.pdf", { type: "application/pdf" });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "VALID™ Investor Deck",
            text: "Check out the VALID™ Investor Pitch Deck - Zero-Trust Identity & Payment Infrastructure",
            files: [file],
          });
          toast.success("Shared successfully!");
          return;
        }
      }

      // Fallback: mailto with download prompt
      handleEmailFallback();
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        // User cancelled share
        return;
      }
      console.error("Share failed:", error);
      handleEmailFallback();
    }
  };

  const handleEmailFallback = () => {
    // Download the PDF first
    handleDownload();
    
    // Open mailto with instructions
    const subject = encodeURIComponent("VALID™ Investor Deck");
    const body = encodeURIComponent(
      "Hi,\n\nI'd like to share the VALID™ Investor Deck with you.\n\nPlease find the PDF attached (downloaded separately).\n\nKey highlights:\n- Zero-Trust Identity & Payment Infrastructure\n- TAM: $11.4B+\n- Revenue Generating Stage\n\nBest regards"
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    
    toast.info("PDF downloaded! Attach it to your email.");
  };

  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap gap-2 sm:gap-3 ${className}`}>
        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          variant="outline"
          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-xs sm:text-sm"
          style={{ padding: "clamp(8px, 1vw, 12px) clamp(12px, 1.5vw, 20px)" }}
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : showSuccess ? (
            <Check className="w-4 h-4 mr-2 text-green-400" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isGenerating ? "Generating..." : showSuccess ? "Ready!" : "Download PDF"}
        </Button>

        <Button
          onClick={handleShare}
          disabled={isGenerating}
          variant="outline"
          className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 text-xs sm:text-sm"
          style={{ padding: "clamp(8px, 1vw, 12px) clamp(12px, 1.5vw, 20px)" }}
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4 mr-2" />
          )}
          Share / Email
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 ${className}`}>
      <Button
        onClick={handleDownload}
        disabled={isGenerating}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        style={{ fontSize: "clamp(14px, 1vw, 16px)", padding: "clamp(10px, 1vw, 14px) clamp(20px, 2vw, 32px)" }}
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : showSuccess ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        {isGenerating ? "Generating PDF..." : showSuccess ? "PDF Ready!" : "Download Deck (PDF)"}
      </Button>

      <Button
        onClick={handleShare}
        disabled={isGenerating}
        variant="outline"
        className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
        style={{ fontSize: "clamp(14px, 1vw, 16px)", padding: "clamp(10px, 1vw, 14px) clamp(20px, 2vw, 32px)" }}
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Mail className="w-4 h-4 mr-2" />
        )}
        Email / Share
      </Button>
    </div>
  );
};

export default PitchDeckPDFGenerator;
