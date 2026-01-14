import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Plug, Shield, QrCode, Lock, Database, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConduitIntegrations = () => {
  return (
    <>
      <Helmet>
        <title>Conduit & Integration Services | Connect CRMs, Ticketing, Access Control</title>
        <meta name="description" content="Secure connectors and ports for CRMs, ticketing, access control, and SSO. Zero-trust segmentation and immutable logs." />
        <meta name="keywords" content="data conduit, data pipeline integrations, connectors, ports, crm integration, ticketing, access control, sso/zero trust connectors, qr code intake" />
        <link rel="canonical" href="https://www.bevalid.app/conduit-integrations" />
        <meta property="og:title" content="Conduit & Integration Services | Giant Ventures" />
        <meta property="og:description" content="Secure connectors and ports for CRMs, ticketing, access control, and SSO. Zero-trust segmentation and immutable logs." />
        <meta property="og:url" content="https://www.bevalid.app/conduit-integrations" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Conduit & Integration Services",
            "provider": { "@type": "Organization", "name": "Giant Ventures LLC" },
            "areaServed": "Global",
            "description": "Secure data conduits and zero-trust integrations for CRMs, ticketing, access control, and SSO.",
            "category": "ITIntegration"
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Plug className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-semibold text-blue-500 uppercase tracking-wider">Integrations</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron mb-6 text-foreground">
              Secure Data Conduits and Zero-Trust Integrations
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              Connect your CRMs, ticketing systems, access control, and SSO with secure, 
              auditable data conduits. Every integration enforces zero-trust principles 
              with immutable logging and policy enforcement points.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                <Link to="/demos">
                  Get a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/security/zero-trust">Zero-Trust Architecture</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Integration Categories */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-orbitron mb-12 text-center">
              Pre-Built Connectors & Custom Ports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-blue-500/30 bg-card/50">
                <CardHeader>
                  <Database className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle>CRM Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Salesforce, HubSpot, Microsoft Dynamics—secure bidirectional sync 
                    with field-level access controls and audit trails.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-card/50">
                <CardHeader>
                  <QrCode className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle>Ticketing & Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    QR code intake for concerts, festivals, and stadiums. 
                    Ephemeral visitor data with real-time analytics.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-card/50">
                <CardHeader>
                  <Lock className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle>Access Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Physical and digital access systems. Badge readers, 
                    door controllers, and identity verification integration.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-card/50">
                <CardHeader>
                  <Shield className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle>SSO & Identity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    SAML, OIDC, and OAuth integrations. Attribute-based access 
                    control (ABAC) with continuous verification.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-card/50">
                <CardHeader>
                  <Server className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle>Cloud Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    S3, Azure Blob, GCS connectors with encryption at rest, 
                    lifecycle policies, and cost-aware tiering.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-card/50">
                <CardHeader>
                  <Plug className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle>Custom Ports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Build custom integrations with our SDK. RESTful APIs, 
                    webhooks, and event-driven architectures supported.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Zero-Trust Callout */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
              <CardContent className="pt-8 pb-8 px-8">
                <h3 className="text-2xl font-bold font-orbitron mb-4">
                  Every Integration is Zero-Trust by Default
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Least-privilege access controls for every connection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Service segmentation with policy enforcement points</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Immutable, signed audit logs for every data movement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Continuous verification—not just at connection time</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-orbitron mb-6">
              Connect Your Systems Securely
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how our conduit architecture can integrate your existing systems 
              while maintaining zero-trust security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                <Link to="/demos">Request Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/industries/events">Events & Venues</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ConduitIntegrations;
