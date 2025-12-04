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
      <footer className="w-full mt-auto border-t-2 border-gray-400" style={{ backgroundColor: '#e5e7eb' }}>
        <div className="container mx-auto px-4 py-4">
          {/* Compact Legal Section */}
          <div className="text-[12px] leading-relaxed space-y-1.5 mb-3" style={{ color: '#000000' }}>
            <p>© 2025 Clean Check. All Rights Reserved. Clean Check™, The Safety Shield™, Dual-Verification System™ pending trademarks. Protected under U.S. Copyright Law.</p>
            <p><strong>Disclaimer:</strong> Clean Check is a technology platform, not a healthcare provider. Services are for informational purposes only. All testing by independent CLIA-certified labs. HIPAA-compliant. We do not sell PHI.</p>
          </div>

          {/* Links & Compliance Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[12px] border-t-2 border-gray-400 pt-3" style={{ color: '#000000' }}>
            <Link to="/terms" className="hover:opacity-70 transition-colors underline font-medium" style={{ color: '#000000' }}>Terms</Link>
            <span style={{ color: '#000000' }}>|</span>
            <Link to="/privacy" className="hover:opacity-70 transition-colors underline font-medium" style={{ color: '#000000' }}>Privacy</Link>
            <span style={{ color: '#000000' }}>|</span>
            <Link to="/refund" className="hover:opacity-70 transition-colors underline font-medium" style={{ color: '#000000' }}>Refund</Link>
            <span style={{ color: '#000000' }}>•</span>
            <span style={{ color: '#000000' }}>🔞 18 U.S.C. § 2257: All users 18+</span>
            <span className="ml-auto">
              <button
                onClick={handleAdminClick}
                disabled={checkingAuth}
                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-200 hover:brightness-110 focus:outline-none text-white disabled:opacity-50"
                style={{
                  backgroundColor: '#9333ea',
                  boxShadow: '0 0 20px rgba(147, 51, 234, 0.9), 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(147, 51, 234, 0.4)'
                }}
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