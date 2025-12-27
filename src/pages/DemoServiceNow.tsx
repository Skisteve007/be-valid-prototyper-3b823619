import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Shield, FileCheck, Workflow, CheckCircle2, ArrowRight, Sparkles, Ghost, Lock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoShareButton from "@/components/demos/DemoShareButton";

const DemoServiceNow = () => {
  const overlaps = [
    "Enterprise workflows, approvals, and process automation",
    "AI features inside workflows (agent assist, summarization, search)",
    "Governance/Risk/Compliance modules (policy + audit management)",
    "Integrations/connectors to enterprise systems",
  ];

  const differences = [
    {
      title: "Verification Layer",
      description: "We are a verification layer for AI decisions and outputs (model-agnostic)",
    },
    {
      title: "Pre-Action Gating",
      description: "We validate outputs before they're acted on (gating), not just after-the-fact process governance",
    },
    {
      title: "Decision Record",
      description: "We produce a verifiable decision record (audit trail) designed for enterprise privacy and trust",
    },
    {
      title: "Plug-In Architecture",
      description: "We can plug into workflow platforms (including ServiceNow) rather than replace them",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Competitor Case Study: ServiceNow | VALID / SYNTH</title>
        <meta name="description" content="How VALID/SYNTH complements ServiceNow as a verification layer for AI decisions in enterprise workflows." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <DemoBanner />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div className="p-1.5 md:p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 shrink-0">
                  <Building2 className="h-5 w-5 md:h-6 md:w-6 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base md:text-xl font-bold text-foreground truncate">Competitor Case Study</h1>
                  <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">ServiceNow Analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                <DemoShareButton />
                <Button variant="outline" size="sm" asChild className="text-xs md:text-sm px-2 md:px-3">
                  <Link to="/demos"><ArrowLeft className="h-4 w-4 mr-1" /> Demos</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-6">
              <Building2 className="h-5 w-5 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Enterprise Workflow Platform</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ServiceNow
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise workflow + operations platform
            </p>
          </div>

          {/* Positioning Statement */}
          <Card className="mb-8 border-primary/30 bg-gradient-to-r from-primary/5 via-background to-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
                <div className="flex-1">
                  <div className="p-3 rounded-full bg-orange-500/10 border border-orange-500/30 inline-flex mb-3">
                    <Workflow className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">ServiceNow</h3>
                  <p className="text-sm text-muted-foreground">System of Workflow Record</p>
                  <p className="text-xs text-orange-400 mt-1 italic">(runs enterprise work)</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-[2px] bg-gradient-to-r from-orange-500 to-primary" />
                  <span className="text-xl font-bold text-foreground">+</span>
                  <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-cyan-500" />
                </div>
                <div className="flex-1">
                  <div className="p-3 rounded-full bg-primary/10 border border-primary/30 inline-flex mb-3">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">VALID / SYNTH</h3>
                  <p className="text-sm text-muted-foreground">System of Verification Record</p>
                  <p className="text-xs text-primary mt-1 italic">(certifies AI outputs/decisions)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Where ServiceNow Overlaps */}
            <Card className="border-orange-500/30">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Building2 className="h-5 w-5 text-orange-400" />
                  </div>
                  <span>Where ServiceNow Overlaps</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Adjacent capabilities in their platform</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {overlaps.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                    <div className="p-1 rounded bg-orange-500/20 shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-orange-400" />
                    </div>
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Where VALID/SYNTH is Different */}
            <Card className="border-primary/30">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <span>Where VALID / SYNTH is Different</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Our unique wedge in the market</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {differences.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="p-1 rounded bg-primary/20 shrink-0 mt-0.5">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Key Insight */}
          <Card className="mb-8 border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-background to-cyan-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 shrink-0">
                  <FileCheck className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Key Insight</h3>
                  <p className="text-muted-foreground text-sm">
                    ServiceNow runs enterprise workflows. VALID/SYNTH verifies the AI decisions within those workflows 
                    before they're acted upon. We're not competing—we're the governance layer that makes AI-powered 
                    ServiceNow deployments trustworthy and auditable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy - Conduit Model */}
          <Card className="mb-8 border-purple-500/30 bg-gradient-to-r from-purple-500/5 via-background to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <Lock className="h-5 w-5 text-purple-400" />
                </div>
                <span>How VALID Protects Privacy (Conduit Model)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                VALID doesn't warehouse sensitive identity or lab data—we orchestrate verification with trusted 
                providers and return only a minimal proof token. Verification data stays with the source providers 
                (e.g., LabCorp for lab verification and Footprint for identity verification). VALID acts as a 
                secure conduit—requesting verification, enforcing access rules, and returning a privacy-preserving 
                "Ghost Token" that signals the result without storing or sharing the underlying sensitive records.
              </p>
              
              {/* Conduit Flow Diagram */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-6 bg-card/50 rounded-lg border border-purple-500/20">
                <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/30 min-w-[120px]">
                  <Database className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-foreground">Source Provider</p>
                  <p className="text-[10px] text-muted-foreground">Data stays here</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 md:rotate-0" />
                <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/30 min-w-[120px]">
                  <Shield className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-foreground">VALID Conduit</p>
                  <p className="text-[10px] text-muted-foreground">Verify & enforce</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 md:rotate-0" />
                <div className="text-center p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 min-w-[120px]">
                  <Ghost className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-foreground">Ghost Token</p>
                  <p className="text-[10px] text-muted-foreground">Verified / Not / Expired</p>
                </div>
              </div>

              {/* Token States */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-green-400">Verified</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <Shield className="h-5 w-5 text-red-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-red-400">Not Verified</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <Lock className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-yellow-400">Expired</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Flow */}
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Integration Flow</CardTitle>
              <p className="text-sm text-muted-foreground">How VALID/SYNTH complements ServiceNow</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-6 bg-card/50 rounded-lg border border-border/30">
                <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/30 min-w-[140px]">
                  <Workflow className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">ServiceNow</p>
                  <p className="text-xs text-muted-foreground">Workflow Trigger</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30 min-w-[140px]">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">VALID/SYNTH</p>
                  <p className="text-xs text-muted-foreground">Verify AI Output</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30 min-w-[140px]">
                  <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Certified</p>
                  <p className="text-xs text-muted-foreground">Action Executed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/demos/senate-qa">
                Try Governance Q&A Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/demos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Demo Hub
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </>
  );
};

export default DemoServiceNow;
