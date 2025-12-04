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
    <footer className="w-full mt-auto border-t border-black/5 dark:border-slate-300 dark:bg-slate-200" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
      <div className="container mx-auto px-4 py-4">
        {/* Compact Legal Section */}
        <div className="text-[11px] leading-relaxed space-y-1.5 mb-3 text-black dark:text-white">
          <p>© 2025 Clean Check. All Rights Reserved. Clean Check™, The Safety Shield™, Dual-Verification System™ pending trademarks. Protected under U.S. Copyright Law.</p>
          <p><strong>Disclaimer:</strong> Clean Check is a technology platform, not a healthcare provider. Services are for informational purposes only. All testing by independent CLIA-certified labs. HIPAA-compliant. We do not sell PHI.</p>
        </div>

        {/* Links & Compliance Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] border-t border-black/20 dark:border-slate-400 pt-3 text-black dark:text-white">
          <Link to="/terms" className="hover:opacity-80 transition-colors underline text-black dark:text-white">Terms</Link>
          <span>|</span>
          <Link to="/privacy" className="hover:opacity-80 transition-colors underline text-black dark:text-white">Privacy</Link>
          <span>|</span>
          <Link to="/refund" className="hover:opacity-80 transition-colors underline text-black dark:text-white">Refund</Link>
          <span>•</span>
          <span>🔞 18 U.S.C. § 2257: All users 18+</span>
          <span className="ml-auto">
            <button
              onClick={handleAdminClick}
              className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-200 hover:brightness-110 focus:outline-none bg-blue-600 text-white shadow-[0_0_20px_rgba(29,78,216,1),0_0_40px_rgba(29,78,216,0.7)] dark:bg-purple-600 dark:shadow-[0_0_20px_rgba(168,85,247,0.9),0_0_40px_rgba(255,255,255,0.4)]"
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
