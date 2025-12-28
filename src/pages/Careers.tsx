import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Briefcase, 
  Users, 
  Code, 
  Target, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Shield,
  Rocket
} from "lucide-react";

interface RoleCard {
  id: string;
  title: string;
  category: string;
  pitch: string;
  whatYouDo: string[];
  youFitIf: string[];
  compSummary: string;
  icon: React.ReactNode;
}

const roles: RoleCard[] = [
  {
    id: "cto",
    title: "Founding CTO / Head of Engineering",
    category: "Equity-First — SF/Hybrid or Remote (US)",
    pitch: "Own the technical truth end-to-end. Guide build priorities. Confidently handle enterprise technical + security questions with the founder.",
    whatYouDo: [
      "Technical strategy + architecture for conduit-first platform (customer-hosted + hosted pilot)",
      "Engineering hiring plan: founding engineers + full-stack + contractors",
      "Enterprise readiness: security questionnaires, deployment models, auditability"
    ],
    youFitIf: [
      "You've shipped production systems that scale (distributed systems, queues, worker pools)",
      "You can speak security/legal/architecture with enterprise buyers without hand-waving",
      "You're a builder, not a slide-deck CTO—everything must be provable"
    ],
    compSummary: "Equity-first (meaningful stake). Cash limited initially; increases as revenue lands.",
    icon: <Shield className="h-6 w-6" />
  },
  {
    id: "enterprise-ae",
    title: "Founding Enterprise AE (Technical)",
    category: "Contractor — SF/Hybrid",
    pitch: "Close 6–7 figure enterprise contracts in regulated/high-liability verticals. You run the room with Security + Legal + Product and still close.",
    whatYouDo: [
      "Own full-cycle enterprise deals (CISO, GC, Compliance, Product, AI leadership)",
      "Run discovery → POV → security review → close",
      "Build the playbook with the founder (targets, objections, sequences, pricing)"
    ],
    youFitIf: [
      "7–10+ years enterprise sales including complex technical/security reviews",
      "You can sell to regulated buyers and translate technical truth into executive clarity",
      "Experience with procurement, MSAs, DPAs/BAAs, security questionnaires"
    ],
    compSummary: "15% of first-year contract value CASH COLLECTED. 50% cash + 50% equity at milestone. Uncapped.",
    icon: <Target className="h-6 w-6" />
  },
  {
    id: "growth-ae",
    title: "Growth AE (Main Street)",
    category: "Contractor — SF/Field-Friendly",
    pitch: "High-velocity closer for $5K setup deals. Turn attention (Instagram + inbound + outbound) into signed deals fast.",
    whatYouDo: [
      "Close high-velocity deals (typically $5K setup + ongoing)",
      "Run short demos: Upload & Verdict + Proof Verification + share token",
      "Source pipeline in SF (walk-ins, DMs, referrals, local partnerships)"
    ],
    youFitIf: [
      "Proven high-output seller (SMB, local business, SaaS, payments, security)",
      "You can work leads relentlessly: phone, text, DMs, in-person drops",
      "You write clean follow-ups and drive next steps without drama"
    ],
    compSummary: "15% of CASH COLLECTED on qualifying deals. 100% cash OR split cash/equity. Uncapped.",
    icon: <Users className="h-6 w-6" />
  },
  {
    id: "founding-engineer",
    title: "Founding Engineer — Customer-Hosted Runtime",
    category: "Contractor — SF/Hybrid",
    pitch: "Build the enterprise-grade enforcement runtime that can run inside a customer VPC. Be the 'CTO energy' early.",
    whatYouDo: [
      "Build customer-hosted runtime (containers) with parallel verifiers and proof records",
      "Design for NFL-Sunday scale: burst handling, queues, backpressure, observability",
      "Security posture: keys, signatures, tenant isolation, audit logs"
    ],
    youFitIf: [
      "You've shipped distributed systems that scale (queues, worker pools, event-driven)",
      "Comfortable with enterprise deployment patterns (Docker/Kubernetes, VPC constraints)",
      "You care about correctness and want ownership"
    ],
    compSummary: "Monthly contractor pay + meaningful founding-level equity grant + milestone bonuses tied to revenue events.",
    icon: <Code className="h-6 w-6" />
  },
  {
    id: "fullstack-engineer",
    title: "Full-Stack Engineer — Demo/App/PWA",
    category: "Contractor — SF/Remote",
    pitch: "Turn the demo experience into a gorgeous mobile-first app (PWA) that closes deals.",
    whatYouDo: [
      "Make the Demo Hub + demos world-class: readable, fast, mobile-perfect",
      "Build PWA install flow (home screen app feel)",
      "Wire Ghost preview flow + time-limited token UX (demo-safe)"
    ],
    youFitIf: [
      "Strong UI/UX sense with React/TypeScript experience",
      "You can ship fast and iterate based on feedback",
      "Comfortable with mobile-first design and PWA patterns"
    ],
    compSummary: "Limited cash initially + equity available + bonuses tied to shipped milestones/revenue events.",
    icon: <Rocket className="h-6 w-6" />
  }
];

export default function Careers() {
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    github: "",
    role: "",
    whyYou: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleApply = (roleId: string) => {
    setSelectedRole(roleId);
    setFormData(prev => ({ ...prev, role: roleId }));
    setShowApplyModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate submission - in production, this would go to a real endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mailto link as fallback
    const subject = encodeURIComponent(`Application: ${roles.find(r => r.id === formData.role)?.title || formData.role}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nLinkedIn: ${formData.linkedin || "Not provided"}\nGitHub: ${formData.github || "Not provided"}\n\nWhy me:\n${formData.whyYou}`
    );
    
    window.location.href = `mailto:steve@bevalid.app?subject=${subject}&body=${body}`;
    
    toast.success("Application prepared! Your email client will open to send.");
    setSubmitting(false);
    setShowApplyModal(false);
    setFormData({ name: "", email: "", linkedin: "", github: "", role: "", whyYou: "" });
  };

  return (
    <>
      <Helmet>
        <title>Careers | Valid/SYNTH — Join the Team</title>
        <meta name="description" content="Join Valid/SYNTH — a conduit-first AI governance platform. We're hiring technical enterprise sellers, growth closers, and founding engineers." />
      </Helmet>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4">
              <Briefcase className="h-3 w-3 mr-1" />
              Now Hiring
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join the Team
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              We're building Valid/SYNTH — a conduit-first AI governance platform. 
              If you can ship or close, we want to talk.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                Enterprise-Grade Posture
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Customer-Hosted Runtime Available
              </Badge>
            </div>
          </div>
        </section>

        {/* Proof Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Demos Are Live. We're Moving Fast.</h2>
              <p className="text-muted-foreground">
                This isn't a slideware company. We have working demos, live enterprise conversations, 
                and a clear path to revenue. We're building the governance layer that makes AI decisions 
                provable (proof records) and enforceable (release/veto).
              </p>
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Open Roles</h2>
              <p className="text-muted-foreground">Contractor-first. Paid on results. Equity-forward.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {roles.map((role) => (
                <Card key={role.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {role.icon}
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {role.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-4">{role.title}</CardTitle>
                    <CardDescription className="text-base">
                      {role.pitch}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          What You'll Do
                        </h4>
                        <ul className="space-y-1">
                          {role.whatYouDo.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          You're a Fit If
                        </h4>
                        <ul className="space-y-1">
                          {role.youFitIf.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Comp
                        </h4>
                        <p className="text-sm text-muted-foreground">{role.compSummary}</p>
                      </div>

                      {/* Engagement terms */}
                      <p className="text-xs text-muted-foreground italic">
                        Engagement: Independent contractor to start. NDA + IP assignment required.
                      </p>
                    </div>

                    <Button 
                      className="w-full mt-6" 
                      onClick={() => handleApply(role.id)}
                    >
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Reach out directly to discuss roles, comp, or how you can contribute.
            </p>
            <a 
              href="mailto:steve@bevalid.app"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              steve@bevalid.app
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for Role</DialogTitle>
            <DialogDescription>
              {roles.find(r => r.id === selectedRole)?.title || "Submit your application"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="linkedin.com/in/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub (optional)</Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="github.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role Applying For *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whyYou">Why You? (2–3 sentences) *</Label>
              <Textarea
                id="whyYou"
                value={formData.whyYou}
                onChange={(e) => setFormData(prev => ({ ...prev, whyYou: e.target.value }))}
                required
                placeholder="What makes you the right fit for this role?"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowApplyModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={submitting || !formData.name || !formData.email || !formData.role || !formData.whyYou}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}