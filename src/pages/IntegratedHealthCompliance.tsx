import { Shield, CheckCircle, Lock, Zap } from "lucide-react";

const IntegratedHealthCompliance = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-muted to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Integrated Health Compliance
          </h1>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade health verification infrastructure designed for regulatory compliance and operational efficiency.
          </p>
        </div>
      </section>

      {/* The Clean Check Enterprise Guarantee Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            The VALID Enterprise Guarantee
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our commitment to your organization includes bank-grade security, regulatory compliance, and seamless integration with your existing systems.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-lg border border-border">
              <Shield className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Zero-Trust Security</h3>
              <p className="text-muted-foreground text-sm">
                Every API request is authenticated and encrypted end-to-end. No data is stored without explicit consent.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <Lock className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">HIPAA & GDPR Compliant</h3>
              <p className="text-muted-foreground text-sm">
                Full regulatory compliance with healthcare privacy laws across all jurisdictions we operate in.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <Zap className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Real-Time Integration</h3>
              <p className="text-muted-foreground text-sm">
                Instant webhook notifications and RESTful APIs for seamless integration with your LIS and HRIS systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Liability Firewall Section */}
      <section id="liability-firewall" className="py-10 px-4 bg-card/70 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            The Triple Liability Shield: Zero-Risk Architecture
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            VALID is built on a <strong className="text-foreground">Zero-Trust</strong> model that legally separates and transfers risk between all parties. This is your definitive answer to auditors and legal teams.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="p-5 bg-muted rounded-lg border-l-4 border-amber-500">
              <h3 className="text-xl font-semibold text-amber-500 mb-2">
                1. Shielding the Client (Venue/Enterprise)
              </h3>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Risk Transfer:</strong> Your liability is reduced because you are relying on VALID&apos;s specialized, certified <strong className="text-foreground">Compliance Platform</strong> for due diligence. The client staff never handles sensitive data.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 bg-muted rounded-lg border-l-4 border-accent">
              <h3 className="text-xl font-semibold text-accent mb-2">
                2. Shielding VALID (The Platform&apos;s Firewall)
              </h3>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Data Custody Firewall:</strong> VALID is defined as a secure transport pipe, not a medical provider. We only possess the user&apos;s <strong className="text-foreground">explicit consent token</strong> and the final status (Green/Red), not the raw lab results. This legally insulates VALID from health-related consequences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 bg-muted rounded-lg border-l-4 border-destructive">
              <h3 className="text-xl font-semibold text-destructive mb-2">
                3. Accountability on Source Entities (User/Lab)
              </h3>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Full Liability Transfer:</strong> The <strong className="text-foreground">Lab</strong> remains liable for result accuracy. The <strong className="text-foreground">User</strong> accepts full liability for the outcome of their social interactions via the mandatory <strong className="text-foreground">Waiver of Liability</strong> in the Terms of Use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Ready to Integrate?
          </h2>
          <p className="text-muted-foreground mb-6">
            Contact our enterprise team to get started with your lab integration.
          </p>
          <a
            href="/api-docs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            <CheckCircle className="h-5 w-5" />
            View API Documentation
          </a>
        </div>
      </section>
    </div>
  );
};

export default IntegratedHealthCompliance;
