import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Search, Mail, Globe, MapPin, Building2, Edit, Wine, Sparkles, HardHat, Car, Key, Plus, Banknote, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MobileDataCard, ResponsiveDataList } from "./MobileDataCard";
import { VenueOperatorsManager } from "./VenueOperatorsManager";

interface Venue {
  id: string;
  venue_name: string;
  city: string;
  country: string;
  category: string;
  status: string;
  gm_email: string | null;
  industry_type: string | null;
  bank_endpoint: string | null;
  paypal_email: string | null;
}

type IndustryFilter = 'all' | 'Nightlife' | 'Adult' | 'Workforce' | 'Transportation' | 'Rentals';

const INDUSTRY_CONFIG: Record<string, { icon: typeof Wine; color: string; label: string; emoji: string }> = {
  'Nightlife': { icon: Wine, color: 'bg-blue-500 text-white', label: 'Nightlife & Events', emoji: '🍸' },
  'Adult': { icon: Sparkles, color: 'bg-amber-500 text-black', label: 'Adult / Clubs', emoji: '👠' },
  'Workforce': { icon: HardHat, color: 'bg-slate-500 text-white', label: 'Workforce', emoji: '🏗️' },
  'Transportation': { icon: Car, color: 'bg-emerald-500 text-white', label: 'Transportation', emoji: '🚕' },
  'Rentals': { icon: Key, color: 'bg-yellow-500 text-black', label: 'Rentals', emoji: '🔑' },
};

export const VenueDirectoryTab = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<IndustryFilter>("all");
  const [countries, setCountries] = useState<string[]>([]);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [gmEmail, setGmEmail] = useState("");
  const [editIndustry, setEditIndustry] = useState<string>("");
  const [bankEndpoint, setBankEndpoint] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Add venue state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVenue, setNewVenue] = useState({
    venue_name: "",
    city: "",
    country: "USA",
    category: "Nightlife" as const,
    industry_type: "Nightlife",
    status: "Target",
    gm_email: "",
  });
  const [addingVenue, setAddingVenue] = useState(false);

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

  const handleSaveVenue = async () => {
    if (!editingVenue) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("partner_venues")
        .update({ 
          gm_email: gmEmail || null,
          industry_type: editIndustry || 'Nightlife',
          bank_endpoint: bankEndpoint || null,
          paypal_email: paypalEmail || null
        })
        .eq("id", editingVenue.id);

      if (error) throw error;

      toast.success("Venue updated successfully");
      setEditingVenue(null);
      setGmEmail("");
      setEditIndustry("");
      setBankEndpoint("");
      setPaypalEmail("");
      loadVenues();
    } catch (error: any) {
      toast.error("Failed to update venue");
    } finally {
      setSaving(false);
    }
  };

  const handleAddVenue = async () => {
    if (!newVenue.venue_name || !newVenue.city) {
      toast.error("Please fill in venue name and city");
      return;
    }
    
    setAddingVenue(true);
    try {
      const { error } = await supabase
        .from("partner_venues")
        .insert({
          venue_name: newVenue.venue_name,
          city: newVenue.city,
          country: newVenue.country,
          category: newVenue.category,
          industry_type: newVenue.industry_type,
          status: newVenue.status,
          gm_email: newVenue.gm_email || null,
        });

      if (error) throw error;

      toast.success("Venue added successfully");
      setShowAddDialog(false);
      setNewVenue({
        venue_name: "",
        city: "",
        country: "USA",
        category: "Nightlife",
        industry_type: "Nightlife",
        status: "Target",
        gm_email: "",
      });
      loadVenues();
    } catch (error: any) {
      toast.error("Failed to add venue");
    } finally {
      setAddingVenue(false);
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.venue_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter === "all" || venue.country === countryFilter;
    const matchesIndustry = industryFilter === "all" || venue.industry_type === industryFilter;
    return matchesSearch && matchesCountry && matchesIndustry;
  });

  const getIndustryIcon = (industryType: string | null) => {
    const config = INDUSTRY_CONFIG[industryType || 'Nightlife'];
    if (!config) return <Building2 className="h-4 w-4 text-muted-foreground" />;
    const Icon = config.icon;
    return <Icon className="h-4 w-4" />;
  };

  const getIndustryBadge = (industryType: string | null) => {
    const config = INDUSTRY_CONFIG[industryType || 'Nightlife'];
    if (!config) return <Badge variant="outline">Unknown</Badge>;
    return (
      <Badge className={config.color}>
        {config.emoji} {industryType}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Target': return 'bg-yellow-500';
      case 'Pending': return 'bg-orange-500';
      default: return 'bg-muted';
    }
  };

  // Count venues by industry
  const industryCounts = {
    all: venues.length,
    Nightlife: venues.filter(v => v.industry_type === 'Nightlife').length,
    Adult: venues.filter(v => v.industry_type === 'Adult').length,
    Workforce: venues.filter(v => v.industry_type === 'Workforce').length,
    Transportation: venues.filter(v => v.industry_type === 'Transportation').length,
    Rentals: venues.filter(v => v.industry_type === 'Rentals').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Global Partner Directory
            </CardTitle>
            <CardDescription>
              {venues.length} partners across {countries.length} countries
            </CardDescription>
          </div>
          
          {/* Add Venue Button */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md top-[10%] translate-y-0">
              <DialogHeader>
                <DialogTitle>Add New Partner</DialogTitle>
                <DialogDescription>
                  Add a new venue or company to the partner directory
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Venue/Company Name *</Label>
                  <Input
                    placeholder="Enter name"
                    value={newVenue.venue_name}
                    onChange={(e) => setNewVenue({ ...newVenue, venue_name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input
                      placeholder="City"
                      value={newVenue.city}
                      onChange={(e) => setNewVenue({ ...newVenue, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      placeholder="Country"
                      value={newVenue.country}
                      onChange={(e) => setNewVenue({ ...newVenue, country: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Industry Type *</Label>
                  <Select 
                    value={newVenue.industry_type} 
                    onValueChange={(val) => setNewVenue({ ...newVenue, industry_type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="Nightlife">🍸 Nightlife & Events</SelectItem>
                      <SelectItem value="Adult">👠 Adult / Clubs</SelectItem>
                      <SelectItem value="Workforce">🏗️ Workforce</SelectItem>
                      <SelectItem value="Transportation">🚕 Transportation</SelectItem>
                      <SelectItem value="Rentals">🔑 Rentals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={newVenue.category} 
                    onValueChange={(val: any) => setNewVenue({ ...newVenue, category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="Nightlife">Nightlife</SelectItem>
                      <SelectItem value="Gentlemen">Gentlemen</SelectItem>
                      <SelectItem value="Resort">Resort</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="Spa">Spa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={newVenue.status} 
                    onValueChange={(val) => setNewVenue({ ...newVenue, status: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="Target">Target</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>GM Email (Optional)</Label>
                  <Input
                    type="email"
                    placeholder="gm@company.com"
                    value={newVenue.gm_email}
                    onChange={(e) => setNewVenue({ ...newVenue, gm_email: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={handleAddVenue} 
                  disabled={addingVenue}
                  className="w-full"
                >
                  {addingVenue && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Partner
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Industry Filter Tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b">
          <Button
            variant={industryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIndustryFilter('all')}
            className="gap-1"
          >
            <Globe className="h-4 w-4" /> All ({industryCounts.all})
          </Button>
          <Button
            variant={industryFilter === 'Nightlife' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIndustryFilter('Nightlife')}
            className={industryFilter === 'Nightlife' ? 'bg-blue-500 hover:bg-blue-600' : ''}
          >
            🍸 Nightlife ({industryCounts.Nightlife})
          </Button>
          <Button
            variant={industryFilter === 'Adult' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIndustryFilter('Adult')}
            className={industryFilter === 'Adult' ? 'bg-amber-500 hover:bg-amber-600 text-black' : ''}
          >
            👠 Adult ({industryCounts.Adult})
          </Button>
          <Button
            variant={industryFilter === 'Workforce' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIndustryFilter('Workforce')}
            className={industryFilter === 'Workforce' ? 'bg-slate-500 hover:bg-slate-600' : ''}
          >
            🏗️ Workforce ({industryCounts.Workforce})
          </Button>
          <Button
            variant={industryFilter === 'Transportation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIndustryFilter('Transportation')}
            className={industryFilter === 'Transportation' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
          >
            🚕 Transportation ({industryCounts.Transportation})
          </Button>
          <Button
            variant={industryFilter === 'Rentals' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIndustryFilter('Rentals')}
            className={industryFilter === 'Rentals' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}
          >
            🔑 Rentals ({industryCounts.Rentals})
          </Button>
        </div>

        {/* Search & Country Filter */}
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
            <SelectContent className="bg-background border z-50">
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredVenues.length} of {venues.length} partners
        </div>

        {/* Venues - Responsive Table/Card */}
        <ResponsiveDataList
          mobileCards={
            <div className="space-y-3">
              {filteredVenues.map((venue) => (
                <MobileDataCard
                  key={venue.id}
                  title={
                    <div className="flex items-center gap-2">
                      {getIndustryIcon(venue.industry_type)}
                      {venue.venue_name}
                    </div>
                  }
                  subtitle={`${venue.city}, ${venue.country}`}
                  badge={{
                    text: venue.industry_type || 'Nightlife',
                    className: INDUSTRY_CONFIG[venue.industry_type || 'Nightlife']?.color || 'bg-blue-500'
                  }}
                  details={[
                    { label: "Industry", value: getIndustryBadge(venue.industry_type) },
                    { label: "Status", value: <Badge variant="outline" className={getStatusColor(venue.status)}>{venue.status}</Badge> },
                    { 
                      label: "GM Email", 
                      value: venue.gm_email ? (
                        <a href={`mailto:${venue.gm_email}`} className="text-primary text-xs truncate block">
                          {venue.gm_email}
                        </a>
                      ) : "Not set"
                    },
                  ]}
                  actions={
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="lg"
                          variant="outline"
                          className="flex-1 h-12"
                          onClick={() => {
                            setEditingVenue(venue);
                            setGmEmail(venue.gm_email || "");
                            setEditIndustry(venue.industry_type || "Nightlife");
                            setBankEndpoint(venue.bank_endpoint || "");
                            setPaypalEmail(venue.paypal_email || "");
                          }}
                        >
                          <Edit className="h-5 w-5 mr-2" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Partner</DialogTitle>
                          <DialogDescription>
                            Update details for {editingVenue?.venue_name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Industry Type</Label>
                            <Select value={editIndustry} onValueChange={setEditIndustry}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background border z-50">
                                <SelectItem value="Nightlife">🍸 Nightlife & Events</SelectItem>
                                <SelectItem value="Adult">👠 Adult / Clubs</SelectItem>
                                <SelectItem value="Workforce">🏗️ Workforce</SelectItem>
                                <SelectItem value="Transportation">🚕 Transportation</SelectItem>
                                <SelectItem value="Rentals">🔑 Rentals</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gm-email-mobile">GM Email Address</Label>
                            <Input
                              id="gm-email-mobile"
                              type="email"
                              placeholder="gm@venue.com"
                              value={gmEmail}
                              onChange={(e) => setGmEmail(e.target.value)}
                              className="h-12"
                            />
                          </div>
                          
                          {/* Payout Configuration Section */}
                          <div className="border-t pt-4 mt-4">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Banknote className="h-4 w-4 text-green-500" />
                              Payout Configuration
                            </h4>
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="paypal-email-mobile" className="flex items-center gap-2">
                                  <CreditCard className="h-3 w-3" />
                                  PayPal Email
                                </Label>
                                <Input
                                  id="paypal-email-mobile"
                                  type="email"
                                  placeholder="payments@venue.com"
                                  value={paypalEmail}
                                  onChange={(e) => setPaypalEmail(e.target.value)}
                                  className="h-12"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="bank-endpoint-mobile" className="flex items-center gap-2">
                                  <Banknote className="h-3 w-3" />
                                  Bank API Endpoint (Optional)
                                </Label>
                                <Input
                                  id="bank-endpoint-mobile"
                                  type="url"
                                  placeholder="https://api.bank.com/payout"
                                  value={bankEndpoint}
                                  onChange={(e) => setBankEndpoint(e.target.value)}
                                  className="h-12"
                                />
                                <p className="text-xs text-muted-foreground">
                                  For direct bank transfers via API integration
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={handleSaveVenue} 
                            disabled={saving}
                            className="w-full h-12"
                          >
                            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  }
                />
              ))}
            </div>
          }
        >
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Industry</TableHead>
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
                        {getIndustryIcon(venue.industry_type)}
                        {venue.venue_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {venue.city}, {venue.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getIndustryBadge(venue.industry_type)}
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
                              setEditIndustry(venue.industry_type || "Nightlife");
                              setBankEndpoint(venue.bank_endpoint || "");
                              setPaypalEmail(venue.paypal_email || "");
                            }}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Partner</DialogTitle>
                            <DialogDescription>
                              Update details for {editingVenue?.venue_name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Industry Type</Label>
                              <Select value={editIndustry} onValueChange={setEditIndustry}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background border z-50">
                                  <SelectItem value="Nightlife">🍸 Nightlife & Events</SelectItem>
                                  <SelectItem value="Adult">👠 Adult / Clubs</SelectItem>
                                  <SelectItem value="Workforce">🏗️ Workforce</SelectItem>
                                  <SelectItem value="Transportation">🚕 Transportation</SelectItem>
                                  <SelectItem value="Rentals">🔑 Rentals</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
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
                            
                            {/* Payout Configuration Section */}
                            <div className="border-t pt-4 mt-4">
                              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <Banknote className="h-4 w-4 text-green-500" />
                                Payout Configuration
                              </h4>
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label htmlFor="paypal-email" className="flex items-center gap-2">
                                    <CreditCard className="h-3 w-3" />
                                    PayPal Email
                                  </Label>
                                  <Input
                                    id="paypal-email"
                                    type="email"
                                    placeholder="payments@venue.com"
                                    value={paypalEmail}
                                    onChange={(e) => setPaypalEmail(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="bank-endpoint" className="flex items-center gap-2">
                                    <Banknote className="h-3 w-3" />
                                    Bank API Endpoint (Optional)
                                  </Label>
                                  <Input
                                    id="bank-endpoint"
                                    type="url"
                                    placeholder="https://api.bank.com/payout"
                                    value={bankEndpoint}
                                    onChange={(e) => setBankEndpoint(e.target.value)}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    For direct bank transfers via API integration
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              onClick={handleSaveVenue} 
                              disabled={saving}
                              className="w-full"
                            >
                              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                              Save Changes
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
        </ResponsiveDataList>

        {filteredVenues.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No partners found matching your filters.
          </div>
        )}
      </CardContent>
    </Card>
    
    {/* Venue Operators Section */}
    <VenueOperatorsManager />
    </>
  );
};
