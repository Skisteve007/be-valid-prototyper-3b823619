import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLoginDialog } from './AdminLoginDialog';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { Sun, Moon } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isDark, setIsDark] = useState(true);

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

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "administrator")
            .maybeSingle();
          
          setIsAdmin(!!roleData);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      setShowLoginDialog(true);
    }
  };
  
  return (
    <>
      <footer className="w-full mt-auto border-t border-slate-400 dark:border-slate-700 bg-slate-800 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-4">
        {/* Compact Legal Section */}
          <div className="text-[12px] leading-relaxed space-y-1.5 mb-3 text-slate-200">
            <p>{t('footer.copyrightFull')}</p>
            <p><strong className="text-white">{t('footer.disclaimerLabel')}</strong> {t('footer.disclaimerText')}</p>
          </div>

          {/* Proprietary Rights Notice */}
          <div className="text-[10px] leading-relaxed mb-3 text-slate-400 border-t border-slate-600 pt-3">
            <p><strong className="text-slate-300">{t('footer.legalNoticeLabel')}</strong> {t('footer.legalNoticeText')}</p>
          </div>

          {/* Language Selector */}
          <div className="border-t border-slate-600 pt-3 mb-3">
            <p className="text-xs text-slate-400 mb-2 text-center">{t('footer.selectLanguage')}</p>
            <LanguageSelector variant="footer" />
          </div>

          {/* Global Privacy Footer */}
          <div className="py-4 text-center border-t border-slate-600">
            <div className="flex justify-center items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#00FFFF">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <span className="text-slate-400 text-[11px]">VALID™ — We Check. We Don't Collect.</span>
            </div>
            <div className="flex justify-center gap-4">
              <Link to="/privacy" className="text-slate-500 text-[10px] hover:text-slate-300">Privacy Policy</Link>
              <Link to="/terms" className="text-slate-500 text-[10px] hover:text-slate-300">Terms of Service</Link>
              <span className="text-slate-600 text-[10px]">GDPR • CCPA • SOC2</span>
            </div>
          </div>

          {/* Links & Compliance Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] border-t border-slate-600 pt-3 bg-slate-950 -mx-4 px-4 py-3">
            <Link to="/terms" className="hover:text-emerald-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{t('footer.terms')}</Link>
            <span className="text-white font-bold">|</span>
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{t('footer.privacy')}</Link>
            <span className="text-white font-bold">|</span>
            <Link to="/refund" className="hover:text-emerald-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{t('footer.refund')}</Link>
            <span className="text-white font-bold">|</span>
            <Link to="/vendor-portal" className="hover:text-cyan-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">For Enterprise</Link>
            <span className="text-white font-bold">•</span>
            <span className="text-white font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">🔞 18 U.S.C. § 2257: {t('footer.ageRequirement')}</span>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 border
                ${isDark 
                  ? 'bg-slate-800 text-yellow-400 border-yellow-400/60 shadow-[0_0_15px_rgba(250,204,21,0.3)]' 
                  : 'bg-slate-700 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)]'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <span className="ml-auto">
            <button
                onClick={handleAdminClick}
                disabled={checkingAuth}
                className="text-sm px-4 py-2 rounded font-bold transition-all duration-300 hover:scale-105 focus:outline-none bg-gradient-to-r from-cyan-500 to-blue-600 text-black disabled:opacity-50 shadow-[0_0_20px_rgba(0,240,255,0.4)] uppercase tracking-wider"
              >
                {isAdmin ? t('footer.adminPanel') : t('footer.admin')}
              </button>
            </span>
          </div>
        </div>
      </footer>

      <AdminLoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog} 
      />
    </>
  );
};

export default Footer;