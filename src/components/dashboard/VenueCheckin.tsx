import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface Venue {
  id: string;
  venue_name: string;
  city: string;
  category: string;
}

interface VenueCheckinProps {
  userId: string;
}

export const VenueCheckin = ({ userId }: VenueCheckinProps) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase
        .from("partner_venues")
        .select("id, venue_name, city, category")
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

  const handleVenueSelect = async (venueId: string) => {
    setSelectedVenue(venueId);
    
    const { error } = await supabase
      .from("user_checkins")
      .insert({
        user_id: userId,
        venue_id: venueId,
      });

    if (error) {
      console.error("Error saving check-in:", error);
      toast.error("Failed to save check-in");
    } else {
      const venue = venues.find(v => v.id === venueId);
      toast.success(`Checked in to ${venue?.venue_name}!`);
    }
  };

  // Group venues by city
  const venuesByCity = venues.reduce((acc, venue) => {
    if (!acc[venue.city]) {
      acc[venue.city] = [];
    }
    acc[venue.city].push(venue);
    return acc;
  }, {} as Record<string, Venue[]>);

  if (loading) {
    return null;
  }

  return (
    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">Where are you heading tonight?</span>
      </div>
      <Select value={selectedVenue} onValueChange={handleVenueSelect}>
        <SelectTrigger className="w-full bg-background">
          <SelectValue placeholder="Select a venue..." />
        </SelectTrigger>
        <SelectContent className="bg-background z-50">
          {Object.entries(venuesByCity).map(([city, cityVenues]) => (
            <div key={city}>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                {city}
              </div>
              {cityVenues.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  <span className="flex items-center gap-2">
                    <span>{venue.venue_name}</span>
                    <span className="text-xs text-muted-foreground">({venue.category})</span>
                  </span>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
