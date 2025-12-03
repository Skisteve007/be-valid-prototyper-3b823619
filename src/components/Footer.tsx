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
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Row 1: Copyright & IP */}
        <div className="mb-3 md:mb-4 text-center md:text-left">
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            © 2025 Clean Check. All Rights Reserved.<br />
            Confidential & Proprietary. Clean Check™, The Safety Shield™, and the Dual-Verification System™ are pending trademarks.<br />
            Protected under U.S. Copyright Law and Provisional Patent Application No. [PENDING].
          </p>
        </div>

        {/* Row 2: Medical & Liability Disclaimer */}
        <div className="mb-3 md:mb-4 text-center md:text-left">
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            <strong>Medical & Liability Disclaimer:</strong> Clean Check is a technology platform, not a healthcare provider or medical laboratory. We facilitate access to diagnostic testing via certified third-party laboratory partners.<br />
            <strong>• Not Medical Advice:</strong> Services provided are for informational and verification purposes only and do not constitute medical advice, diagnosis, or treatment.<br />
            <strong>• Lab Liability:</strong> All clinical testing is performed by independent, CLIA-certified laboratories. Clean Check is not liable for errors, delays, or inaccuracies in laboratory processing.
          </p>
        </div>

        {/* Row 3: HIPAA & Privacy */}
        <div className="mb-3 md:mb-4 text-center md:text-left">
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            <strong>HIPAA & Privacy:</strong> Your data security is our priority. Health data is transmitted via HIPAA-compliant encryption standards. We do not sell your Personal Health Information (PHI) to third parties.
          </p>
        </div>

        {/* Row 4: Essential Links */}
        <div className="mb-3 md:mb-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 text-[10px] text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors underline">
              Terms of Service
            </Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors underline">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link to="/refund" className="hover:text-foreground transition-colors underline">
              Refund Policy
            </Link>
            <span>|</span>
            <Link to="/partners" className="hover:text-foreground transition-colors underline">
              Partner Solutions
            </Link>
          </div>
        </div>

        {/* Age Compliance */}
        <div className="pt-4 border-t border-border">
          <p className="text-[10px] text-muted-foreground text-center">
            🔞 18 U.S.C. § 2257 Compliance: All models/users appearing on this site are 18 years of age or older.
          </p>
        </div>

        {/* Admin Button - Bottom Right */}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleAdminClick}
            className="text-[9px] text-muted-foreground/50 hover:text-muted-foreground hover:scale-110 transition-all duration-200"
          >
            {isAdmin ? "Admin Panel" : "Admin"}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
