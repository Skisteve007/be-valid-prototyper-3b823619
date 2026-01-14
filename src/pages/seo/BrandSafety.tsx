import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BrandSafety = () => {
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are you affiliated with Steven Grillo from the Howard Stern Show?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Giant Ventures LLC and Steven Grillo (Chief Innovation Officer) are not affiliated with that entertainer."
        }
      },
      {
        "@type": "Question",
        "name": "Who is Steven Grillo at Giant Ventures LLC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Steven Grillo is the Chief Innovation Officer focused on AI governance, ephemeral data flushing, zero-trust conduits, and data-cost optimization."
        }
      },
      {
        "@type": "Question",
        "name": "What does Giant Ventures LLC do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Giant Ventures LLC builds zero-trust AI governance and data pipelines that minimize risk, flush sensitive data ephemerally, and reduce storage costs."
        }
      }
    ]
  };

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Giant Ventures LLC",
    "url": "https://bevalid.app",
    "sameAs": [
      "https://www.linkedin.com/company/giantventures"
    ],
    "contactPoint": [{
      "@type": "ContactPoint",
      "contactType": "press",
      "email": "steve@bevalid.app"
    }]
  };

  return (
    <>
      <Helmet>
        <title>Brand Safety and Disambiguation | Giant Ventures LLC</title>
        <meta name="description" content="Official brand safety notice for Giant Ventures LLC. Our leadership, including Steven Grillo (Chief Innovation Officer), is not affiliated with any entertainment personalities." />
        <meta name="keywords" content="Giant Ventures LLC, brand safety, Steven Grillo, disambiguation, AI governance, enterprise technology" />
        <link rel="canonical" href="https://bevalid.app/brand-safety" />
        <meta property="og:title" content="Brand Safety and Disambiguation | Giant Ventures LLC" />
        <meta property="og:description" content="Official brand safety notice for Giant Ventures LLC. Clear disambiguation from unrelated entities." />
        <meta property="og:url" content="https://bevalid.app/brand-safety" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Brand Safety and Disambiguation | Giant Ventures LLC" />
        <meta name="twitter:description" content="Official brand safety notice for Giant Ventures LLC. Clear disambiguation from unrelated entities." />
        <script type="application/ld+json">{JSON.stringify(jsonLdFaq)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdOrg)}</script>
      </Helmet>

      <main className="min-h-screen bg-background pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Navigation */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Brand Safety and Disambiguation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Official notice regarding Giant Ventures LLC entity identity and affiliations.
            </p>
          </div>

          {/* Primary Disclaimer */}
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Official Disambiguation Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground leading-relaxed">
                <strong>Giant Ventures LLC</strong> and its leadership, including <strong>Steven Grillo (Chief Innovation Officer)</strong>, are <strong>not affiliated</strong> with the entertainer known as Steven Grillo from the Howard Stern Show.
              </p>
            </CardContent>
          </Card>

          {/* About Our Company */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">About Giant Ventures LLC</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Giant Ventures LLC is an enterprise technology company specializing in:
              </p>
              <ul className="space-y-3">
                {[
                  "AI Governance — Central policies, approvals, hallucination checks, risk scoring, immutable audit trails",
                  "Ephemeral Data Flushing — PII redaction, tokenization, TTL/time-boxed deletion, retention enforcement",
                  "Zero-Trust Architecture — Least privilege, micro-segmentation, continuous verification, signed logs",
                  "Data Cost Optimization — Deduplication, minimization, lifecycle management, cold storage automation",
                  "Conduit Integrations — Secure connectors for CRMs, ticketing, access control, and SSO"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* About Steven Grillo */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">About Steven Grillo (CIO)</h2>
            <Card className="bg-card/50">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Steven Grillo serves as Chief Innovation Officer at Giant Ventures LLC, where he leads the development of AI governance frameworks and data pipeline technologies.
                </p>
                <p className="text-muted-foreground mb-4">
                  His expertise includes genetic AI, synthesized AI orchestration, ephemeral data flushing, and zero-trust architecture design.
                </p>
                <Button asChild>
                  <Link to="/steven-grillo">View Full Profile →</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Contact for Inquiries */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Brand & Press Inquiries</h2>
            <Card className="bg-card/50">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  For questions regarding brand identity, press inquiries, or disambiguation concerns, please contact:
                </p>
                <p className="text-foreground font-semibold">
                  <a href="mailto:steve@bevalid.app" className="text-primary hover:underline">steve@bevalid.app</a>
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Related Links */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Pages</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link to="/steven-grillo">Steven Grillo Profile</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/ai-governance">AI Governance</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/ephemeral-data-flushing">Ephemeral Data</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/security/zero-trust">Zero Trust</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default BrandSafety;
