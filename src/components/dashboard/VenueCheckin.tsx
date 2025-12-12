import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, ExternalLink, Music, Trophy } from "lucide-react";
import { toast } from "sonner";
import { findVenueDetails } from "@/config/venuesConfig";
import { sportsVenuesConfig, getSportsList, getStatesList, type SportsVenue } from "@/config/sportsVenuesConfig";
import { Button } from "@/components/ui/button";

interface Venue {
  id: string;
  venue_name: string;
  city: string;
  country: string;
  category: string;
}

type VenueCategory = 'clubs' | 'sports';

interface VenueCheckinProps {
  userId: string;
}

export const VenueCheckin = ({ userId }: VenueCheckinProps) => {
  const [venueCategory, setVenueCategory] = useState<VenueCategory>('clubs');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedVenueUrl, setSelectedVenueUrl] = useState<string>("");
  const [selectedVenueName, setSelectedVenueName] = useState<string>("");
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

  // Reset selections when category changes
  useEffect(() => {
    setSelectedVenue("");
    setSelectedVenueUrl("");
    setSelectedVenueName("");
    setSelectedCountry("");
    setSelectedSport("");
    setSelectedState("");
  }, [venueCategory]);

  // Filter clubs/nightlife venues (exclude sports categories)
  const sportsCategories = ['NFL Stadium', 'NBA Arena', 'MLB Stadium', 'NHL Arena', 'NCAA Stadium', 'MLS Stadium'];
  const clubVenues = venues.filter(v => !sportsCategories.includes(v.category));

  // Get unique countries for clubs, sorted with USA first
  const countries = [...new Set(clubVenues.map(v => v.country))].sort((a, b) => {
    if (a === "USA" || a === "United States") return -1;
    if (b === "USA" || b === "United States") return 1;
    return a.localeCompare(b);
  });

  // Filter clubs by selected country
  const filteredVenues = selectedCountry && selectedCountry !== "all"
    ? clubVenues.filter(v => v.country === selectedCountry)
    : clubVenues;

  // Group filtered venues by city
  const venuesByCity = filteredVenues.reduce((acc, venue) => {
    if (!acc[venue.city]) {
      acc[venue.city] = [];
    }
    acc[venue.city].push(venue);
    return acc;
  }, {} as Record<string, Venue[]>);

  // Sports venues filtering
  const sportsList = getSportsList();
  const statesList = getStatesList();
  
  const filteredSportsVenues = sportsVenuesConfig.filter(v => {
    if (selectedSport && selectedSport !== "all" && v.sport !== selectedSport) return false;
    if (selectedState && selectedState !== "all" && v.state !== selectedState) return false;
    return true;
  });

  // Group sports venues by sport
  const sportsVenuesBySport = filteredSportsVenues.reduce((acc, venue) => {
    if (!acc[venue.sport]) {
      acc[venue.sport] = [];
    }
    acc[venue.sport].push(venue);
    return acc;
  }, {} as Record<string, SportsVenue[]>);

  const handleClubSelect = async (venueId: string) => {
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

    const venueDetails = findVenueDetails(venue.venue_name, venue.city);
    
    let mapUrl: string;
    if (venueDetails?.map_link) {
      mapUrl = venueDetails.map_link;
    } else {
      const searchQuery = encodeURIComponent(`${venue.venue_name} ${venue.city} ${venue.country}`);
      mapUrl = `https://www.google.com/search?q=${searchQuery}`;
    }
    
    setSelectedVenueUrl(mapUrl);
    setSelectedVenueName(venue.venue_name);
    toast.success(`Tap below to view ${venue.venue_name} on Google`);
  };

  const handleSportsVenueSelect = (venueKey: string) => {
    setSelectedVenue(venueKey);
    
    const [name, city] = venueKey.split('|');
    const venue = sportsVenuesConfig.find(v => v.name === name && v.city === city);
    if (!venue) return;
    
    setSelectedVenueUrl(venue.map_link);
    setSelectedVenueName(venue.name);
    toast.success(`Tap below to view ${venue.name} on Google Maps`);
  };

  if (loading) {
    return null;
  }

  return (
    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">Where are you heading tonight?</span>
        <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" aria-hidden="true" />
      </div>
      
      {/* Category Toggle */}
      <div className="flex gap-2 mb-3">
        <Button
          variant={venueCategory === 'clubs' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setVenueCategory('clubs')}
          className="flex-1 h-9 px-2 text-xs"
        >
          <Music className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">Nightlife</span>
        </Button>
        <Button
          variant={venueCategory === 'sports' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setVenueCategory('sports')}
          className="flex-1 h-9 px-2 text-xs"
        >
          <Trophy className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">Sports</span>
        </Button>
      </div>

      <div className="space-y-3">
        {venueCategory === 'clubs' ? (
          <>
            {/* Country Filter */}
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full bg-background h-9 text-sm">
                <SelectValue placeholder="Filter by country..." />
              </SelectTrigger>
              <SelectContent className="bg-background z-50 max-h-48 w-[calc(100vw-3rem)] max-w-[280px] overflow-y-auto scroll-smooth touch-pan-y" side="bottom" align="start" sideOffset={4} avoidCollisions={false}>
                <SelectItem value="all" className="text-sm py-2">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country} className="text-sm py-2">
                    {country === "USA" ? "🇺🇸 United States" : country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Club Selection */}
            <Select value={selectedVenue} onValueChange={handleClubSelect}>
              <SelectTrigger className="w-full bg-background h-9 text-sm">
                <SelectValue placeholder="Select a club or venue..." />
              </SelectTrigger>
              <SelectContent className="bg-background z-50 max-h-52 w-[calc(100vw-3rem)] max-w-[280px] overflow-y-auto scroll-smooth touch-pan-y" side="bottom" align="start" sideOffset={4} avoidCollisions={false}>
                {Object.entries(venuesByCity).map(([city, cityVenues]) => (
                  <div key={city}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                      {city}
                    </div>
                    {cityVenues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id} className="text-sm py-2">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate">{venue.venue_name}</span>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">({venue.category})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : (
          <>
            {/* Sports Filter Row */}
            <div className="flex gap-2">
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="flex-1 bg-background h-9 text-sm">
                  <SelectValue placeholder="Sport..." />
                </SelectTrigger>
                <SelectContent className="bg-background z-50 max-h-48 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
                  <SelectItem value="all" className="text-sm py-2">All Sports</SelectItem>
                  {sportsList.map((sport) => (
                    <SelectItem key={sport} value={sport} className="text-sm py-2">
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="flex-1 bg-background h-9 text-sm">
                  <SelectValue placeholder="State..." />
                </SelectTrigger>
                <SelectContent className="bg-background z-50 max-h-48 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
                  <SelectItem value="all" className="text-sm py-2">All States</SelectItem>
                  {statesList.map((state) => (
                    <SelectItem key={state} value={state} className="text-sm py-2">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sports Venue Selection */}
            <Select value={selectedVenue} onValueChange={handleSportsVenueSelect}>
              <SelectTrigger className="w-full bg-background h-9 text-sm">
                <SelectValue placeholder="Select stadium or arena..." />
              </SelectTrigger>
              <SelectContent className="bg-background z-50 max-h-52 w-[calc(100vw-3rem)] max-w-[280px] overflow-y-auto scroll-smooth touch-pan-y" side="bottom" align="start" sideOffset={4} avoidCollisions={false}>
                {Object.entries(sportsVenuesBySport).map(([sport, sportVenues]) => (
                  <div key={sport}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                      {sport}
                    </div>
                    {sportVenues.map((venue) => (
                      <SelectItem 
                        key={`${venue.name}|${venue.city}`} 
                        value={`${venue.name}|${venue.city}`} 
                        className="text-sm py-2"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="truncate">{venue.name}</span>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {venue.city}, {venue.state}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {/* Google Link - Shows after venue selection */}
        {selectedVenue && selectedVenueUrl && (
          <a
            key={`${selectedVenue}-${selectedVenueUrl}`}
            href={selectedVenueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 h-auto rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View {selectedVenueName} on Google
          </a>
        )}
      </div>
    </div>
  );
};
