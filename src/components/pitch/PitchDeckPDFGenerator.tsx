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
      
      // Create landscape PDF for slides
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [1920, 1080], // Full HD slide dimensions
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 60;
      const contentWidth = pageWidth - margin * 2;

      // Add each slide as a page
      pitchSlides.forEach((slide, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Background
        doc.setFillColor(10, 10, 15);
        doc.rect(0, 0, pageWidth, pageHeight, "F");

        // Slide number indicator
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`${index + 1} / ${pitchSlides.length}`, pageWidth - margin, pageHeight - 30);

        // VALID watermark
        doc.setFontSize(10);
        doc.setTextColor(0, 229, 229);
        doc.text("VALID™ INVESTOR DECK", margin, pageHeight - 30);

        // Layout based on slide type
        const centerY = pageHeight / 2;

        // Title
        doc.setFontSize(slide.layout === "cover" ? 72 : 48);
        doc.setTextColor(0, 229, 229);
        const titleY = slide.layout === "cover" ? centerY - 100 : 120;
        doc.text(slide.title, pageWidth / 2, titleY, { align: "center" });

        // Subtitle
        if (slide.subtitle) {
          doc.setFontSize(slide.layout === "cover" ? 28 : 24);
          doc.setTextColor(200, 200, 200);
          doc.text(slide.subtitle, pageWidth / 2, titleY + 60, { align: "center" });
        }

        // Stats
        if (slide.stats && slide.stats.length > 0) {
          const statStartY = titleY + 140;
          const statWidth = contentWidth / slide.stats.length;
          
          slide.stats.forEach((stat, statIdx) => {
            const statX = margin + statWidth * statIdx + statWidth / 2;
            
            doc.setFontSize(36);
            doc.setTextColor(255, 255, 255);
            doc.text(stat.value, statX, statStartY, { align: "center" });
            
            doc.setFontSize(14);
            doc.setTextColor(0, 229, 229);
            doc.text(stat.label.toUpperCase(), statX, statStartY + 30, { align: "center" });
          });
        }

        // Bullets
        if (slide.bullets && slide.bullets.length > 0) {
          const bulletStartY = slide.stats ? titleY + 260 : titleY + 120;
          const bulletSpacing = 40;
          
          doc.setFontSize(20);
          slide.bullets.forEach((bullet, bulletIdx) => {
            doc.setTextColor(0, 229, 229);
            doc.text("•", margin + 20, bulletStartY + bulletIdx * bulletSpacing);
            doc.setTextColor(220, 220, 220);
            doc.text(bullet, margin + 50, bulletStartY + bulletIdx * bulletSpacing);
          });
        }

        // Content paragraphs
        if (slide.content && slide.content.length > 0) {
          const contentStartY = titleY + 120;
          doc.setFontSize(22);
          doc.setTextColor(220, 220, 220);
          
          slide.content.forEach((text, textIdx) => {
            doc.text(text, pageWidth / 2, contentStartY + textIdx * 50, { align: "center" });
          });
        }

        // Highlight (CTA)
        if (slide.highlight) {
          doc.setFontSize(24);
          doc.setTextColor(0, 229, 229);
          const highlightY = slide.layout === "cta" ? pageHeight - 150 : pageHeight - 100;
          doc.text(slide.highlight, pageWidth / 2, highlightY, { align: "center" });
        }
      });

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
