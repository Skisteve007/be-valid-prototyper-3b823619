import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useTranslation();
  
  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between relative">
        {/* Logo - Centered on mobile via absolute positioning */}
        <Link 
          to="/" 
          className="flex items-center gap-2 md:relative absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto"
        >
          <Shield className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          <span className="text-lg md:text-xl font-bold tracking-widest text-foreground">VALID<sup className="text-xs text-primary">™</sup></span>
        </Link>
        
        {/* Beta Version Pill - Center */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 text-[10px] md:text-xs font-bold tracking-wider uppercase rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)] animate-pulse">
            Beta Version
          </span>
        </div>
        
        {/* Spacer for mobile centering */}
        <div className="w-10 md:hidden" />
        
        {/* Right side controls - visible and contained within 15px gutter */}
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSelector />
          <Link 
            to="/partners" 
            className="text-sm text-foreground font-medium hover:text-primary transition hidden sm:block"
          >
            {t('nav.partnerSolutions')}
          </Link>
          <Link 
            to="/auth?mode=login" 
            className="px-3 md:px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-full transition whitespace-nowrap"
          >
            {t('nav.logIn')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
