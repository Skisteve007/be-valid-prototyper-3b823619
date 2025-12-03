import { useState, useEffect, useCallback } from "react";
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
  googleCode: string; // Google Translate uses slightly different codes
}

// The "Boca 7" - South Florida market languages
const languages: Language[] = [
  { code: "en", googleCode: "en", flag: "🇺🇸", nativeName: "English" },
  { code: "es", googleCode: "es", flag: "🇪🇸", nativeName: "Español" },
  { code: "ru", googleCode: "ru", flag: "🇷🇺", nativeName: "Русский" },
  { code: "he", googleCode: "iw", flag: "🇮🇱", nativeName: "עברית" },
  { code: "pt", googleCode: "pt", flag: "🇧🇷", nativeName: "Português" },
  { code: "ro", googleCode: "ro", flag: "🇷🇴", nativeName: "Română" },
  { code: "ht", googleCode: "ht", flag: "🇭🇹", nativeName: "Kreyòl" },
];

// Declare Google Translate types
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: {
          new (options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          }, element: string): void;
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
  }
}

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Initialize Google Translate
  useEffect(() => {
    // Check if script already exists
    if (document.getElementById('google-translate-script')) {
      return;
    }

    // Create hidden container for Google Translate
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    translateDiv.style.display = 'none';
    document.body.appendChild(translateDiv);

    // Define the init function
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: languages.map(l => l.googleCode).join(','),
            autoDisplay: true,
          },
          'google_translate_element'
        );
        setIsGoogleLoaded(true);
      }
    };

    // Load Google Translate script
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup not needed as we want to keep the translator active
    };
  }, []);

  // Auto-detect browser language and show prompt
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const matchedLang = languages.find(l => l.code === browserLang && l.code !== 'en');
    
    if (matchedLang) {
      const prompted = sessionStorage.getItem('language-prompt-shown');
      if (!prompted) {
        sessionStorage.setItem('language-prompt-shown', 'true');
        // Auto-switch after a brief delay to let user see the prompt
        setTimeout(() => {
          const shouldSwitch = window.confirm(
            `Would you like to view Clean Check in ${matchedLang.nativeName}?`
          );
          if (shouldSwitch) {
            handleLanguageChange(matchedLang);
          }
        }, 1500);
      }
    }
  }, []);

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-language");
    if (savedLang) {
      const lang = languages.find(l => l.code === savedLang);
      if (lang) {
        setCurrentLanguage(lang);
        // Apply translation on load
        triggerGoogleTranslate(lang.googleCode);
      }
    }
  }, [isGoogleLoaded]);

  const triggerGoogleTranslate = useCallback((langCode: string) => {
    // Find and trigger Google Translate's select element
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    } else {
      // Fallback: set cookie directly for Google Translate
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
      // Reload to apply translation
      if (langCode !== 'en') {
        window.location.reload();
      }
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem("preferred-language", language.code);
    
    if (language.code === 'en') {
      // Reset to English - clear translation cookies
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      window.location.reload();
    } else {
      triggerGoogleTranslate(language.googleCode);
    }
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
        className="w-52 bg-popover border border-border shadow-lg z-[100]"
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
            <div className="flex items-center gap-3">
              <span className="text-xl">{language.flag}</span>
              <span className="font-medium">{language.nativeName}</span>
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
