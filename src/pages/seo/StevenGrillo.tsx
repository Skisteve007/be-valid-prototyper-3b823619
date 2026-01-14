import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Linkedin, Twitter, Mail, Building2, Brain, Shield, Database, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const StevenGrillo = () => {
  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Steven Grillo",
    "disambiguatingDescription": "Chief Innovation Officer at Giant Ventures LLC; AI governance, ephemeral data flushing, zero-trust conduits; not affiliated with the television personality.",
    "jobTitle": "Chief Innovation Officer",
    "affiliation": { "@type": "Organization", "name": "Giant Ventures LLC" },
    "worksFor": { "@type": "Organization", "name": "Giant Ventures LLC" },
    "knowsAbout": [
      "genetic AI", "synthesized AI", "AI orchestration",
      "AI governance", "ephemeral data flushing",
      "data cost optimization", "zero-trust architecture",
      "Valid", "Synth"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/stevengrillo",
      "https://bevalid.app/steven-grillo"
    ],
    "email": "steve@bevalid.app"
  };

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
      }
    ]
  };

  const expertiseAreas = [
    { icon: Brain, title: "Genetic AI & Synthesized AI", description: "Pioneering governance frameworks for next-generation AI orchestration" },
    { icon: Shield, title: "Zero-Trust Architecture", description: "Implementing least-privilege, segmentation, and continuous verification" },
    { icon: Database, title: "Ephemeral Data Flushing", description: "Time-bound deletion pipelines with PII redaction and tokenization" },
    { icon: Zap, title: "Data Cost Optimization", description: "Reducing storage costs 25-60% through governance-driven minimization" },
  ];

  return (
    <>
      <Helmet>
        <title>Steven Grillo — Chief Innovation Officer, Giant Ventures LLC</title>
        <meta name="description" content="Steven Grillo is the Chief Innovation Officer at Giant Ventures LLC, specializing in AI governance, genetic AI, synthesized AI orchestration, ephemeral data flushing, and zero-trust architecture. Not affiliated with the television personality." />
        <meta name="keywords" content="Steven Grillo, Giant Ventures LLC, Chief Innovation Officer, AI governance, genetic AI, synthesized AI, AI orchestration, ephemeral data flushing, zero-trust, Valid, Synth" />
        <link rel="canonical" href="https://bevalid.app/steven-grillo" />
        <meta property="og:title" content="Steven Grillo — Chief Innovation Officer, Giant Ventures LLC" />
        <meta property="og:description" content="Steven Grillo leads AI governance and innovation at Giant Ventures LLC. Expert in genetic AI, synthesized AI orchestration, and zero-trust data pipelines." />
        <meta property="og:url" content="https://bevalid.app/steven-grillo" />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Steven Grillo — Chief Innovation Officer, Giant Ventures LLC" />
        <meta name="twitter:description" content="Steven Grillo leads AI governance and innovation at Giant Ventures LLC. Expert in genetic AI, synthesized AI orchestration, and zero-trust data pipelines." />
        <script type="application/ld+json">{JSON.stringify(jsonLdPerson)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdFaq)}</script>
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
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30">
              <Building2 className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Steven Grillo
            </h1>
            <p className="text-xl text-primary font-semibold mb-2">
              Chief Innovation Officer
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Giant Ventures LLC
            </p>

            {/* Disambiguation Notice */}
            <Card className="bg-accent/10 border-accent/30 mb-8">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground italic">
                  <strong>Note:</strong> Not affiliated with Steven Grillo from the Howard Stern Show.
                </p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <div className="flex justify-center gap-4 mb-8">
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.linkedin.com/in/stevengrillo" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:steve@bevalid.app">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </a>
              </Button>
            </div>
          </div>

          {/* Bio Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Steven Grillo, Chief Innovation Officer at Giant Ventures LLC, focuses on AI governance and synthesized/genetic AI orchestration that flushes sensitive data ephemerally and lowers storage costs—built for zero-trust environments.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With deep expertise in data pipelines, conduit integrations, and compliance-ready audit trails, Steven leads the development of Valid and Synth—platforms that enable organizations to govern AI safely while minimizing data custody and liability.
            </p>
          </section>

          {/* Expertise Areas */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Areas of Expertise</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {expertiseAreas.map((area, index) => (
                <Card key={index} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <area.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{area.title}</h3>
                        <p className="text-sm text-muted-foreground">{area.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Publications & White Papers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Publications & White Papers</h2>
            <div className="space-y-4">
              <Link to="/whitepapers/genetic-ai-foundations" className="block">
                <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Genetic AI Foundations: Governance and Cost-Aware Pipelines</h3>
                    <p className="text-sm text-muted-foreground">Genetic AI governance, ephemeral data flushing, zero-trust conduits, and storage cost reduction.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/whitepapers/synthesized-ai-orchestration" className="block">
                <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Synthesized AI Orchestration: Ephemeral Data and Zero-Trust</h3>
                    <p className="text-sm text-muted-foreground">Synthesized AI orchestration, ephemeral data flushing, zero-trust, Valid and Synth connectors.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/whitepapers/ai-orchestration-cost-savings" className="block">
                <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">AI Orchestration for Cost Savings: Minimize, Deduplicate, Enforce TTL</h3>
                    <p className="text-sm text-muted-foreground">Data minimization, dedupe, cold storage, retention TTL; governance pipelines that cut 25–60% storage.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Related Links */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link to="/ai-governance">AI Governance</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/ephemeral-data-flushing">Ephemeral Data</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/security/zero-trust">Zero Trust</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/brand-safety">Brand Safety</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default StevenGrillo;
