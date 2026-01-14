import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Shield, QrCode, Lock, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Education = () => {
  return (
    <>
      <Helmet>
        <title>Universities | Student Privacy, Ephemeral Data, QR Orientations</title>
        <meta name="description" content="FERPA-minded governance, QR event services for orientations, and connectors for campus life with zero-trust controls." />
        <meta name="keywords" content="university data governance, FERPA compliance, student privacy, campus events, orientation check-in, education zero trust" />
        <link rel="canonical" href="https://www.bevalid.app/industries/education" />
        <meta property="og:title" content="Universities | Giant Ventures" />
        <meta property="og:description" content="FERPA-minded governance, QR event services for orientations, and connectors for campus life with zero-trust controls." />
        <meta property="og:url" content="https://www.bevalid.app/industries/education" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Education Data Governance",
            "provider": { "@type": "Organization", "name": "Giant Ventures LLC" },
            "areaServed": "Global",
            "description": "FERPA-minded data governance for universities with QR event services and zero-trust campus controls.",
            "category": "Education"
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-8 w-8 text-indigo-500" />
              <span className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">Education</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron mb-6 text-foreground">
              Privacy-First Governance for Modern Campuses
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              FERPA-minded governance, QR event services for orientations, and connectors 
              for campus life with zero-trust controls. Protect student data while enabling 
              seamless campus experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold">
                <Link to="/demos">
                  Get a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/ephemeral-data-flushing">Data Flushing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Education-Specific Features */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-orbitron mb-12 text-center">
              Built for Higher Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-indigo-500/30 bg-card/50">
                <CardHeader>
                  <QrCode className="h-10 w-10 text-indigo-500 mb-2" />
                  <CardTitle>Orientation Check-In</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    QR-based check-in for orientations and campus events. Ephemeral 
                    attendance data with FERPA-aware retention policies.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-indigo-500/30 bg-card/50">
                <CardHeader>
                  <Shield className="h-10 w-10 text-indigo-500 mb-2" />
                  <CardTitle>Student Record Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Fine-grained access controls for student records. Only authorized 
                    staff see relevant fields based on legitimate educational interest.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-indigo-500/30 bg-card/50">
                <CardHeader>
                  <Users className="h-10 w-10 text-indigo-500 mb-2" />
                  <CardTitle>Parent/Guardian Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Controlled information release with consent management. 
                    FERPA disclosure tracking and audit trails.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-indigo-500/30 bg-card/50">
                <CardHeader>
                  <Calendar className="h-10 w-10 text-indigo-500 mb-2" />
                  <CardTitle>Campus Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    QR services for concerts, sports, and campus activities. 
                    Real-time analytics with privacy-safe telemetry.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-indigo-500/30 bg-card/50">
                <CardHeader>
                  <Lock className="h-10 w-10 text-indigo-500 mb-2" />
                  <CardTitle>LMS Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Secure conduits to Canvas, Blackboard, and other LMS platforms. 
                    Data governance policies extend across learning systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-indigo-500/30 bg-card/50">
                <CardHeader>
                  <GraduationCap className="h-10 w-10 text-indigo-500 mb-2" />
                  <CardTitle>AI Governance for EdTech</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Govern AI tools used by students and faculty. Audit trails 
                    for AI-assisted work in academic settings.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-orbitron mb-8 text-center">
              Campus Use Cases
            </h2>
            <div className="space-y-4">
              <Card className="border-indigo-500/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">University Orientations</h3>
                  <p className="text-muted-foreground text-sm">
                    QR check-ins for new student orientation sessions with automatic 
                    attendance tracking and ephemeral data handling.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-indigo-500/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Stadium and Arena Events</h3>
                  <p className="text-muted-foreground text-sm">
                    Manage access for college sports, concerts, and major campus events 
                    with integrated ticketing and security screening.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-indigo-500/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Library and Lab Access</h3>
                  <p className="text-muted-foreground text-sm">
                    Zero-trust access controls for restricted resources with 
                    continuous verification and usage logging.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-orbitron mb-6">
              Ready to Modernize Campus Data Governance?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how our platform can enhance student privacy while enabling 
              seamless campus experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold">
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

export default Education;
