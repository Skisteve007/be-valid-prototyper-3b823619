import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, FlaskConical, Scale, Brain, Shield, FileText, Users, Sparkles, BookOpen, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ResearchGovernanceLabs = () => {
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
      link: "/governance-constitution",
      isPdf: false
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
      isPdf: true
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
                    className="bg-card/50 border-border/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {pub.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{pub.type}</p>
                        </div>
                        <FileText className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href={pub.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Read
                          </Button>
                        </a>
                        <a 
                          href={pub.link} 
                          download
                          className="flex-1"
                        >
                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Link key={index} to={pub.link}>
                    <Card className="bg-card/50 border-border/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] cursor-pointer group">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                            {pub.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{pub.type}</p>
                        </div>
                        <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                      </CardContent>
                    </Card>
                  </Link>
                )
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
    </>
  );
};

export default ResearchGovernanceLabs;
