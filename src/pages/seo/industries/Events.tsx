import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Music, QrCode, Shield, BarChart3, Ticket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Events = () => {
  return (
    <>
      <Helmet>
        <title>Events & Venues | QR Check-Ins, Ticketing Integrations, Real-Time Analytics</title>
        <meta name="description" content="Seamless QR codes for concerts, festivals, and stadiums. Ephemeral visitor data and secure integrations with ticketing and access control." />
        <meta name="keywords" content="event qr codes, admissions qr, venue analytics, stadium events, festival check-ins, event data privacy, ticketing integration" />
        <link rel="canonical" href="https://www.bevalid.app/industries/events" />
        <meta property="og:title" content="Events & Venues | Giant Ventures" />
        <meta property="og:description" content="Seamless QR codes for concerts, festivals, and stadiums. Ephemeral visitor data and secure integrations." />
        <meta property="og:url" content="https://www.bevalid.app/industries/events" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Event & Venue Solutions",
            "provider": { "@type": "Organization", "name": "Giant Ventures LLC" },
            "areaServed": "Global",
            "description": "QR check-in solutions for concerts, festivals, and stadiums with ephemeral data and ticketing integrations.",
            "category": "Events"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "QR-Enabled Venue Check-In",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "organizer": { "@type": "Organization", "name": "Giant Ventures LLC" },
            "description": "Frictionless QR check-in experiences for events and venues"
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Music className="h-8 w-8 text-purple-500" />
              <span className="text-sm font-semibold text-purple-500 uppercase tracking-wider">Events & Venues</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron mb-6 text-foreground">
              Frictionless QR Experiences—Secure by Default
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              Seamless QR codes for concerts, festivals, and stadiums. Ephemeral visitor 
              data and secure integrations with ticketing and access control. Speed at 
              the door without sacrificing security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold">
                <Link to="/demos">
                  Get a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/conduit-integrations">See Integrations</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Event Features */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-orbitron mb-12 text-center">
              Built for Live Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-purple-500/30 bg-card/50">
                <CardHeader>
                  <QrCode className="h-10 w-10 text-purple-500 mb-2" />
                  <CardTitle>Instant Check-In</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sub-second QR scans for rapid entry. Process thousands of guests 
                    per hour without bottlenecks.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/30 bg-card/50">
                <CardHeader>
                  <Ticket className="h-10 w-10 text-purple-500 mb-2" />
                  <CardTitle>Ticketing Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect to Ticketmaster, AXS, Eventbrite, and custom systems. 
                    Real-time validation and fraud prevention.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/30 bg-card/50">
                <CardHeader>
                  <Shield className="h-10 w-10 text-purple-500 mb-2" />
                  <CardTitle>Security Screening</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Optional deep screening for high-security events. Background checks 
                    completed before guests reach the door.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/30 bg-card/50">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-purple-500 mb-2" />
                  <CardTitle>Real-Time Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Crowd flow, entry rates, and capacity tracking. Privacy-safe 
                    telemetry for operations optimization.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/30 bg-card/50">
                <CardHeader>
                  <Users className="h-10 w-10 text-purple-500 mb-2" />
                  <CardTitle>VIP Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Dedicated lanes and expedited entry for VIP guests. Preference 
                    management without persistent data storage.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/30 bg-card/50">
                <CardHeader>
                  <Music className="h-10 w-10 text-purple-500 mb-2" />
                  <CardTitle>Ephemeral Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visitor data automatically purges after the event. Keep analytics, 
                    flush PII—by policy.
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
                <p className="text-5xl font-bold text-purple-500 mb-2">&lt;1s</p>
                <p className="text-muted-foreground">Average scan time</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-purple-500 mb-2">10K+</p>
                <p className="text-muted-foreground">Scans per hour capacity</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-purple-500 mb-2">99.9%</p>
                <p className="text-muted-foreground">Uptime SLA</p>
              </div>
            </div>
          </div>
        </section>

        {/* Venue Types */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-orbitron mb-8 text-center">
              Venue Types We Serve
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-lg bg-card border border-purple-500/20">
                <p className="font-semibold">Stadiums</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-purple-500/20">
                <p className="font-semibold">Arenas</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-purple-500/20">
                <p className="font-semibold">Festivals</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-purple-500/20">
                <p className="font-semibold">Concerts</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-purple-500/20">
                <p className="font-semibold">Nightclubs</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-purple-500/20">
                <p className="font-semibold">Conferences</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-purple-500/20">
                <p className="font-semibold">Theme Parks</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-purple-500/20">
                <p className="font-semibold">Sports Events</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-orbitron mb-6">
              Ready to Transform Your Entry Experience?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how our QR solutions can speed up entry while enhancing security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold">
                <Link to="/demos">Request Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/industries/healthcare">Healthcare Solutions</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Events;
