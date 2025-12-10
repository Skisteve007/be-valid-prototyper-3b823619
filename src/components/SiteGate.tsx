import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SiteGate = ({ children }: { children: React.ReactNode }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user already has gate access
    const gateAccess = localStorage.getItem('valid_gate_access');
    if (gateAccess) {
      setHasAccess(true);
    }
    setIsLoading(false);
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
        <div className="animate-pulse text-cyan-400 font-orbitron text-2xl">VALID™</div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Blurred background content */}
      <div className="filter blur-lg pointer-events-none select-none">
        {children}
      </div>

      {/* Gate Overlay */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 pointer-events-auto">
        <div className="w-full max-w-md pointer-events-auto">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 mb-4">
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold font-orbitron text-white mb-2">
              VALID<sup className="text-sm text-cyan-400">™</sup>
            </h1>
            <p className="text-gray-400 text-sm">Secure Access Portal</p>
          </div>

          {/* Form Card */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,240,255,0.1)] pointer-events-auto">
            <div className="flex items-center gap-2 mb-6 text-amber-400">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Confidential Access</span>
            </div>

            <div className="space-y-4 pointer-events-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50 pointer-events-auto"
                  style={{ pointerEvents: 'auto' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50 pointer-events-auto"
                  style={{ pointerEvents: 'auto' }}
                />
              </div>

              {/* NDA Checkbox */}
              <div className="flex items-start gap-3 pt-4 border-t border-white/10 pointer-events-auto">
                <Checkbox
                  id="nda-terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="mt-1 border-cyan-500/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 pointer-events-auto"
                  style={{ pointerEvents: 'auto' }}
                />
                <label htmlFor="nda-terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer pointer-events-auto">
                  I acknowledge that <span className="text-cyan-400 font-semibold">Valid™</span> and <span className="text-cyan-400 font-semibold">Ghost™</span> are proprietary technologies. I agree to the{' '}
                  <a href="/terms" target="_blank" className="text-cyan-400 underline hover:text-cyan-300 pointer-events-auto">
                    Non-Disclosure and Confidentiality terms
                  </a>.
                </label>
              </div>

              <Button
                onClick={handleRequestAccess}
                disabled={isSubmitting || !agreedToTerms || !fullName.trim() || !email.trim()}
                className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black font-bold py-6 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all pointer-events-auto"
                style={{ pointerEvents: 'auto' }}
              >
                {isSubmitting ? 'Verifying...' : 'Request Access'}
              </Button>
            </div>

            {/* Legal Notice */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                <strong className="text-gray-400">LEGAL NOTICE:</strong> The Valid™ platform, Ghost™ privacy architecture, and all associated methodologies are exclusive Intellectual Property protected by Common Law Trademark rights and pending patent filings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteGate;