import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MessageSquare, BarChart3, Shield, FileCheck, ArrowRight, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoShareButton from "@/components/demos/DemoShareButton";

const DemoRouter = () => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyLink = async (path: string, label: string) => {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(path);
      toast.success(`${label} link copied!`);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const demoCards = [
    {
      icon: MessageSquare,
      title: "B2C Quick",
      subtitle: "Ask a question (Multi-Model Review)",
      bestFor: "End users, curious visitors, quick demos",
      bullets: ["Submit any question", "See step-by-step review process"],
      path: "/demos/senate-qa",
    },
    {
      icon: BarChart3,
      title: "Investor/Compliance",
      subtitle: "Monitoring & reliability metrics",
      bestFor: "Investors, compliance officers, auditors",
      bullets: ["Live health dashboards", "Historical reliability data"],
      path: "/demos/monitoring",
    },
    {
      icon: Shield,
      title: "Enterprise",
      subtitle: "Enterprise Sandbox (Data stays with you)",
      bestFor: "Enterprise buyers, security teams, integrators",
      bullets: ["Conduit architecture demo", "Zero data retention proof"],
      path: "/demos/enterprise-sandbox",
    },
    {
      icon: FileCheck,
      title: "Security Proof",
      subtitle: "Audit Proof Verifier (verify integrity)",
      bestFor: "Security auditors, technical due diligence",
      bullets: ["Verify token authenticity", "Check hash/timestamp integrity"],
      path: "/demos/audit-verifier",
    },
  ];

  const quickLinks = [
    { label: "Send to consumer", path: "/demos/senate-qa" },
    { label: "Send to enterprise", path: "/demos/enterprise-sandbox" },
    { label: "Send to investor", path: "/demos/monitoring" },
  ];

  return (
    <>
      <Helmet>
        <title>Demo Router — Choose Your Path | Valid™</title>
        <meta name="description" content="Direct prospects to the right demo. Quick links for B2C, enterprise, and investor audiences." />
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
                  <h1 className="text-xl font-bold text-foreground">Demo Router</h1>
                  <p className="text-sm text-muted-foreground">Choose your demo path</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DemoShareButton />
                <Button variant="outline" size="sm" asChild>
                  <Link to="/demos">← All Demos</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Quick Copy Links */}
          <Card className="mb-8 border-cyan-500/30 bg-cyan-500/5">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-foreground mb-4">Quick-copy links for sales:</p>
              <div className="flex flex-wrap gap-2">
                {quickLinks.map((link) => (
                  <Button
                    key={link.path}
                    variant="outline"
                    size="sm"
                    onClick={() => copyLink(link.path, link.label)}
                    className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    {copiedLink === link.path ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {link.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Demo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoCards.map((card) => (
              <Card key={card.path} className="border-border/50 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <card.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <CardDescription>{card.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Best for:</p>
                      <p className="text-sm text-foreground">{card.bestFor}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">What you'll see:</p>
                      <ul className="text-sm text-foreground/80 space-y-1">
                        {card.bullets.map((b, i) => (
                          <li key={i}>• {b}</li>
                        ))}
                      </ul>
                    </div>

                    <Button asChild className="w-full">
                      <Link to={card.path}>
                        Launch
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default DemoRouter;
