import { useState, useEffect } from "react";
import { Globe, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Language {
  code: string;
  flag: string;
  nativeName: string;
}

// Supported languages matching memory: English, Spanish, Russian, Hebrew, Portuguese, Romanian, Haitian Creole
const languages: Language[] = [
  { code: "en", flag: "🇺🇸", nativeName: "English" },
  { code: "es", flag: "🇪🇸", nativeName: "Español" },
  { code: "ru", flag: "🇷🇺", nativeName: "Русский" },
  { code: "he", flag: "🇮🇱", nativeName: "עברית" },
  { code: "pt", flag: "🇧🇷", nativeName: "Português" },
  { code: "ro", flag: "🇷🇴", nativeName: "Română" },
  { code: "ht", flag: "🇭🇹", nativeName: "Kreyòl Ayisyen" },
];

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

// Track if Google Translate is ready
let googleTranslateReady = false;

// Initialize Google Translate
function initGoogleTranslate() {
  console.log("[LanguageSelector] Initializing Google Translate...");
  
  // Create hidden translate element first
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    div.style.left = '-9999px';
    document.body.appendChild(div);
    console.log("[LanguageSelector] Created google_translate_element div");
  }

  // Define the callback BEFORE loading the script
  window.googleTranslateElementInit = function() {
    console.log("[LanguageSelector] googleTranslateElementInit callback fired");
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,es,ru,he,pt,ro,ht',
        autoDisplay: false,
      },
      'google_translate_element'
    );
    googleTranslateReady = true;
    console.log("[LanguageSelector] Google Translate initialized successfully");
  };

  // Add Google Translate script if not already present
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {
      console.error("[LanguageSelector] Failed to load Google Translate script - may be blocked by CSP");
    };
    script.onload = () => {
      console.log("[LanguageSelector] Google Translate script loaded");
    };
    document.body.appendChild(script);
    console.log("[LanguageSelector] Added Google Translate script to page");
  }
}

// Helper to apply language once widget is ready
function applyGoogleTranslateLanguage(langCode: string, attempts = 0) {
  const maxAttempts = 30;

  // Wait until Google Translate has initialized AND the combo exists
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");

  if (googleTranslateReady && combo) {
    combo.value = langCode;
    combo.dispatchEvent(new Event("change"));
    console.log("[LanguageSelector] Language applied via Google Translate:", langCode);
    return;
  }

  if (attempts < maxAttempts) {
    setTimeout(() => applyGoogleTranslateLanguage(langCode, attempts + 1), 300);
  } else {
    console.warn("[LanguageSelector] Failed to find Google Translate combo after retries");
  }
}

function setLanguage(langCode: string) {
  // Save preference
  localStorage.setItem("userLanguage", langCode);

  if (langCode === "en") {
    // Clear googtrans cookies to reset to original language
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;

    // Try to reset via the combo (no reload)
    applyGoogleTranslateLanguage("en");
    return;
  }

  // Set the googtrans cookie (Google Translate reads this)
  const googleTranslateCookie = `/en/${langCode}`;
  document.cookie = `googtrans=${googleTranslateCookie}; path=/`;
  document.cookie = `googtrans=${googleTranslateCookie}; path=/; domain=${window.location.hostname}`;

  // Apply via Google Translate combo with retry logic
  applyGoogleTranslateLanguage(langCode);
}

function getCurrentLanguage(): Language {
  // Check localStorage first
  const savedLang = localStorage.getItem('userLanguage');
  if (savedLang) {
    const lang = languages.find(l => l.code === savedLang);
    if (lang) return lang;
  }

  // Check Google Translate cookie
  const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
  if (match && match[1]) {
    const lang = languages.find(l => l.code === match[1]);
    if (lang) return lang;
  }

  // Default to English
  return languages[0];
}

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getCurrentLanguage);

  useEffect(() => {
    initGoogleTranslate();

    // Re-apply the saved language after Google Translate initializes
    const lang = getCurrentLanguage();
    applyGoogleTranslateLanguage(lang.code);
  }, []);

  const handleLanguageChange = (language: Language) => {
    if (currentLanguage.code === language.code) return;
    setCurrentLanguage(language);
    setLanguage(language.code);
  };

  return (
    <DropdownMenu>
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
        className="w-56 max-h-64 overflow-y-auto bg-popover border border-border shadow-lg z-[100] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-muted/30 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border mb-1">
          🌐 Select Language
        </div>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`flex items-center justify-between gap-3 cursor-pointer ${
              currentLanguage.code === language.code ? "bg-accent" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">{language.flag}</span>
              <span className="font-medium text-sm">{language.nativeName}</span>
            </div>
            {currentLanguage.code === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
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
