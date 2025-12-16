import React from 'react';
import { Link } from 'react-router-dom';

const ResponsiveHeader = () => {
  return (
    <header className="w-full px-6 md:px-12 py-4 flex items-center justify-between bg-transparent absolute top-0 left-0 right-0 z-50">
      {/* Logo - Text Only */}
      <Link to="/" className="flex items-center">
        <span className="text-2xl md:text-3xl font-bold font-display tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
          VALID<sup className="text-[0.5em] text-cyan-400">™</sup>
        </span>
      </Link>

      {/* Member Login Pill */}
      <Link 
        to="/auth?mode=login" 
        className="px-6 py-2.5 text-sm font-bold tracking-wider uppercase rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
      >
        Member Login
      </Link>
    </header>
  );
};

export default ResponsiveHeader;
