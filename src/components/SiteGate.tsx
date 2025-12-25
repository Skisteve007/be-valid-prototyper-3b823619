import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

// Routes that bypass the SiteGate - EXACT MATCH for specific routes
const EXACT_BYPASS_ROUTES = [
  '/',              // Landing page - MUST BE PUBLIC
  '/auth',          // Login/Signup
  '/access-portal', // Auth portal
  '/verify-email',  // Email verification
  '/dashboard',     // User dashboard (has its own auth)
  '/terms',         // Legal pages
  '/privacy',
  '/refund',
  '/login',         // Redirects
  '/signup',
  '/about',
  '/contact',
  '/venues',        // Public venue listing
  '/payment-success',
  '/compliance',
  '/2257-compliance',
];

// Routes that bypass using PREFIX matching (dynamic routes)
const PREFIX_BYPASS_ROUTES = [
  '/p/',            // Shared profiles
  '/location/',     // Shared locations
  '/venues/',       // Individual venue pages
];

const SiteGate = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pathname = location.pathname;
  
  // Check if current route should bypass the gate - FIXED LOGIC
  // Exact match for specific routes
  const isExactBypass = EXACT_BYPASS_ROUTES.includes(pathname);
  // Prefix match for dynamic routes (like /p/abc123)
  const isPrefixBypass = PREFIX_BYPASS_ROUTES.some(prefix => pathname.startsWith(prefix));
  const shouldBypass = isExactBypass || isPrefixBypass;

  useEffect(() => {
    let isMounted = true;
    
    const checkAccess = async () => {
      try {
        // Check if user already has gate access from localStorage first (fast path)
        const gateAccess = localStorage.getItem('valid_gate_access');
        if (gateAccess && isMounted) {
          setHasAccess(true);
          setIsLoading(false);
          return;
        }
        
        // Check if user is authenticated - they've already agreed to terms during signup
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted && session?.user) {
          setHasAccess(true);
          setIsLoading(false);
          return;
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('SiteGate access check error:', error);
        // On error, still finish loading to prevent infinite loading state
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Add a safety timeout to prevent infinite loading on mobile
    const safetyTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn('SiteGate: Safety timeout triggered');
        setIsLoading(false);
      }
    }, 3000);
    
    checkAccess();
    
    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  const handleRequestAccess = async () => {
    if (!fullName.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!agreedToTerms) {
      toast.error('Please agree to the terms to continue');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Store lead in database (optional - create table if needed)
      const { error } = await supabase
        .from('shadow_leads')
        .insert({
          name: fullName.trim(),
          phone: 'N/A',
          venue_name: 'Gate Access Request',
          city: 'N/A',
          role: 'Visitor',
          inquiry_subject: `NDA Accepted: ${new Date().toISOString()}`
        });
      
      if (error) {
        console.log('Lead capture note:', error.message);
      }
      
      // Grant access
      localStorage.setItem('valid_gate_access', JSON.stringify({
        name: fullName,
        email: email,
        timestamp: new Date().toISOString()
      }));
      
      setHasAccess(true);
      toast.success('Access granted. Welcome to Valid™');
    } catch (err) {
      console.error('Gate access error:', err);
      // Still grant access even if DB save fails
      localStorage.setItem('valid_gate_access', 'true');
      setHasAccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[200]">
        <h1 className="animate-pulse text-2xl md:text-3xl font-bold font-orbitron tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
          VALID<sup className="text-xs text-cyan-400">™</sup>
        </h1>
      </div>
    );
  }

  // Bypass gate for specific routes (like email verification)
  if (hasAccess || shouldBypass) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Blurred background content */}
      <div className="filter blur-lg pointer-events-none select-none">
        {children}
      </div>

      {/* Background Overlay - NON-INTERACTIVE */}
      <div className="fixed inset-0 bg-black/95 z-[9998] pointer-events-none" />

      {/* Modal Container - INTERACTIVE, with scroll for small screens */}
      <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center p-4 pt-8 md:pt-4 overflow-y-auto">
        <div className="w-full max-w-md relative z-50">
          {/* Logo & Header - TEXT ONLY, NO SHIELD */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-orbitron tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)] mb-2">
              VALID<sup className="text-sm text-cyan-400">™</sup>
            </h1>
            <span className="inline-block px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)] animate-pulse mb-2">
              Beta
            </span>
            <p className="text-gray-400 text-sm">Secure Access Portal</p>
          </div>

          {/* Form Card - Solid background, no blur */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,240,255,0.1)] relative z-50">
            <div className="flex items-center gap-2 mb-6 text-amber-400">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Confidential Access</span>
            </div>

            <div className="space-y-4 relative z-50">
              {/* Full Name Input */}
              <div className="relative z-50">
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 relative z-50"
                  style={{ pointerEvents: 'auto', zIndex: 50 }}
                />
              </div>

              {/* Email Input */}
              <div className="relative z-50">
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 relative z-50"
                  style={{ pointerEvents: 'auto', zIndex: 50 }}
                />
              </div>

              {/* NDA Checkbox */}
              <div className="flex items-start gap-3 pt-4 border-t border-white/10 relative z-50">
                <input
                  type="checkbox"
                  id="nda-terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-cyan-500/50 bg-black text-cyan-500 focus:ring-cyan-500 focus:ring-2 cursor-pointer relative z-50"
                  style={{ pointerEvents: 'auto', zIndex: 50 }}
                />
                <label htmlFor="nda-terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                  I acknowledge that <span className="text-cyan-400 font-semibold">Valid™</span> and <span className="text-cyan-400 font-semibold">Ghost™</span> are proprietary technologies. I agree to the{' '}
                  <a href="/terms" target="_blank" className="text-cyan-400 underline hover:text-cyan-300">
                    Non-Disclosure and Confidentiality terms
                  </a>.
                </label>
              </div>

              <button
                onClick={handleRequestAccess}
                disabled={isSubmitting || !agreedToTerms || !fullName.trim() || !email.trim()}
                className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all relative z-50"
                style={{ pointerEvents: 'auto', zIndex: 50 }}
              >
                {isSubmitting ? 'Verifying...' : 'Request Access'}
              </button>
            </div>

            {/* Legal Notice */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                <strong className="text-gray-400">LEGAL NOTICE:</strong> Patent Pending (Provisional). © Giant Ventures, LLC (Texas). The Valid™ platform, Ghost™ privacy architecture, SYNTH™, and all associated methodologies are exclusive Intellectual Property. Certain aspects are the subject of one or more provisional patent applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteGate;