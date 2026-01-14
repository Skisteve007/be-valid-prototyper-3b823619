import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Timer, Trash2, Shield, Lock, Database, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EphemeralDataFlushing = () => {
  return (
    <>
      <Helmet>
        <title>Ephemeral Data Flushing & PII Redaction | Time-Bound Deletion Pipelines</title>
        <meta name="description" content="Automatically flush sensitive data after use. PII redaction, tokenization, TTL deletion, and compliant retention policies." />
        <meta name="keywords" content="ephemeral data, data flushing, time-bound deletion, pii redaction, tokenization, right-to-be-forgotten automation, data retention policy engine" />
        <link rel="canonical" href="https://www.bevalid.app/ephemeral-data-flushing" />
        <meta property="og:title" content="Ephemeral Data Flushing & PII Redaction | Giant Ventures" />
        <meta property="og:description" content="Automatically flush sensitive data after use. PII redaction, tokenization, TTL deletion, and compliant retention policies." />
        <meta property="og:url" content="https://www.bevalid.app/ephemeral-data-flushing" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Ephemeral Data Flushing",
            "provider": { "@type": "Organization", "name": "Giant Ventures LLC" },
            "areaServed": "Global",
            "description": "Time-bound deletion pipelines with PII redaction, tokenization, and retention policy enforcement.",
            "category": "DataManagement"
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Timer className="h-8 w-8 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-500 uppercase tracking-wider">Data Lifecycle</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron mb-6 text-foreground">
              Keep What You Need—Automatically Flush What You Don't
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              Sensitive data shouldn't linger. We enforce TTLs, tokenization, and redaction so personal 
              and regulated data is flushed ephemerally—meeting retention policies without slowing teams down.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                <Link to="/demos">
                  Get a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/data-cost-savings">See Cost Savings</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-orbitron mb-12 text-center">
              Enterprise-Grade Data Flushing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-emerald-500/30 bg-card/50">
                <CardHeader>
                  <Timer className="h-10 w-10 text-emerald-500 mb-2" />
                  <CardTitle>TTL-Based Deletion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configure time-to-live policies per data class. Data automatically 
                    purges after use—60 seconds, 24 hours, or event-end.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/30 bg-card/50">
                <CardHeader>
                  <FileX className="h-10 w-10 text-emerald-500 mb-2" />
                  <CardTitle>PII Redaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automated detection and redaction of personally identifiable information 
                    before storage or transmission to downstream systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/30 bg-card/50">
                <CardHeader>
                  <Lock className="h-10 w-10 text-emerald-500 mb-2" />
                  <CardTitle>Tokenization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Replace sensitive data with non-reversible tokens. Maintain referential 
                    integrity while eliminating PII storage risk.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/30 bg-card/50">
                <CardHeader>
                  <Shield className="h-10 w-10 text-emerald-500 mb-2" />
                  <CardTitle>Right-to-Be-Forgotten</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automated GDPR/CCPA compliance. Subject deletion requests cascade 
                    through all connected systems within policy timeframes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/30 bg-card/50">
                <CardHeader>
                  <Database className="h-10 w-10 text-emerald-500 mb-2" />
                  <CardTitle>Retention Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Define retention rules by data class, region, and regulation. 
                    Automated enforcement with audit trails for compliance.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/30 bg-card/50">
                <CardHeader>
                  <Trash2 className="h-10 w-10 text-emerald-500 mb-2" />
                  <CardTitle>Secure Purge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cryptographic verification of deletion. Proof records demonstrate 
                    data destruction for auditors and regulators.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-5xl font-bold text-emerald-500 mb-2">75%</p>
                <p className="text-muted-foreground">Data flushed per session</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-emerald-500 mb-2">&lt;100ms</p>
                <p className="text-muted-foreground">Redaction latency</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-emerald-500 mb-2">100%</p>
                <p className="text-muted-foreground">Deletion verification</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-orbitron mb-6">
              Stop Storing What You Don't Need
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how ephemeral data flushing can reduce your storage costs 
              while meeting the strictest compliance requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                <Link to="/demos">Request Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/ai-governance">Learn About AI Governance</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default EphemeralDataFlushing;
