import { useState, useEffect } from "react";
import { Globe, X } from "lucide-react";
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

const languages: Language[] = [
  { code: "en", flag: "🇺🇸", nativeName: "English" },
  { code: "es", flag: "🇪🇸", nativeName: "Español" },
  { code: "ro", flag: "🇷🇴", nativeName: "Română" },
  { code: "ht", flag: "🇭🇹", nativeName: "Kreyòl" },
  { code: "fr", flag: "🇫🇷", nativeName: "Français" },
  { code: "pt", flag: "🇧🇷", nativeName: "Português" },
  { code: "ru", flag: "🇷🇺", nativeName: "Русский" },
];

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-language");
    if (savedLang) {
      const lang = languages.find(l => l.code === savedLang);
      if (lang) setCurrentLanguage(lang);
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem("preferred-language", language.code);
    // In a real implementation, this would trigger translation logic
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative h-9 w-9 rounded-full border border-border/60 bg-background/80 hover:bg-accent hover:border-primary/40 transition-all shadow-sm ${className}`}
          aria-label="Select language"
        >
          <Globe className="h-5 w-5 text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-popover border border-border shadow-lg z-[100]"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`flex items-center gap-3 cursor-pointer ${
              currentLanguage.code === language.code ? "bg-accent" : ""
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="font-medium">{language.nativeName}</span>
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
        <p className="text-xs sm:text-sm text-foreground font-medium flex items-center gap-2">
          <span>🌐</span>
          <span>Clean Check speaks your language. Tap</span>
          <Globe className="h-4 w-4 inline" />
          <span>to change.</span>
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-destructive/20"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
