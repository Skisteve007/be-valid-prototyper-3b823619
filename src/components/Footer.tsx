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
            <p className="text-xs text-muted-foreground">
              © 2025 Clean Check. All rights reserved.
            </p>
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
                className="relative shadow-[0_0_20px_rgba(109,40,217,0.5)] hover:shadow-[0_0_30px_rgba(109,40,217,0.7)] border border-purple-600/50 bg-purple-700/20 text-purple-200 font-semibold"
              >
                <div className="absolute inset-0 bg-purple-600/20 blur-lg rounded-md -z-10"></div>
                <Shield className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
              <Button 
                onClick={() => navigate("/admin")}
                size="sm"
                className="relative shadow-[0_0_20px_rgba(192,132,252,0.5)] hover:shadow-[0_0_30px_rgba(192,132,252,0.7)] border border-purple-400/40 bg-purple-500/10 text-purple-300 font-semibold"
              >
                <div className="absolute inset-0 bg-purple-400/15 blur-lg rounded-md -z-10"></div>
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
