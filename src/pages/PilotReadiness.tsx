import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Timer, ScanFace, Building2, Users, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PilotReadiness = () => {
  const metrics = [
    {
      icon: Zap,
      value: "< 2 sec",
      label: "Decision latency target (Door Mode)",
    },
    {
      icon: Timer,
      value: "60s",
      label: "Self-destructing QR TTL (anti-replay)",
    },
    {
      icon: ScanFace,
      value: "Front + Back",
      label: "Visual match verification (door-ready)",
    },
    {
      icon: Building2,
      value: "28 venues",
      label: "Active pipeline / pilot targets",
    },
    {
      icon: Users,
      value: "Now",
      label: "Onboarding testers",
    },
    {
      icon: Rocket,
      value: "Q1 2025",
      label: "Pilot launch target (first live deployments)",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/admin" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Admin
          </Link>
          <Badge variant="outline" className="border-primary text-primary">
            LIVE STATUS
          </Badge>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Pilot Readiness</h1>
          <p className="text-muted-foreground">Current targets and deployment status</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <metric.icon className="h-8 w-8 text-primary mx-auto" />
                <p className="text-3xl font-bold font-mono text-primary">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          Internal Reference — Update pipeline count as targets change
        </div>
      </div>
    </div>
  );
};

export default PilotReadiness;
