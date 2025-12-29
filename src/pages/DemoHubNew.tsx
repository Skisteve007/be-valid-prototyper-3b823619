import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, MessageSquare, Scale, Building2, UserCheck, 
  ArrowRight, Calendar, Copy, Check, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";

const DemoHubNew = () => {
  const navigate = useNavigate();
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const copyLink = async (path: string) => {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPath(path);
      toast.success("Link copied!");
      setTimeout(() => setCopiedPath(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const primaryPaths = [
    {
      title: "Try a Decision",
      subtitle: "Run a governed verdict with proof record",
      time: "2 min",
      icon: MessageSquare,
      path: "/decision?mode=prompt",
      color: "from-primary to-cyan-500",
      borderColor: "border-primary/30",
      bgColor: "bg-primary/5",
    },
    {
      title: "See Platform at Scale",
      subtitle: "Live metrics, monitoring & audit trails",
      time: "3 min",
      icon: Scale,
      path: "/scale",
      color: "from-emerald-500 to-teal-500",
      borderColor: "border-emerald-500/30",
      bgColor: "bg-emerald-500/5",
    },
    {
      title: "Enterprise: Data Stays With You",
      subtitle: "Zero-trust conduit architecture",
      time: "2 min",
      icon: Building2,
      path: "/enterprise",
      color: "from-purple-500 to-indigo-500",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Demo Hub | Valid™ SYNTH</title>
        <meta name="description" content="Governed AI decisions with verifiable proof records. Run a demo, verify integrity, and review audit trails." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header with Start Pilot CTA */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Demo Hub</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">Valid™ SYNTH</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/start-pilot")}
                className="bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground font-semibold shadow-lg hover:shadow-primary/25"
              >
                Start Pilot (Paid)
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          {/* Hero */}
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Governance Layer</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Governed AI decisions with<br className="hidden sm:block" /> verifiable proof records.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Run a governed verdict, verify integrity, and review audit trails—demo-safe.
            </p>
          </div>

          {/* Primary CTA Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {primaryPaths.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.path}
                  className={`${item.borderColor} ${item.bgColor} hover:shadow-lg transition-all cursor-pointer group overflow-hidden`}
                  onClick={() => navigate(item.path)}
                >
                  <CardContent className="pt-6 pb-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {item.time}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(item.path);
                        }}
                      >
                        Try Now
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyLink(item.path);
                        }}
                      >
                        {copiedPath === item.path ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Secondary Link */}
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/workforce")}
              className="border-border/50"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              More: Operator Certification
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Demo Environment Notice */}
          <DemoEnvironmentNotice variant="banner" />
        </main>

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 py-3 px-4">
          <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground hidden sm:block">
              Ready to pilot?
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open("https://calendly.com/steve-bevalid/30min", "_blank")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book a Call
              </Button>
              <Button 
                onClick={() => navigate("/start-pilot")}
                size="sm"
                className="bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground font-semibold"
              >
                Start Pilot (Paid)
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom padding for sticky bar */}
        <div className="h-20" />
      </div>
    </>
  );
};

export default DemoHubNew;
