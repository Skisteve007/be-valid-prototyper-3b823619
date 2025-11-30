import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Loader2 } from "lucide-react";
import logo from "@/assets/clean-check-logo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: 'platinum' | 'gold' | 'silver';
}

const Sponsors = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sponsors, setSponsors] = useState<{
    platinum: Sponsor[];
    gold: Sponsor[];
    silver: Sponsor[];
  }>({
    platinum: [],
    gold: [],
    silver: [],
  });

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;

      const grouped = {
        platinum: [] as Sponsor[],
        gold: [] as Sponsor[],
        silver: [] as Sponsor[],
      };

      (data as Sponsor[])?.forEach((sponsor) => {
        grouped[sponsor.tier].push(sponsor);
      });

      setSponsors(grouped);
    } catch (error) {
      console.error("Failed to load sponsors:", error);
    } finally {
      setLoading(false);
    }
  };

  const trackSponsorView = async (sponsorId: string) => {
    try {
      await supabase.from("sponsor_analytics").insert({
        sponsor_id: sponsorId,
        event_type: "view",
        page_url: window.location.href,
      });
    } catch (error) {
      console.error("Failed to track view:", error);
    }
  };

  const handleSponsorClick = async (sponsor: Sponsor) => {
    try {
      await supabase.from("sponsor_analytics").insert({
        sponsor_id: sponsor.id,
        event_type: "click",
        page_url: window.location.href,
      });
    } catch (error) {
      console.error("Failed to track click:", error);
    }
  };

  useEffect(() => {
    const allSponsors = [...sponsors.platinum, ...sponsors.gold, ...sponsors.silver];
    allSponsors.forEach((sponsor) => trackSponsorView(sponsor.id));
  }, [sponsors]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-500';
      case 'gold': return 'bg-yellow-500';
      case 'silver': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getTierSize = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'h-32 md:h-40';
      case 'gold': return 'h-24 md:h-32';
      case 'silver': return 'h-20 md:h-24';
      default: return 'h-20';
    }
  };

  const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <Badge className={getTierColor(sponsor.tier)}>
            {sponsor.tier.toUpperCase()}
          </Badge>
          
          {sponsor.logo_url ? (
            <div className={`flex items-center justify-center ${getTierSize(sponsor.tier)}`}>
              <img 
                src={sponsor.logo_url} 
                alt={sponsor.name}
                className="w-auto h-full object-contain"
              />
            </div>
          ) : (
            <div className={`${getTierSize(sponsor.tier)} bg-muted rounded flex items-center justify-center w-full`}>
              <span className="text-muted-foreground">{sponsor.name}</span>
            </div>
          )}
          
          <h3 className="font-semibold text-lg text-center">{sponsor.name}</h3>
          
          {sponsor.website_url && (
            <a
              href={sponsor.website_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSponsorClick(sponsor)}
              className="text-primary hover:underline flex items-center gap-1"
            >
              Visit Website <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex justify-center items-center">
            <img src={logo} alt="Clean Check" className="h-30 w-auto cursor-pointer" onClick={() => navigate("/")} />
          </div>
          <Button variant="outline" onClick={() => navigate("/")} className="absolute right-4 top-1/2 -translate-y-1/2">
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Community Sponsors</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thank you to our trusted sponsors who support our mission of elevating intimacy through verified transparency and mutual trust.
          </p>
        </div>

        {sponsors.platinum.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Platinum Sponsors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsors.platinum.map((sponsor) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        )}

        {sponsors.gold.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Gold Sponsors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sponsors.gold.map((sponsor) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        )}

        {sponsors.silver.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Silver Sponsors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {sponsors.silver.map((sponsor) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        )}

        {sponsors.platinum.length === 0 && sponsors.gold.length === 0 && sponsors.silver.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No sponsors to display at this time.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Sponsors;