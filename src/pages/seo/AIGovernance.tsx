import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, FileText, UserCheck, Brain, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AIGovernance = () => {
  return (
    <>
      <Helmet>
        <title>AI Governance Platform: Policies, Approvals, Audits, Risk Controls | Giant Ventures</title>
        <meta name="description" content="Centralize AI policy, approvals, audit trails, and risk checks. Reduce hallucinations and ensure Reasonable Care in every model interaction." />
        <meta name="keywords" content="ai governance, governance for llm, model governance, ai policy management, ai audit trails, approval workflows, hallucination controls, risk scoring for ai" />
        <link rel="canonical" href="https://www.bevalid.app/ai-governance" />
        <meta property="og:title" content="AI Governance Platform: Policies, Approvals, Audits, Risk Controls | Giant Ventures" />
        <meta property="og:description" content="Centralize AI policy, approvals, audit trails, and risk checks. Reduce hallucinations and ensure Reasonable Care in every model interaction." />
        <meta property="og:url" content="https://www.bevalid.app/ai-governance" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Governance Platform | Giant Ventures" />
        <meta name="twitter:description" content="Centralize AI policy, approvals, audit trails, and risk checks." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "AI Governance Platform",
            "provider": { "@type": "Organization", "name": "Giant Ventures LLC" },
            "areaServed": "Global",
            "description": "Centralized AI governance with policies, approvals, audit trails, hallucination controls, and risk checks.",
            "category": "ITSecurity",
            "offers": { "@type": "Offer", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="h-8 w-8 text-cyan-500" />
              <span className="text-sm font-semibold text-cyan-500 uppercase tracking-wider">AI Governance</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron mb-6 text-foreground">
              AI Governance That Scales With Your Risk
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              Giant Ventures LLC builds zero-trust AI governance and data pipelines that minimize risk, 
              flush sensitive data ephemerally, and reduce storage costs. With secure conduits to CRMs, 
              ticketing, and access control—plus QR intake for universities, hospitals, and large events—we 
              provide policy, approvals, audits, and retention enforcement from a single platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                <Link to="/demos">
                  Get a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-orbitron mb-12 text-center">
              Complete AI Governance Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-cyan-500/30 bg-card/50">
                <CardHeader>
                  <Shield className="h-10 w-10 text-cyan-500 mb-2" />
                  <CardTitle>Policy Enforcement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Central policies and approval workflows ensure every AI-assisted decision 
                    passes through verification gates before shipping to production.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-cyan-500/30 bg-card/50">
                <CardHeader>
                  <FileText className="h-10 w-10 text-cyan-500 mb-2" />
                  <CardTitle>Immutable Audit Trails</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every AI interaction is logged with court-ready proof records. 
                    Signed audit logs demonstrate Reasonable Care when it matters most.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-cyan-500/30 bg-card/50">
                <CardHeader>
                  <UserCheck className="h-10 w-10 text-cyan-500 mb-2" />
                  <CardTitle>Workforce Certification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    PASS / REVIEW / FAIL scoring over time—not just a snapshot. 
                    Track verification discipline across your entire organization.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-cyan-500/30 bg-card/50">
                <CardHeader>
                  <CheckCircle className="h-10 w-10 text-cyan-500 mb-2" />
                  <CardTitle>Hallucination Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Multi-model consensus with our 7-Seat Senate architecture reduces 
                    drift and hallucinations by 99.2% over extended sessions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-cyan-500/30 bg-card/50">
                <CardHeader>
                  <Brain className="h-10 w-10 text-cyan-500 mb-2" />
                  <CardTitle>Risk Scoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automated risk assessment for every AI decision with configurable 
                    thresholds for different industries and compliance requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-cyan-500/30 bg-card/50">
                <CardHeader>
                  <Lock className="h-10 w-10 text-cyan-500 mb-2" />
                  <CardTitle>Zero-Trust Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Least-privilege access controls, service segmentation, and continuous 
                    verification across all AI and data conduits.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-12 px-4 border-y border-border">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">Trusted By</p>
            <p className="text-lg font-semibold text-foreground">
              Universities • Hospitals • Stadiums & Events • Enterprise IT
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-orbitron mb-6">
              Ready to Govern Your AI?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how Giant Ventures can help you implement Reasonable Care controls 
              across your AI operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                <Link to="/demos">Request Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/ephemeral-data-flushing">Learn About Data Flushing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AIGovernance;
