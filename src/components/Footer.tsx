import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Clean Check</h3>
            <p className="text-sm text-muted-foreground mb-4 italic">
              "Elevating Intimacy through Verified Transparency and Mutual Trust"
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>© 2025 Clean Check. All Rights Reserved.</p>
              <p>Confidential & Proprietary.</p>
              <p>Clean Check™, The Safety Shield™, and the Dual-Verification System™ are pending trademarks.</p>
              <p>Protected under U.S. Copyright Law and Provisional Patent Application.</p>
              <p className="font-semibold">Unauthorized reproduction or replication of this logic flow will be prosecuted.</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-foreground mb-2">Legal</h4>
            <Link 
              to="/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              to="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/refund" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Refund Policy
            </Link>
            <Link 
              to="/2257-compliance" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              2257 Compliance
            </Link>
            <Link 
              to="/partners" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Lab Partner Solutions
            </Link>
          </div>
        </div>
        
        <div className="pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => navigate("/admin/login")}
                size="sm"
                className="relative shadow-[0_0_15px_rgba(109,40,217,0.4)] hover:shadow-[0_0_20px_rgba(109,40,217,0.6)] border-2 border-purple-500/60 bg-purple-900/40 text-white font-semibold hover:bg-purple-800/50 transition-all"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
              <Button 
                onClick={() => navigate("/admin")}
                size="sm"
                className="relative shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_20px_rgba(147,51,234,0.6)] border-2 border-purple-400/60 bg-purple-800/40 text-white font-semibold hover:bg-purple-700/50 transition-all"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center md:text-right flex-1">
              🔞 18 U.S.C. § 2257 Compliance: All models/users appearing on this site are 18 years of age or older.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
