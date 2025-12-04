import { Link, useNavigate } from 'react-router-dom';
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
    <footer className="w-full mt-auto border-t bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-200 border-slate-300 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        {/* Compact Legal Section */}
        <div className="text-[11px] leading-relaxed space-y-1.5 mb-3">
          <p>© 2025 Clean Check. All Rights Reserved. Clean Check™, The Safety Shield™, Dual-Verification System™ pending trademarks. Protected under U.S. Copyright Law.</p>
          <p><strong>Disclaimer:</strong> Clean Check is a technology platform, not a healthcare provider. Services are for informational purposes only. All testing by independent CLIA-certified labs. HIPAA-compliant. We do not sell PHI.</p>
        </div>

        {/* Links & Compliance Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] border-t border-slate-300 dark:border-slate-700 pt-3">
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
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.8)] hover:shadow-[0_0_25px_rgba(37,99,235,1)] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-background"
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
