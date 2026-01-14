import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, FlaskConical, Scale, Brain, Shield, FileText, Users, Sparkles, BookOpen, Download, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhitePaperModal } from "@/components/WhitePaperModal";

const ResearchGovernanceLabs = () => {
  const [whitePaperOpen, setWhitePaperOpen] = useState(false);

  const researchAreas = [
    {
      icon: Brain,
      title: "AI Senate Architecture",
      description: "Research into multi-model deliberation systems and consensus-building mechanisms for AI governance.",
      status: "Active Research",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Scale,
      title: "Human Vetting Standards",
      description: "Developing frameworks for human-AI collaboration scoring and operator certification rubrics.",
      status: "Active Research",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Zero-Trust Verification",
      description: "Pioneering privacy-preserving identity verification with ephemeral token architecture.",
      status: "Active Research",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: FileText,
      title: "Governance Constitution",
      description: "Establishing foundational principles for AI governance and human oversight requirements.",
      status: "Published",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Operator Certification",
      description: "Building standardized evaluation frameworks for human operators working with AI systems.",
      status: "Active Research",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: FlaskConical,
      title: "Signal Conduit Architecture",
      description: "Research into data minimization patterns and privacy-first verification flows.",
      status: "Active Research",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const publications = [
    {
      title: "Grillo AI Governance Standard Constitution",
      type: "Governance Document",
      description: "Is your AI legally defensible? This Constitution outlines the mandatory 'Reasonable Care' standards now required across emerging state liability laws. It provides the exact protocols necessary to protect your enterprise from agentic drift and negligence claims. Download the official blueprint for secured, compliant, and defensible AI operations today.",
      link: "/governance-constitution",
      isPdf: false,
      downloadPdf: "/documents/The_Grillo_AI_Governance_Standard_Constitution.pdf"
    },
    {
      title: "Human Vetting Methodology",
      type: "Research Paper",
      link: "/human-vetting",
      isPdf: false
    },
    {
      title: "SYNTH™ Senate Architecture",
      type: "Technical Specification",
      link: "/synth/methodology",
      isPdf: false
    },
    {
      title: "Operator Certification Rubric",
      type: "Evaluation Framework",
      link: "/demos/operator-certification",
      isPdf: false
    },
    {
      title: "Governance Labs: Qualifying Agentic Risk",
      type: "Research Paper",
      link: "/documents/Grillo_Agentic_Drift_2026.pdf",
      isPdf: true,
      subHeadline: "Quantifying Agentic Risk in Enterprise Workflows",
      headline: "The 6-Hour Drift: A Forensic Analysis of Contextual Decay",
      abstract: "As Large Language Models (LLMs) evolve into autonomous \"Agents,\" liability shifts from creative hallucination to procedural drift.\n\nIn January 2026, Giant Ventures conducted a controlled stress-test of 5,000 autonomous interactions. We identified a critical \"Drift Threshold\" at 45 minutes, where single-model agents begin to ignore negative safety constraints by a factor of 14% (p < 0.001).\n\nThis research paper outlines the \"Contextual Bloat\" phenomenon and the mathematical efficacy of the Senate Architecture (Multi-Model Consensus) in reducing liability exposure by 99.2%."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Research & Governance Labs | VALID™ SYNTH™</title>
        <meta 
          name="description" 
          content="Explore cutting-edge research in AI governance, human vetting standards, and privacy-preserving verification systems at VALID™ Research & Governance Labs." 
        />
      </Helmet>

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                <FlaskConical className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                  Research & Governance Labs
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Advancing the science of human-AI collaboration
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl">
              Our research labs focus on developing rigorous standards for AI governance, 
              human vetting methodologies, and privacy-preserving verification systems. 
              We're building the foundation for trustworthy AI-human collaboration.
            </p>
          </div>

          {/* Publications Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              Publications & Documents
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {publications.map((pub, index) => (
                pub.isPdf ? (
                  <Card 
                    key={index} 
                    className="bg-card/50 border-border/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] md:col-span-2"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-wider text-purple-400 mb-1">
                            {pub.title}
                          </p>
                          {'subHeadline' in pub && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {(pub as any).subHeadline}
                            </p>
                          )}
                          {'headline' in pub && (
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                              {(pub as any).headline}
                            </h3>
                          )}
                        </div>
                        <FileText className="h-6 w-6 text-purple-400 shrink-0 ml-4" />
                      </div>
                      
                      {'abstract' in pub && (
                        <div className="mb-6">
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {(pub as any).abstract}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          size="lg" 
                          className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                          onClick={() => setWhitePaperOpen(true)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          VIEW WHITE PAPER
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="w-full sm:w-auto border-purple-500/50 text-purple-400 hover:bg-purple-500/10 font-semibold"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = pub.link;
                            link.download = pub.link.split('/').pop() || 'document.pdf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          DOWNLOAD WHITE PAPER (PDF)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card 
                    key={index} 
                    className="bg-card/50 border-border/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link to={pub.link} className="group">
                            <h3 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                              {pub.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{pub.type}</p>
                          {'description' in pub && pub.description && (
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                              {(pub as any).description}
                            </p>
                          )}
                        </div>
                        <Link to={pub.link} className="group">
                          <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                        </Link>
                      </div>
                      {'downloadPdf' in pub && (pub as any).downloadPdf && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-semibold"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = (pub as any).downloadPdf;
                              link.download = 'The_Grillo_AI_Governance_Standard_Constitution.pdf';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download AI Governance Standard Constitution
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          </section>

          {/* Research Areas Grid */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              Active Research Areas
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchAreas.map((area, index) => (
                <Card 
                  key={index} 
                  className="bg-card/50 border-border/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]"
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-3`}>
                      <area.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-foreground">{area.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        area.status === "Published" 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                          : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      }`}>
                        {area.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {area.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10 border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Interested in Our Research?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Explore our live demos to see these research concepts in action, 
              or dive into our governance constitution for foundational principles.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/demos">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Explore Demos
                </Button>
              </Link>
              <Link to="/governance-constitution">
                <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                  <Scale className="h-4 w-4 mr-2" />
                  Governance Constitution
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <WhitePaperModal
        isOpen={whitePaperOpen}
        onClose={() => setWhitePaperOpen(false)}
        title="The 6-Hour Drift: A Forensic Analysis of Contextual Decay"
        pdfUrl="/documents/Grillo_Agentic_Drift_2026.pdf"
      />
    </>
  );
};

export default ResearchGovernanceLabs;
