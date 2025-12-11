import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLoginDialog } from './AdminLoginDialog';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

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
            <p>© 2025 VALID™. All Rights Reserved. Valid™, Ghost™, The Safety Shield™, Dual-Verification System™ pending trademarks. Protected under U.S. Copyright Law.</p>
            <p><strong className="text-white">Disclaimer:</strong> Valid™ is a technology platform, not a healthcare provider. Services are for informational purposes only. All testing by independent CLIA-certified labs. HIPAA-compliant. We do not sell PHI.</p>
          </div>

          {/* Proprietary Rights Notice */}
          <div className="text-[10px] leading-relaxed mb-3 text-slate-400 border-t border-slate-600 pt-3">
            <p><strong className="text-slate-300">LEGAL NOTICE & PROPRIETARY RIGHTS:</strong> The Valid™ platform, the Ghost™ privacy architecture, and all associated methodologies, algorithms, and interface designs are the exclusive Intellectual Property of Valid™. These concepts are protected by Common Law Trademark rights and pending patent filings. By accessing this platform, you acknowledge that you are viewing confidential, proprietary information. Any unauthorized copying, reverse engineering, or reproduction of the Valid™ or Ghost™ concepts will be prosecuted. This site is for authorized demonstration purposes only.</p>
          </div>

          {/* Language Selector */}
          <div className="border-t border-slate-600 pt-3 mb-3">
            <p className="text-xs text-slate-400 mb-2 text-center">{t('footer.selectLanguage')}</p>
            <LanguageSelector variant="footer" />
          </div>

          {/* Links & Compliance Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] border-t border-slate-600 pt-3 bg-slate-950 -mx-4 px-4 py-3">
            <Link to="/terms" className="hover:text-emerald-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{t('footer.terms')}</Link>
            <span className="text-white font-bold">|</span>
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{t('footer.privacy')}</Link>
            <span className="text-white font-bold">|</span>
            <Link to="/refund" className="hover:text-emerald-400 transition-colors underline font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{t('footer.refund')}</Link>
            <span className="text-white font-bold">•</span>
            <span className="text-white font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">🔞 18 U.S.C. § 2257: {t('footer.ageRequirement')}</span>
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