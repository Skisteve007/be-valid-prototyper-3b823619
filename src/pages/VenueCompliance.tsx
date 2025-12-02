import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, FileWarning, CheckCircle, QrCode, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

const VenueCompliance = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-sky-400" />
            <span className="text-xl font-bold tracking-tight">Clean Check <span className="text-sky-400">Enterprise</span></span>
          </div>
          <Button 
            variant="outline" 
            className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-slate-900"
            asChild
          >
            <Link to="/partners">Request Access</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-sky-400/10 border border-sky-400/30 rounded-full px-4 py-2 mb-8">
            <Shield className="h-4 w-4 text-sky-400" />
            <span className="text-sm text-sky-400 font-medium">B2B Compliance Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Performer Health Compliance & <span className="text-sky-400">Liability Management</span>.
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            The automated verification standard for Cabarets, Nightlife, and Talent Management.
          </p>
          <Button 
            size="lg" 
            className="bg-sky-400 hover:bg-sky-500 text-slate-900 font-semibold px-8 py-6 text-lg"
            asChild
          >
            <Link to="/partners">Request Manager Access</Link>
          </Button>
        </div>
      </section>

      {/* The Risk Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">The Risk</h2>
          <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">
            Manual compliance processes expose your venue to legal and operational risks.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Liability Gap */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
              <div className="w-14 h-14 bg-red-500/10 rounded-lg flex items-center justify-center mb-6">
                <AlertTriangle className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">The Liability Gap</h3>
              <p className="text-slate-400 leading-relaxed">
                Collecting physical medical paperwork creates immediate HIPAA exposure and liability risks for your venue. One data breach can result in fines up to $50,000 per incident.
              </p>
            </div>

            {/* Fraud Risk */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
              <div className="w-14 h-14 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6">
                <FileWarning className="h-7 w-7 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">The Fraud Risk</h3>
              <p className="text-slate-400 leading-relaxed">
                Visual inspection of PDF results is prone to forgery. Studies show 30% of manually submitted medical documents contain alterations or fabrications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">The Solution</h2>
          <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">
            Three-step automated compliance that eliminates your liability exposure.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-400/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-sky-400/30">
                <ClipboardCheck className="h-8 w-8 text-sky-400" />
              </div>
              <div className="text-sm font-semibold text-sky-400 mb-2">STEP 1</div>
              <h3 className="text-xl font-bold mb-4">Digital Mandate</h3>
              <p className="text-slate-400">
                Performers order Lab-Certified kits directly via the Clean Check Talent Portal. No paperwork touches your hands.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-400/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-sky-400/30">
                <Shield className="h-8 w-8 text-sky-400" />
              </div>
              <div className="text-sm font-semibold text-sky-400 mb-2">STEP 2</div>
              <h3 className="text-xl font-bold mb-4">Blind Verification</h3>
              <p className="text-slate-400">
                Our system verifies the result directly with the lab. You never touch sensitive medical data—zero liability.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-400/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-sky-400/30">
                <QrCode className="h-8 w-8 text-sky-400" />
              </div>
              <div className="text-sm font-semibold text-sky-400 mb-2">STEP 3</div>
              <h3 className="text-xl font-bold mb-4">Floor-Ready Status</h3>
              <p className="text-slate-400">
                Shift Managers scan a QR code. <span className="text-emerald-400 font-semibold">Green = Cleared for Floor</span>. <span className="text-red-400 font-semibold">Red = Do Not Admit</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Stats */}
      <section className="py-16 px-4 bg-slate-800/50 border-y border-slate-700">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-sky-400 mb-2">100%</div>
              <div className="text-sm text-slate-400">HIPAA Compliant</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-sky-400 mb-2">0</div>
              <div className="text-sm text-slate-400">Paper Documents</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-sky-400 mb-2">&lt;5s</div>
              <div className="text-sm text-slate-400">Verification Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-12">
            <Shield className="h-12 w-12 text-sky-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Safe Venue Network
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Protect your business, your performers, and your patrons with enterprise-grade compliance automation.
            </p>
            <Button 
              size="lg" 
              className="bg-sky-400 hover:bg-sky-500 text-slate-900 font-semibold px-8 py-6 text-lg"
              asChild
            >
              <Link to="/partners">Contact Sales for Enterprise Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Shield className="h-4 w-4" />
            <span>Clean Check Enterprise™</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Clean Check. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VenueCompliance;
