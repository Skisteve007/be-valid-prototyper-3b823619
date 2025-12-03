import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Settings } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const Footer = () => {
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  
  const handleAdminClick = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/admin/login");
    }
  };
  
  return (
    <footer className="bg-slate-950 border-t border-slate-700 mt-auto w-full">
      <div className="container mx-auto px-4 py-3">
        {/* Compact Legal Section */}
        <div className="text-[9px] leading-tight space-y-1 mb-2 text-slate-200">
          <p>© 2025 Clean Check. All Rights Reserved. Clean Check™, The Safety Shield™, Dual-Verification System™ pending trademarks. Protected under U.S. Copyright Law.</p>
          <p><strong>Disclaimer:</strong> Clean Check is a technology platform, not a healthcare provider. Services are for informational purposes only. All testing by independent CLIA-certified labs. HIPAA-compliant. We do not sell PHI.</p>
        </div>

        {/* Links & Compliance Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[9px] border-t border-slate-700 pt-2 text-slate-200">
          <Link to="/terms" className="hover:opacity-80 transition-colors underline">Terms</Link>
          <span>|</span>
          <Link to="/privacy" className="hover:opacity-80 transition-colors underline">Privacy</Link>
          <span>|</span>
          <Link to="/refund" className="hover:opacity-80 transition-colors underline">Refund</Link>
          <span>•</span>
          <span>🔞 18 U.S.C. § 2257: All users 18+</span>
          <span className="ml-auto">
            <button
              onClick={handleAdminClick}
              className="text-[10px] px-3 py-1 rounded-full font-medium transition-all duration-200 bg-purple-500 text-white hover:bg-purple-400 dark:bg-purple-300 dark:text-purple-900 dark:hover:bg-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.6)] hover:shadow-[0_0_18px_rgba(168,85,247,0.8)] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 focus:ring-offset-background"
            >
              {isAdmin ? "Admin Panel" : "Admin"}
            </button>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
