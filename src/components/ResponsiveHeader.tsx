import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import SynthButton from './SynthButton';

const ResponsiveHeader = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Text Only */}
          <Link 
            to="/" 
            className="flex items-center gap-2 flex-shrink-0"
            onClick={closeMobileMenu}
          >
            <span className="text-2xl md:text-3xl font-bold font-orbitron tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
              VALID<sup className="text-xs text-cyan-400">™</sup>
            </span>
            <span className="px-2 py-0.5 text-[8px] md:text-[10px] font-bold tracking-wider uppercase rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)] animate-pulse whitespace-nowrap">
              Beta
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <LanguageSelector />
            <Link 
              to="/vendor-portal" 
              className="text-sm text-muted-foreground font-medium hover:text-primary transition whitespace-nowrap"
            >
              For Enterprise
            </Link>
            <Link 
              to="/partners" 
              className="text-sm text-foreground font-medium hover:text-primary transition whitespace-nowrap"
            >
              {t('nav.partnerSolutions')}
            </Link>
            <Link 
              to="/investor-portal" 
              className="text-sm text-foreground font-medium hover:text-primary transition whitespace-nowrap"
            >
              Investors
            </Link>
            <Link 
              to="/auth?mode=login" 
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-full transition whitespace-nowrap"
            >
              {t('nav.logIn')}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-foreground hover:text-primary transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border/50 mt-2 pt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <Link 
              to="/vendor-portal" 
              className="block px-3 py-2 text-sm text-muted-foreground font-medium hover:text-primary hover:bg-muted/50 rounded-lg transition"
              onClick={closeMobileMenu}
            >
              For Enterprise
            </Link>
            <Link 
              to="/partners" 
              className="block px-3 py-2 text-sm text-foreground font-medium hover:text-primary hover:bg-muted/50 rounded-lg transition"
              onClick={closeMobileMenu}
            >
              {t('nav.partnerSolutions')}
            </Link>
            <Link 
              to="/investor-portal" 
              className="block px-3 py-2 text-sm text-foreground font-medium hover:text-primary hover:bg-muted/50 rounded-lg transition"
              onClick={closeMobileMenu}
            >
              Investors
            </Link>
            <div className="px-3 py-2">
              <LanguageSelector />
            </div>
            <div className="px-3 py-2">
              <SynthButton variant="menu-item" />
            </div>
            <Link 
              to="/auth?mode=login" 
              className="block mx-3 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-full transition text-center"
              onClick={closeMobileMenu}
            >
              {t('nav.logIn')}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default ResponsiveHeader;
