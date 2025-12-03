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

// Supported languages for path-prefix routing
const languages: Language[] = [
  { code: "en", flag: "🇺🇸", nativeName: "English" },
  { code: "es", flag: "🇪🇸", nativeName: "Español" },
  { code: "pt", flag: "🇧🇷", nativeName: "Português" },
  { code: "fr", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "ja", flag: "🇯🇵", nativeName: "日本語" },
  { code: "ko", flag: "🇰🇷", nativeName: "한국어" },
  { code: "zh", flag: "🇨🇳", nativeName: "中文" },
  { code: "ar", flag: "🇸🇦", nativeName: "العربية" },
  { code: "ru", flag: "🇷🇺", nativeName: "Русский" },
  { code: "hi", flag: "🇮🇳", nativeName: "हिन्दी" },
];

const supportedLangCodes = languages.map(l => l.code);

function setLanguagePreference(newLangCode: string) {
  if (!supportedLangCodes.includes(newLangCode)) {
    console.error("Invalid language code selected:", newLangCode);
    return;
  }

  // Save the selected language to local storage for persistence
  localStorage.setItem('userLanguage', newLangCode);

  // Identify the current URL path
  const currentPath = window.location.pathname;
  
  // Extract the existing language prefix if it exists
  const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
  let newPath = '';

  if (pathSegments.length > 0 && supportedLangCodes.includes(pathSegments[0])) {
    // If the current path has a language prefix, replace it
    pathSegments[0] = newLangCode;
    newPath = '/' + pathSegments.join('/');
  } else {
    // If there is no language prefix, add the new language code to the start
    newPath = '/' + newLangCode + currentPath;
  }

  // Force a hard redirect to the new language-specific URL
  window.location.href = window.location.origin + newPath + window.location.search;
}

function getCurrentLanguageFromPath(): Language {
  const currentPath = window.location.pathname;
  const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
  
  if (pathSegments.length > 0 && supportedLangCodes.includes(pathSegments[0])) {
    const lang = languages.find(l => l.code === pathSegments[0]);
    if (lang) return lang;
  }
  
  // Check localStorage as fallback
  const savedLang = localStorage.getItem('userLanguage');
  if (savedLang) {
    const lang = languages.find(l => l.code === savedLang);
    if (lang) return lang;
  }
  
  // Default to English
  return languages[0];
}

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  // Initialize state using the robust function immediately
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getCurrentLanguageFromPath);

  const handleLanguageChange = (language: Language) => {
    if (currentLanguage.code === language.code) return;
    setLanguagePreference(language.code);
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
