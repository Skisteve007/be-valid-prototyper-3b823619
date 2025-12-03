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
    <footer className="bg-card border-t border-border mt-auto w-full">
      <div className="container mx-auto px-4 py-3">
        {/* Compact Legal Section */}
        <div className="text-[9px] leading-tight text-muted-foreground space-y-1 mb-2">
          <p>© 2025 Clean Check. All Rights Reserved. Clean Check™, The Safety Shield™, Dual-Verification System™ pending trademarks. Protected under U.S. Copyright Law.</p>
          <p><strong>Disclaimer:</strong> Clean Check is a technology platform, not a healthcare provider. Services are for informational purposes only. All testing by independent CLIA-certified labs. HIPAA-compliant. We do not sell PHI.</p>
        </div>

        {/* Links & Compliance Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[9px] text-muted-foreground border-t border-border pt-2">
          <Link to="/terms" className="hover:text-foreground transition-colors underline">Terms</Link>
          <span>|</span>
          <Link to="/privacy" className="hover:text-foreground transition-colors underline">Privacy</Link>
          <span>|</span>
          <Link to="/refund" className="hover:text-foreground transition-colors underline">Refund</Link>
          <span>|</span>
          <Link to="/partners" className="hover:text-foreground transition-colors underline">Partners</Link>
          <span className="mx-2">•</span>
          <span>🔞 18 U.S.C. § 2257: All users 18+</span>
          <span className="ml-auto">
            <button
              onClick={handleAdminClick}
              className="text-[9px] px-2 py-0.5 rounded text-muted-foreground/60 hover:text-foreground hover:shadow-[0_0_8px_rgba(59,130,246,0.4),0_0_8px_rgba(249,115,22,0.4)] transition-all duration-200"
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
