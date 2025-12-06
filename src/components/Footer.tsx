import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLoginDialog } from './AdminLoginDialog';

const Footer = () => {
  const navigate = useNavigate();
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
            <p>© 2025 VALID. All Rights Reserved. VALID™, The Safety Shield™, Dual-Verification System™ pending trademarks. Protected under U.S. Copyright Law.</p>
            <p><strong className="text-white">Disclaimer:</strong> VALID is a technology platform, not a healthcare provider. Services are for informational purposes only. All testing by independent CLIA-certified labs. HIPAA-compliant. We do not sell PHI.</p>
          </div>

          {/* Links & Compliance Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[12px] border-t border-slate-600 pt-3 text-slate-200">
            <Link to="/terms" className="hover:text-white transition-colors underline font-medium text-slate-100">Terms</Link>
            <span className="text-slate-400">|</span>
            <Link to="/privacy" className="hover:text-white transition-colors underline font-medium text-slate-100">Privacy</Link>
            <span className="text-slate-400">|</span>
            <Link to="/refund" className="hover:text-white transition-colors underline font-medium text-slate-100">Refund</Link>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">🔞 18 U.S.C. § 2257: All users 18+</span>
            <span className="ml-auto">
              <button
                onClick={handleAdminClick}
                disabled={checkingAuth}
                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-200 hover:brightness-110 focus:outline-none bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              >
                {isAdmin ? 'Admin Panel' : 'Admin'}
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