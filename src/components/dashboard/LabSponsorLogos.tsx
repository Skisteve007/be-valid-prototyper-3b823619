import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
}

interface LabSponsorLogosProps {
  category: 'lab_certified' | 'toxicology';
}

export const LabSponsorLogos = ({ category }: LabSponsorLogosProps) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabSponsors();
  }, [category]);

  const fetchLabSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("id, name, logo_url, website_url")
        .eq("category", category)
        .eq("active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      console.error("Error fetching lab sponsors:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/40 bg-muted/20">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground text-center mb-3">
          Lab Testing Partner{sponsors.length > 1 ? 's' : ''}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.website_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              {sponsor.logo_url ? (
                <img
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                />
              ) : (
                <span className="text-sm text-muted-foreground">{sponsor.name}</span>
              )}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
