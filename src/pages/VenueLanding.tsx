import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, ExternalLink, Shield, QrCode, Clock, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to generate URL-friendly slug
export const generateVenueSlug = (venueName: string, city: string): string => {
  return `${venueName}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Helper to parse slug back to search terms
const parseSlug = (slug: string): { name: string; city: string } => {
  const parts = slug.split('-');
  // Try to match common city names at the end
  const commonCities = ['miami', 'vegas', 'york', 'angeles', 'francisco', 'chicago', 'atlanta', 'houston', 'dallas', 'denver', 'seattle', 'boston', 'philadelphia', 'phoenix', 'austin', 'bogota', 'medellin', 'cartagena', 'cali', 'cancun', 'ibiza', 'berlin', 'rome', 'manila', 'bangkok', 'pattaya'];
  
  let cityIndex = parts.length;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (commonCities.includes(parts[i])) {
      cityIndex = i;
      break;
    }
  }
  
  return {
    name: parts.slice(0, cityIndex).join(' '),
    city: parts.slice(cityIndex).join(' ')
  };
};

const VenueLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const { name, city } = parseSlug(slug || '');

  const { data: venue, isLoading, error } = useQuery({
    queryKey: ['venue-landing', slug],
    queryFn: async () => {
      // Search for venue by name and city (case-insensitive)
      const { data, error } = await supabase
        .from('partner_venues')
        .select('*')
        .ilike('venue_name', `%${name.replace(/-/g, ' ')}%`)
        .ilike('city', `%${city}%`)
        .neq('status', 'Inactive')
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Venue Not Found</h1>
        <p className="text-muted-foreground mb-6">The venue you're looking for doesn't exist or is no longer active.</p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    "name": venue.venue_name,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": venue.city,
      "addressCountry": venue.country
    },
    "description": `${venue.venue_name} in ${venue.city}, ${venue.country} partners with VALID for secure identity verification and health-verified entry.`,
    "url": `https://bevalid.app/venues/${slug}`,
    "sameAs": "https://bevalid.app",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "VALID Verified Entry",
        "value": true
      }
    ]
  };

  const pageTitle = `${venue.venue_name} ${venue.city} | VALID Verified Entry`;
  const pageDescription = `Get VALID verified entry at ${venue.venue_name} in ${venue.city}, ${venue.country}. Skip the line with instant QR verification. Zero-trust identity security for ${venue.category.toLowerCase()} venues.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${venue.venue_name}, ${venue.city} nightclub, ${venue.city} clubs, VALID entry, QR verification, ${venue.category}`} />
        <link rel="canonical" href={`https://bevalid.app/venues/${slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={`https://bevalid.app/venues/${slug}`} />
        <meta property="og:type" content="place" />
        <meta property="og:site_name" content="VALID" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground tracking-wider">VALID<sup className="text-xs text-cyan-400">™</sup></span>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                Get Verified
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-background to-background" />
          <div className="container mx-auto px-4 relative">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to VALID™
            </Link>
            
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm mb-4">
                <Shield className="h-4 w-4" />
                VALID™ Partner Venue
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                {venue.venue_name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  {venue.city}, {venue.country}
                </span>
                <span className="px-3 py-1 rounded-full bg-muted text-sm">
                  {venue.category}
                </span>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                Experience seamless entry at {venue.venue_name} with VALID™'s zero-trust identity verification. 
                Get your QR code, skip the line, and enjoy verified access.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-black font-semibold shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                    <QrCode className="mr-2 h-5 w-5" />
                    Get Your VALID™ Pass
                  </Button>
                </Link>
                <Link to="/partners">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 border-t border-border/40">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              Why VALID™ at {venue.venue_name}?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                <QrCode className="h-10 w-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Instant QR Entry</h3>
                <p className="text-muted-foreground text-sm">
                  Skip the line with a 3-second scan. Your VALID™ pass gets you through the door faster.
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                <Shield className="h-10 w-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Verified Identity</h3>
                <p className="text-muted-foreground text-sm">
                  Zero-trust security architecture. Your data stays encrypted, venues only see verification status.
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                <Clock className="h-10 w-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">24-Hour Access</h3>
                <p className="text-muted-foreground text-sm">
                  Ghost™ Mode passes give you seamless access for 24 hours across all VALID™ partner venues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-background to-cyan-500/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Experience {venue.venue_name}?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of verified members who enjoy VIP-level access at the best venues worldwide.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} VALID™. All rights reserved.</p>
            <p className="mt-2">
              <Link to="/terms" className="hover:text-foreground">Terms</Link>
              {" · "}
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
              {" · "}
              <Link to="/partners" className="hover:text-foreground">Partner Solutions</Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default VenueLanding;
