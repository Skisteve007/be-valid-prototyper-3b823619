import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { Sun, Moon } from 'lucide-react';
import { useIsSteveOwner } from '@/hooks/useIsSteveOwner';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(true);
  const { isSteveOwner } = useIsSteveOwner();

  useEffect(() => {
    // Initialize theme state from DOM
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };
  
  return (
    <footer className="w-full mt-auto border-t border-slate-400 dark:border-slate-700 bg-slate-800 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-4">
      
        {/* Core Tagline */}
        <div className="text-center mb-4 pb-4 border-b border-slate-600">
          <p className="text-lg font-bold text-white tracking-wide">Fluid. Frictionless. Trusted. Zero Stored.</p>
          <p className="text-xs text-gray-400 mt-1">Pipeline, Not Vault — Your data is verified, then purged. Never stored.</p>
        </div>

      {/* Compact Legal Section */}
        <div className="text-[12px] leading-relaxed space-y-1.5 mb-3 text-slate-200">
          <p>© 2025 Giant Ventures LLC. All rights reserved. VALID™ and Ghost™ are trademarks.</p>
          <p><strong className="text-white">{t('footer.disclaimerLabel')}</strong> {t('footer.disclaimerText')}</p>
        </div>

        {/* Legal Notice */}
        <div className="text-[10px] leading-relaxed mb-3 text-slate-400 border-t border-slate-600 pt-3">
          <p className="mb-2"><strong className="text-slate-300">LEGAL NOTICE:</strong> This site is an authorized demonstration environment for the Valid™ platform. Content is provided for evaluation purposes only. No license is granted. Reverse engineering, automated scraping, or reproduction of any portion of this site or its underlying systems is prohibited. Valid™ is patent pending. © 2025 Giant Ventures LLC. All rights reserved.</p>
          <p className="text-slate-500">If you are evaluating Valid™ on behalf of an organization and require an NDA prior to deeper technical discussion, please contact <a href="mailto:steve@bevalid.app" className="text-cyan-400 hover:underline">steve@bevalid.app</a>.</p>
        </div>

        {/* Language Selector */}
        <div className="border-t border-slate-600 pt-3 mb-3">
          <p className="text-xs text-slate-400 mb-2 text-center">{t('footer.selectLanguage')}</p>
          <LanguageSelector variant="footer" />
        </div>

        {/* Contact Email */}
        <div className="text-center py-2 border-t border-slate-600">
          <p className="text-xs text-slate-400">Contact: <a href="mailto:steve@bevalid.app" className="text-cyan-400 hover:underline">steve@bevalid.app</a></p>
        </div>

        {/* Patent Pending Notice */}
        <div className="text-center py-2 border-t border-slate-600">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Patent Pending (Provisional). © Giant Ventures, LLC (Texas). Certain aspects of the Valid / SYNTH / Ghost Protocol systems are the subject of one or more provisional patent applications.
          </p>
        </div>

        {/* Links & Compliance Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] border-t border-slate-600 pt-3 bg-slate-950 -mx-4 px-4 py-3">
          {/* Left side - legal links */}
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/terms" className="hover:text-emerald-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{t('footer.terms')}</Link>
            <span className="text-white font-bold">|</span>
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{t('footer.privacy')}</Link>
            <span className="text-white font-bold">|</span>
            <Link to="/refund" className="hover:text-emerald-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{t('footer.refund')}</Link>
            <span className="text-white font-bold">|</span>
            <Link to="/legal/patents" className="hover:text-cyan-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Patents</Link>
            <span className="text-white font-bold">|</span>
            <Link to="/vendor-portal" className="hover:text-cyan-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">For Enterprise</Link>
            <span className="text-white font-bold">|</span>
            <Link to="/demos" className="hover:text-cyan-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Demos</Link>
            <span className="text-white font-bold">|</span>
            {isSteveOwner && (
              <>
                <span className="text-white font-bold">|</span>
                <Link to="/think-tank" className="hover:text-cyan-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Think Tank</Link>
              </>
            )}
            <span className="text-white font-bold">•</span>
            <span className="text-white font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">🔞 18 U.S.C. § 2257: {t('footer.ageRequirement')}</span>
          </div>
          
          {/* Right side - Admin Setup button only for Steve */}
          {isSteveOwner && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/admin/setup')}
                className="text-sm px-4 py-2 rounded font-bold transition-all duration-300 hover:scale-105 focus:outline-none bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.8)] hover:shadow-[0_0_30px_rgba(37,99,235,1)] uppercase tracking-wider"
              >
                Admin Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;