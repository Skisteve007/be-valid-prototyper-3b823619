import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useTranslation();
  
  return (
    <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-green-400" />
          <span className="text-xl font-bold font-orbitron tracking-widest text-white">VALID<sup className="text-xs text-cyan-400">™</sup></span>
        </Link>
        
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link 
            to="/partners" 
            className="text-sm text-gray-400 hover:text-white transition hidden sm:block"
          >
            {t('nav.partnerSolutions')}
          </Link>
          <Link 
            to="/access-portal" 
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-full transition"
          >
            {t('nav.logIn')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
