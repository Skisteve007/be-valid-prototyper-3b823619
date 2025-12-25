import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MessageSquare, BarChart3, Shield, FileCheck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoCard from "@/components/demos/DemoCard";
import FlowDiagram from "@/components/demos/FlowDiagram";
import DemoShareButton from "@/components/demos/DemoShareButton";

const DemoHub = () => {
  const demos = [
    {
      title: "Demo A — Senate Q&A",
      subtitle: "Ask a Question",
      icon: MessageSquare,
      bullets: [
        "Submit a prompt to multiple AI systems",
        "Watch step-by-step review process",
        "See final synthesis with integrity proof",
      ],
      whoFor: "Everyone — try multi-model consensus",
      path: "/demos/senate-qa",
    },
    {
      title: "Demo B — Monitoring & Reliability",
      subtitle: "Live Metrics",
      icon: BarChart3,
      bullets: [
        "System health and latency overview",
        "Historical reliability metrics",
        "Audit log access and trace viewing",
      ],
      whoFor: "Investors, compliance officers, partners",
      path: "/demos/monitoring",
    },
    {
      title: "Demo C — Enterprise Sandbox",
      subtitle: "Data Stays With You",
      icon: Shield,
      bullets: [
        "Simulate verification without uploading data",
        "See conduit architecture in action",
        "Preview integration flow for your systems",
      ],
      whoFor: "Enterprise buyers, security teams",
      path: "/demos/enterprise-sandbox",
    },
    {
      title: "Demo D — Audit Proof Verifier",
      subtitle: "Verify Integrity",
      icon: FileCheck,
      bullets: [
        "Verify a token's authenticity",
        "Check hash and timestamp integrity",
        "Detect any modifications",
      ],
      whoFor: "Security auditors, compliance teams",
      path: "/demos/audit-verifier",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Demo Hub — Live Demos | Valid™</title>
        <meta name="description" content="Explore live demos of Valid's multi-model AI governance system. See Senate Q&A, monitoring, enterprise sandbox, and audit verification." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <DemoBanner />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Demo Hub</h1>
                  <p className="text-sm text-muted-foreground">Experience Valid / SYNTH in action</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DemoShareButton />
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">← Back to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Intro Card */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">Valid/SYNTH: Governance Conduit, Not Data Warehouse</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Foundational sources (KYC vendors, hospitals, labs) house your raw data. We orchestrate verification, 
                    apply multi-model governance, and return results. We retain minimal artifacts (hashes/timestamps/votes) 
                    and issue a time-limited verification token — shareable via Ghost QR without exposing underlying records.
                  </p>
                  <Button asChild size="sm">
                    <Link to="/demos/router">
                      Choose Your Demo Path
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flow Diagrams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <FlowDiagram variant="senate" />
            <FlowDiagram variant="conduit" />
          </div>

          {/* Demo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demos.map((demo) => (
              <DemoCard key={demo.path} {...demo} />
            ))}
          </div>

          {/* CTA for Sales */}
          <Card className="mt-8 border-cyan-500/30 bg-cyan-500/5">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">Need a guided walkthrough?</p>
                  <p className="text-sm text-muted-foreground">Use our Demo Router to send the right demo to the right audience.</p>
                </div>
                <Button asChild variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                  <Link to="/demos/router">Open Demo Router</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default DemoHub;
