import { useEffect } from "react";
import { Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

function initGoogleTranslate() {
  // Define the callback BEFORE loading the script
  (window as any).googleTranslateElementInit = function () {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es,ru,he,pt,ro,ht",
          autoDisplay: false,
        },
        "google_translate_element"
      );
      console.log("[LanguageSelector] Google Translate initialized");
    }
  };

  // Load the Google Translate script once
  if (!document.getElementById("google-translate-script")) {
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }
}

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    initGoogleTranslate();
  }, []);

  // Re-initialize widget when dropdown opens (in case it wasn't ready before)
  useEffect(() => {
    if (isOpen && window.google?.translate?.TranslateElement) {
      const container = document.getElementById("google_translate_element");
      // Only reinitialize if container is empty
      if (container && !container.hasChildNodes()) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,es,ru,he,pt,ro,ht",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    }
  }, [isOpen]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative h-10 w-10 rounded-full border-2 border-amber-600/50 bg-gradient-to-br from-amber-700/20 via-amber-600/20 to-amber-700/20 hover:from-amber-700/30 hover:via-amber-600/30 hover:to-amber-700/30 hover:border-amber-500/70 transition-all shadow-[0_0_15px_rgba(180,140,80,0.5)] hover:shadow-[0_0_20px_rgba(180,140,80,0.7)] ${className}`}
          aria-label="Select language"
        >
          <Globe className="h-6 w-6 text-white drop-shadow-[0_0_4px_rgba(180,140,80,0.8)]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 max-h-64 bg-popover border border-border shadow-lg z-[100] p-2"
      >
        <div className="text-xs font-semibold text-muted-foreground mb-1">
          🌐 Select Language
        </div>
        <div
          id="google_translate_element"
          className="text-[11px] leading-tight [&_.goog-te-combo]:w-full [&_.goog-te-combo]:p-2 [&_.goog-te-combo]:border [&_.goog-te-combo]:border-border [&_.goog-te-combo]:rounded-md [&_.goog-te-combo]:bg-background [&_.goog-te-combo]:text-foreground"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface LanguageWelcomeBannerProps {
  className?: string;
}

export function LanguageWelcomeBanner({ className }: LanguageWelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("language-banner-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("language-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-gradient-to-r from-primary/20 via-pink-500/20 to-primary/20 border-b border-border/40 ${className}`}>
      <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-2">
        <p className="text-xs sm:text-sm text-foreground font-medium flex items-center gap-1.5 flex-wrap">
          <span>Clean Check speaks your language.</span>
          <span className="inline-flex items-center gap-1">
            Tap <Globe className="h-4 w-4 inline" /> to change.
          </span>
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-destructive/20 flex-shrink-0"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
