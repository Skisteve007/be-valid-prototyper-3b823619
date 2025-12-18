import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const ResponsiveHeader = () => {
  return (
    <header className="w-full px-2 sm:px-8 md:px-16 lg:px-24 py-3 sm:py-4 flex items-center justify-between bg-transparent absolute top-0 left-0 right-0 z-50">
      {/* Logo - Text Only */}
      <Link to="/" className="flex flex-col items-start shrink-0">
        <span className="text-base sm:text-2xl md:text-3xl font-bold font-display tracking-[0.12em] sm:tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
          VALID<sup className="text-[0.5em] text-cyan-400">™</sup>
        </span>
        {/* Shorter text on mobile */}
        <span className="text-[0.45rem] sm:text-[0.5rem] md:text-[0.6rem] tracking-[0.08em] sm:tracking-[0.15em] text-cyan-400/80 font-medium uppercase">
          <span className="hidden xs:inline">Powered By </span>Synth AI
        </span>
      </Link>

      {/* Right Side Controls */}
      <div className="flex items-center gap-1.5 sm:gap-4">
        {/* Partner Solutions Button - Visible on all screens */}
        <Link 
          to="/partners" 
          className="px-2 sm:px-4 py-1.5 sm:py-2 text-[0.6rem] sm:text-sm font-bold tracking-wide sm:tracking-wider uppercase rounded-full border border-amber-400/60 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all whitespace-nowrap"
        >
          Partners
        </Link>
        
        {/* Theme Toggle - hidden on very small screens */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        
        {/* Member Login Pill */}
        <Link 
          to="/auth?mode=login" 
          className="px-2 sm:px-6 py-1.5 sm:py-2.5 text-[0.6rem] sm:text-sm font-bold tracking-wide sm:tracking-wider uppercase rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all whitespace-nowrap"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default ResponsiveHeader;
