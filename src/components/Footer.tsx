import { Link } from 'react-router-dom';

const Footer = () => {
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
          </div>
        </div>
        
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            🔞 18 U.S.C. § 2257 Compliance: All models/users appearing on this site are 18 years of age or older.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
