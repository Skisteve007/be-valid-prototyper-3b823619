import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { 
  Building2, Shield, Lock, Server, ArrowRight, CheckCircle2,
  Copy, Check, Calendar, Database, Cloud, HardDrive, Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";
import FlowDiagram from "@/components/demos/FlowDiagram";

const DemoEnterprise = () => {
  const navigate = useNavigate();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [deploymentOption, setDeploymentOption] = useState("cloud");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/enterprise`);
      setCopiedItem("link");
      toast.success("Link copied!");
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const deploymentOptions = [
    {
      id: "cloud",
      name: "Cloud",
      icon: Cloud,
      description: "Managed deployment with zero infrastructure overhead",
      features: ["SOC2 compliant", "Auto-scaling", "99.9% SLA", "Managed updates"],
    },
    {
      id: "vpc",
      name: "VPC / Private Cloud",
      icon: Shield,
      description: "Deploy within your cloud environment",
      features: ["Your VPC", "Data residency control", "Custom networking", "SSO integration"],
    },
    {
      id: "onprem",
      name: "On-Premise",
      icon: HardDrive,
      description: "Full control with air-gapped deployment options",
      features: ["Air-gapped option", "Full data control", "Custom compliance", "Dedicated support"],
    },
  ];

  const integrationSteps = [
    { step: 1, title: "Connect Source", description: "Point to your system of record via secure API" },
    { step: 2, title: "Configure Policies", description: "Set governance rules and thresholds" },
    { step: 3, title: "Process Events", description: "Stream or batch events through the conduit" },
    { step: 4, title: "Receive Verdicts", description: "Get governed decisions with proof records" },
  ];

  const codeSnippet = `// Example: Send event for governance
const response = await fetch('https://api.valid.dev/v1/govern', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event_type: 'decision_request',
    payload: { /* your data stays here */ },
    policy_pack: 'enterprise-v2'
  })
});

const { verdict, proof_record } = await response.json();
// verdict: "CERTIFIED" | "MISTRIAL"
// proof_record: { proof_id, signature, expires_at, ... }`;

  return (
    <>
      <Helmet>
        <title>Enterprise Sandbox | Valid™ SYNTH Demo</title>
        <meta name="description" content="Data stays with you. Zero-trust conduit architecture for enterprise AI governance." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <Building2 className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Enterprise Sandbox</h1>
                  <p className="text-xs text-muted-foreground">Data Stays With You</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyLink}>
                  {copiedItem === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">← Hub</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Hero */}
          <Card className="mb-8 border-purple-500/30 bg-purple-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <Lock className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Your Data Never Leaves Your Infrastructure
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Valid/SYNTH is a <strong>governance conduit</strong>, not a data warehouse. 
                    Your foundational sources house raw data. We orchestrate verification, 
                    apply multi-model governance, and return time-limited tokens with integrity proofs.
                    <span className="text-purple-400 font-medium"> We retain only minimal metadata.</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">Zero Trust</Badge>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">No Source Upload</Badge>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">Minimal Metadata</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conduit Architecture */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                Conduit Architecture
              </CardTitle>
              <CardDescription>
                Data flows through—never stored
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FlowDiagram variant="conduit" />
            </CardContent>
          </Card>

          {/* Integration Flow */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Integration Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {integrationSteps.map((item) => (
                  <div key={item.step} className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-semibold">
                        {item.step}
                      </div>
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground pl-11">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Code Snippet */}
              <div className="relative">
                <pre className="p-4 rounded-lg bg-muted/50 border border-border overflow-x-auto text-sm">
                  <code className="text-foreground">{codeSnippet}</code>
                </pre>
                <Badge variant="outline" className="absolute top-2 right-2 text-xs">
                  Demo-safe
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Deployment Options */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-400" />
                Deployment Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={deploymentOption} onValueChange={setDeploymentOption}>
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  {deploymentOptions.map((opt) => (
                    <TabsTrigger key={opt.id} value={opt.id} className="flex items-center gap-2">
                      <opt.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{opt.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {deploymentOptions.map((opt) => (
                  <TabsContent key={opt.id} value={opt.id}>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-emerald-500/20">
                          <opt.icon className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{opt.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{opt.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {opt.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Notice */}
          <DemoEnvironmentNotice variant="banner" />

          {/* CTAs */}
          <Card className="mt-6 border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-4">Ready to Deploy?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button 
                  onClick={() => navigate("/start-pilot")}
                  className="bg-gradient-to-r from-primary to-cyan-500"
                >
                  Start Pilot (Paid)
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline">
                  Request Security Packet
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open("https://calendly.com/steve-bevalid/30min", "_blank")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default DemoEnterprise;
