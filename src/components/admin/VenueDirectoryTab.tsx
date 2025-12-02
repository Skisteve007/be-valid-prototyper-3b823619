import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Search, Mail, Globe, MapPin, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Venue {
  id: string;
  venue_name: string;
  city: string;
  country: string;
  category: string;
  status: string;
  gm_email: string | null;
}

export const VenueDirectoryTab = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [countries, setCountries] = useState<string[]>([]);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [gmEmail, setGmEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const { data, error } = await supabase
        .from("partner_venues")
        .select("*")
        .order("country", { ascending: true })
        .order("city", { ascending: true });

      if (error) throw error;

      setVenues(data || []);
      
      // Extract unique countries
      const uniqueCountries = [...new Set(data?.map(v => v.country) || [])].sort();
      setCountries(uniqueCountries);
    } catch (error: any) {
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!editingVenue) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("partner_venues")
        .update({ gm_email: gmEmail || null })
        .eq("id", editingVenue.id);

      if (error) throw error;

      toast.success("GM Email updated successfully");
      setEditingVenue(null);
      setGmEmail("");
      loadVenues();
    } catch (error: any) {
      toast.error("Failed to update email");
    } finally {
      setSaving(false);
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.venue_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter === "all" || venue.country === countryFilter;
    const matchesCategory = categoryFilter === "all" || venue.category === categoryFilter;
    return matchesSearch && matchesCountry && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Nightlife': return 'bg-purple-500';
      case 'Gentlemen': return 'bg-rose-500';
      case 'Resort': return 'bg-blue-500';
      case 'Lifestyle': return 'bg-pink-500';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Target': return 'bg-yellow-500';
      case 'Pending': return 'bg-orange-500';
      default: return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Global Venue Directory
            </CardTitle>
            <CardDescription>
              {venues.length} venues across {countries.length} countries
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search venues or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Nightlife">Nightlife</SelectItem>
              <SelectItem value="Gentlemen">Gentlemen</SelectItem>
              <SelectItem value="Resort">Resort</SelectItem>
              <SelectItem value="Lifestyle">Lifestyle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredVenues.length} of {venues.length} venues
        </div>

        {/* Venues Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venue</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>GM Email</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVenues.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {venue.venue_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {venue.city}
                    </div>
                  </TableCell>
                  <TableCell>{venue.country}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(venue.category)}>
                      {venue.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(venue.status)}>
                      {venue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {venue.gm_email ? (
                      <a 
                        href={`mailto:${venue.gm_email}`}
                        className="text-primary hover:underline flex items-center gap-1 text-sm"
                      >
                        <Mail className="h-3 w-3" />
                        {venue.gm_email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingVenue(venue);
                            setGmEmail(venue.gm_email || "");
                          }}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit GM Contact</DialogTitle>
                          <DialogDescription>
                            Add or update the General Manager email for {editingVenue?.venue_name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="gm-email">GM Email Address</Label>
                            <Input
                              id="gm-email"
                              type="email"
                              placeholder="gm@venue.com"
                              value={gmEmail}
                              onChange={(e) => setGmEmail(e.target.value)}
                            />
                          </div>
                          <Button 
                            onClick={handleSaveEmail} 
                            disabled={saving}
                            className="w-full"
                          >
                            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Save Email
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No venues found matching your filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
