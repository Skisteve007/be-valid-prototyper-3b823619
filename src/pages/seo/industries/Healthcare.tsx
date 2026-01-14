import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Timer, QrCode, Lock, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Healthcare = () => {
  return (
    <>
      <Helmet>
        <title>Healthcare & Hospitals | HIPAA-Aware Intake, Ephemeral Data, Zero-Trust</title>
        <meta name="description" content="Patient and visitor data controls with ephemeral flushing, QR intake, and least-privilege access across hospital systems." />
        <meta name="keywords" content="healthcare data governance, HIPAA compliance, hospital visitor management, patient data privacy, healthcare zero trust, ephemeral patient data" />
        <link rel="canonical" href="https://www.bevalid.app/industries/healthcare" />
        <meta property="og:title" content="Healthcare & Hospitals | Giant Ventures" />
        <meta property="og:description" content="Patient and visitor data controls with ephemeral flushing, QR intake, and least-privilege access across hospital systems." />
        <meta property="og:url" content="https://www.bevalid.app/industries/healthcare" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Healthcare Data Governance",
            "provider": { "@type": "Organization", "name": "Giant Ventures LLC" },
            "areaServed": "Global",
            "description": "HIPAA-aware data governance for hospitals with ephemeral flushing, QR intake, and zero-trust access controls.",
            "category": "Healthcare"
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-red-500/10" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-sm font-semibold text-pink-500 uppercase tracking-wider">Healthcare</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron mb-6 text-foreground">
              Zero-Trust Data Controls for Hospitals and Health Systems
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              Patient and visitor data controls with ephemeral flushing, QR intake, 
              and least-privilege access across hospital systems. Built with HIPAA 
              requirements in mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold">
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

        {/* Healthcare-Specific Features */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-orbitron mb-12 text-center">
              Healthcare-Specific Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-pink-500/30 bg-card/50">
                <CardHeader>
                  <QrCode className="h-10 w-10 text-pink-500 mb-2" />
                  <CardTitle>Visitor Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    HIPAA-aware QR check-in for visitors. Ephemeral data capture with 
                    automatic purge after visit completion.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-500/30 bg-card/50">
                <CardHeader>
                  <Timer className="h-10 w-10 text-pink-500 mb-2" />
                  <CardTitle>Time-Boxed Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configure retention per data class. Patient data follows different 
                    rules than operational logs—all automated.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-500/30 bg-card/50">
                <CardHeader>
                  <Shield className="h-10 w-10 text-pink-500 mb-2" />
                  <CardTitle>Access Auditing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every PHI access is logged with user, timestamp, and justification. 
                    Instant compliance reporting for auditors.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-500/30 bg-card/50">
                <CardHeader>
                  <Lock className="h-10 w-10 text-pink-500 mb-2" />
                  <CardTitle>Minimum Necessary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Enforce minimum necessary access automatically. Role-based views 
                    show only required fields for each job function.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-500/30 bg-card/50">
                <CardHeader>
                  <UserCheck className="h-10 w-10 text-pink-500 mb-2" />
                  <CardTitle>Staff Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Continuous verification of staff credentials. License checks, 
                    background screening, and privilege escalation controls.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-500/30 bg-card/50">
                <CardHeader>
                  <Heart className="h-10 w-10 text-pink-500 mb-2" />
                  <CardTitle>EHR Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Secure conduits to major EHR systems. Data governance policies 
                    extend to integrated systems automatically.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Compliance Callout */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-red-500/5">
              <CardContent className="pt-8 pb-8 px-8">
                <h3 className="text-2xl font-bold font-orbitron mb-4">
                  Built for Healthcare Compliance
                </h3>
                <p className="text-muted-foreground mb-4">
                  Our platform is designed with HIPAA requirements in mind. While we don't claim 
                  HIPAA certification (that's about your processes, not our software), we provide 
                  the tools and controls needed for compliant operations:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Access controls aligned with HIPAA Security Rule</li>
                  <li>• Audit logging for accountability requirements</li>
                  <li>• Encryption in transit and at rest</li>
                  <li>• Business Associate Agreement available</li>
                  <li>• Breach notification workflow support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-orbitron mb-6">
              Ready to Secure Your Health System?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how our zero-trust platform can enhance your healthcare data governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold">
                <Link to="/demos">Request Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/industries/education">Education Solutions</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Healthcare;
