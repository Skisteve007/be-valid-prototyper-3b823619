import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Venue {
  id: string;
  venue_name: string;
  city: string;
  country: string;
  category: string;
}

interface VenueCheckinProps {
  userId: string;
}

export const VenueCheckin = ({ userId }: VenueCheckinProps) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase
        .from("partner_venues")
        .select("id, venue_name, city, country, category")
        .order("city", { ascending: true });

      if (error) {
        console.error("Error fetching venues:", error);
      } else {
        setVenues(data || []);
      }
      setLoading(false);
    };

    fetchVenues();
  }, []);

  // Get unique countries, sorted with USA first
  const countries = [...new Set(venues.map(v => v.country))].sort((a, b) => {
    // USA always first
    if (a === "USA" || a === "United States") return -1;
    if (b === "USA" || b === "United States") return 1;
    return a.localeCompare(b);
  });

  // Filter venues by selected country
  const filteredVenues = selectedCountry 
    ? venues.filter(v => v.country === selectedCountry)
    : venues;

  // Group filtered venues by city
  const venuesByCity = filteredVenues.reduce((acc, venue) => {
    if (!acc[venue.city]) {
      acc[venue.city] = [];
    }
    acc[venue.city].push(venue);
    return acc;
  }, {} as Record<string, Venue[]>);

  const handleVenueSelect = async (venueId: string) => {
    setSelectedVenue(venueId);
    
    const venue = venues.find(v => v.id === venueId);
    if (!venue) return;

    // Save check-in to database
    const { error } = await supabase
      .from("user_checkins")
      .insert({
        user_id: userId,
        venue_id: venueId,
      });

    if (error) {
      console.error("Error saving check-in:", error);
    }

    // Construct Google Business search URL and redirect
    const searchQuery = encodeURIComponent(`${venue.venue_name} ${venue.city} ${venue.country} google business`);
    const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
    
    toast.success(`Finding ${venue.venue_name} on Google...`);
    
    // Open in new tab
    window.open(googleSearchUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return null;
  }

  return (
    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">Where are you heading tonight?</span>
        <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
      </div>
      
      <div className="space-y-3">
        {/* Country Filter - USA First */}
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-full bg-background h-9 text-sm">
            <SelectValue placeholder="Filter by country..." />
          </SelectTrigger>
          <SelectContent className="bg-background z-50 max-h-48 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
            <SelectItem value="all" className="text-sm py-1.5">All Countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country} className="text-sm py-1.5">
                {country === "USA" ? "🇺🇸 United States" : country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Venue Selection */}
        <Select value={selectedVenue} onValueChange={handleVenueSelect}>
          <SelectTrigger className="w-full bg-background h-9 text-sm">
            <SelectValue placeholder="Select a venue..." />
          </SelectTrigger>
          <SelectContent className="bg-background z-50 max-h-52 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
            {Object.entries(venuesByCity).map(([city, cityVenues]) => (
              <div key={city}>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted/50">
                  {city}
                </div>
                {cityVenues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id} className="text-sm py-1.5">
                    <span className="flex items-center gap-1.5">
                      <span>{venue.venue_name}</span>
                      <span className="text-[10px] text-muted-foreground">({venue.category})</span>
                    </span>
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
