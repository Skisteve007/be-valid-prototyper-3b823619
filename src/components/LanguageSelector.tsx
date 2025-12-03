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

// Global market languages - expanded for international reach
const languages: Language[] = [
  { code: "en", googleCode: "en", flag: "🇺🇸", nativeName: "English" },
  { code: "es", googleCode: "es", flag: "🇪🇸", nativeName: "Español" },
  { code: "ru", googleCode: "ru", flag: "🇷🇺", nativeName: "Русский" },
  { code: "he", googleCode: "iw", flag: "🇮🇱", nativeName: "עברית" },
  { code: "pt", googleCode: "pt", flag: "🇧🇷", nativeName: "Português" },
  { code: "ro", googleCode: "ro", flag: "🇷🇴", nativeName: "Română" },
  { code: "ht", googleCode: "ht", flag: "🇭🇹", nativeName: "Kreyòl" },
  { code: "de", googleCode: "de", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "it", googleCode: "it", flag: "🇮🇹", nativeName: "Italiano" },
  { code: "tl", googleCode: "tl", flag: "🇵🇭", nativeName: "Tagalog" },
  { code: "th", googleCode: "th", flag: "🇹🇭", nativeName: "ไทย" },
  { code: "zh-CN", googleCode: "zh-CN", flag: "🇨🇳", nativeName: "中文" },
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

  const triggerGoogleTranslate = useCallback((langCode: string, shouldReload: boolean = false) => {
    // Set cookie for Google Translate
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    
    // Find and trigger Google Translate's select element
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    } else if (shouldReload) {
      // If Google Translate widget not ready, reload to apply translation
      window.location.href = window.location.pathname;
    }
  }, []);

  const handleLanguageChange = useCallback((language: Language) => {
    // Prevent action if already on this language
    if (currentLanguage.code === language.code) return;
    
    setCurrentLanguage(language);
    localStorage.setItem("preferred-language", language.code);
    
    if (language.code === 'en') {
      // Reset to English - clear translation cookies
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      // Remove the Google Translate frame if it exists
      const translateFrame = document.querySelector('.goog-te-banner-frame');
      if (translateFrame) {
        translateFrame.remove();
      }
      // Single controlled reload to clear translation
      window.location.href = window.location.pathname;
    } else {
      // User-initiated change: reload if widget not ready
      triggerGoogleTranslate(language.googleCode, true);
    }
  }, [currentLanguage.code, triggerGoogleTranslate]);

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
  }, [handleLanguageChange]);

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-language");
    if (savedLang && isGoogleLoaded) {
      const lang = languages.find(l => l.code === savedLang);
      if (lang && lang.code !== 'en') {
        setCurrentLanguage(lang);
        // Apply translation on load only if Google is ready
        setTimeout(() => triggerGoogleTranslate(lang.googleCode), 500);
      } else if (lang) {
        setCurrentLanguage(lang);
      }
    }
  }, [isGoogleLoaded, triggerGoogleTranslate]);

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
