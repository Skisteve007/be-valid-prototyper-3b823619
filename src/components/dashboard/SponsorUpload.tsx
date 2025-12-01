import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SponsorUploadProps {
  userId: string;
}

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  section: number;
}

const SponsorUpload = ({ userId }: SponsorUploadProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    checkAdminStatus();
    loadSponsors();
  }, [userId]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "administrator")
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin status:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("id, name, logo_url, website_url, tier, section")
        .eq("active", true)
        .order("display_order", { ascending: true })
        .limit(3);

      if (error) throw error;

      if (data && data.length > 0) {
        setSponsors(data);
      }
    } catch (error) {
      console.error("Error loading sponsors:", error);
    }
  };

  const handleSponsorClick = (sponsorId: string) => {
    // Track sponsor click
    supabase.from("sponsor_analytics").insert({
      sponsor_id: sponsorId,
      event_type: "click",
      page_url: window.location.href,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin || sponsors.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>This Month's Sponsors</CardTitle>
        <CardDescription>
          Thank you to our community sponsors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="space-y-2">
              <div className="relative border-2 border-border rounded-lg p-4 hover:border-primary transition-colors bg-card">
                {sponsor.logo_url ? (
                  sponsor.website_url ? (
                    <a
                      href={sponsor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSponsorClick(sponsor.id)}
                      className="block transform transition-transform hover:scale-105"
                    >
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        className="w-full h-32 object-contain cursor-pointer"
                      />
                    </a>
                  ) : (
                    <img
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      className="w-full h-32 object-contain"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
                    <p className="text-sm">{sponsor.name}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorUpload;
