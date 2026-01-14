import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Lock, Key, Eye, Server, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ZeroTrust = () => {
  return (
    <>
      <Helmet>
        <title>Zero-Trust Architecture for AI and Data Pipelines | Giant Ventures</title>
        <meta name="description" content="Enforce least privilege, segment services, and continuously verify access across AI, data, and event conduits." />
        <meta name="keywords" content="zero trust architecture, least privilege, segmentation, attribute-based access control, abac, policy enforcement points, continuous verification" />
        <link rel="canonical" href="https://www.bevalid.app/security/zero-trust" />
        <meta property="og:title" content="Zero-Trust Architecture | Giant Ventures" />
        <meta property="og:description" content="Enforce least privilege, segment services, and continuously verify access across AI, data, and event conduits." />
        <meta property="og:url" content="https://www.bevalid.app/security/zero-trust" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Zero-Trust Security Architecture",
            "provider": { "@type": "Organization", "name": "Giant Ventures LLC" },
            "areaServed": "Global",
            "description": "Zero-trust architecture with least privilege, service segmentation, and continuous verification for AI and data pipelines.",
            "category": "ITSecurity"
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-8 w-8 text-red-500" />
              <span className="text-sm font-semibold text-red-500 uppercase tracking-wider">Security</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron mb-6 text-foreground">
              Zero-Trust From First Request to Final Audit
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              Enforce least privilege, segment services, and continuously verify access across 
              AI, data, and event conduits. Trust nothing, verify everything—at every layer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white font-semibold">
                <Link to="/demos">
                  Get a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/ai-governance">AI Governance</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Zero-Trust Pillars */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-orbitron mb-12 text-center">
              Zero-Trust Pillars
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-red-500/30 bg-card/50">
                <CardHeader>
                  <Key className="h-10 w-10 text-red-500 mb-2" />
                  <CardTitle>Least Privilege</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every identity, service, and API gets minimum necessary permissions. 
                    No standing access—just-in-time grants with automatic expiration.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-card/50">
                <CardHeader>
                  <Server className="h-10 w-10 text-red-500 mb-2" />
                  <CardTitle>Micro-Segmentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Services are isolated with explicit policy gates. Lateral movement 
                    requires re-authentication and authorization at every boundary.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-card/50">
                <CardHeader>
                  <Eye className="h-10 w-10 text-red-500 mb-2" />
                  <CardTitle>Continuous Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Trust isn't established once—it's continuously verified. Risk signals 
                    trigger re-authentication and dynamic policy adjustments.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-card/50">
                <CardHeader>
                  <Shield className="h-10 w-10 text-red-500 mb-2" />
                  <CardTitle>Policy Enforcement Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every data flow passes through enforcement points. Policies are 
                    evaluated in real-time with full context awareness.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-card/50">
                <CardHeader>
                  <Lock className="h-10 w-10 text-red-500 mb-2" />
                  <CardTitle>Attribute-Based Access (ABAC)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access decisions based on user, resource, environment, and action 
                    attributes—not just static roles.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-card/50">
                <CardHeader>
                  <CheckCircle className="h-10 w-10 text-red-500 mb-2" />
                  <CardTitle>Immutable Audit Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every access decision, policy evaluation, and data movement is 
                    cryptographically signed and append-only.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Architecture Diagram Placeholder */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5">
              <CardContent className="pt-8 pb-8 px-8">
                <h3 className="text-2xl font-bold font-orbitron mb-4">
                  Three-Ring Fortress Model
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background/50 border border-red-500/20">
                    <h4 className="font-semibold text-red-500 mb-2">Outer Ring: Perimeter</h4>
                    <p className="text-muted-foreground text-sm">
                      WAF protection against DDoS and injection attacks at the edge. 
                      Rate limiting and bot detection before requests reach services.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-orange-500/20">
                    <h4 className="font-semibold text-orange-500 mb-2">Inner Ring: Access Control</h4>
                    <p className="text-muted-foreground text-sm">
                      Row-Level Security where the database kernel rejects any query not 
                      cryptographically signed by an authenticated, authorized user.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-yellow-500/20">
                    <h4 className="font-semibold text-yellow-500 mb-2">Core Ring: Data Protection</h4>
                    <p className="text-muted-foreground text-sm">
                      AES-256 encryption at rest plus ephemeral tokens. No massive PII 
                      honey-pot in breach—only time-boxed, revocable tokens.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-orbitron mb-6">
              Ready for Zero-Trust?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how our zero-trust architecture protects AI and data pipelines 
              from first request to final audit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white font-semibold">
                <Link to="/demos">Request Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/conduit-integrations">Learn About Conduits</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ZeroTrust;
