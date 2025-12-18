import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Settings, Wifi, WifiOff, CheckCircle, XCircle, AlertTriangle, 
  Users, RefreshCw, ArrowLeft, Smartphone, Monitor, HelpCircle,
  Clock, Camera
} from "lucide-react";
import ManualCheckEvidence from "@/components/manager/ManualCheckEvidence";
import ScanLogTable from "@/components/manager/ScanLogTable";

interface Venue {
  id: string;
  venue_name: string;
  city: string;
  age_policy?: string;
}

interface VenueSettings {
  id: string;
  venue_id: string;
  age_policy: string;
  allow_door_to_collect_payment: boolean;
  offline_mode_enabled: boolean;
}

interface Device {
  id: string;
  device_name: string;
  device_type: string;
  is_online: boolean;
  last_seen_at: string | null;
}

const ManagerAdmin = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [venueSettings, setVenueSettings] = useState<VenueSettings | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    if (selectedVenueId) {
      loadVenueSettings(selectedVenueId);
      loadDevices(selectedVenueId);
      subscribeToDevices(selectedVenueId);
    }
  }, [selectedVenueId]);

  const loadVenues = async () => {
    try {
      const { data, error } = await supabase
        .from("partner_venues")
        .select("id, venue_name, city, age_policy")
        .order("venue_name");

      if (error) throw error;
      setVenues(data || []);
      if (data && data.length > 0) {
        setSelectedVenueId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading venues:", error);
      toast.error("Failed to load venues");
    } finally {
      setIsLoading(false);
    }
  };

  const loadVenueSettings = async (venueId: string) => {
    try {
      const { data, error } = await supabase
        .from("venue_settings")
        .select("*")
        .eq("venue_id", venueId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setVenueSettings(data);
      } else {
        // Create default settings if none exist
        const { data: newSettings, error: insertError } = await supabase
          .from("venue_settings")
          .insert({ venue_id: venueId })
          .select()
          .single();

        if (insertError) throw insertError;
        setVenueSettings(newSettings);
      }
    } catch (error) {
      console.error("Error loading venue settings:", error);
    }
  };

  const loadDevices = async (venueId: string) => {
    try {
      const { data, error } = await supabase
        .from("venue_devices")
        .select("*")
        .eq("venue_id", venueId)
        .order("device_name");

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error("Error loading devices:", error);
    }
  };

  const subscribeToDevices = (venueId: string) => {
    const channel = supabase
      .channel(`devices-${venueId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "venue_devices",
          filter: `venue_id=eq.${venueId}`,
        },
        () => {
          loadDevices(venueId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const saveAgePolicy = async (newPolicy: string) => {
    if (!selectedVenueId || !venueSettings) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("venue_settings")
        .update({ age_policy: newPolicy, updated_at: new Date().toISOString() })
        .eq("id", venueSettings.id);

      if (error) throw error;

      // Also update the partner_venues table
      await supabase
        .from("partner_venues")
        .update({ age_policy: newPolicy })
        .eq("id", selectedVenueId);

      setVenueSettings({ ...venueSettings, age_policy: newPolicy });
      toast.success("Age policy saved!");
    } catch (error) {
      console.error("Error saving age policy:", error);
      toast.error("Failed to save age policy");
    } finally {
      setIsSaving(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "scanner":
        return <Smartphone className="w-5 h-5" />;
      case "manager":
        return <Monitor className="w-5 h-5" />;
      case "pos":
        return <Monitor className="w-5 h-5" />;
      default:
        return <Smartphone className="w-5 h-5" />;
    }
  };

  const selectedVenue = venues.find(v => v.id === selectedVenueId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manager Admin | Valid™</title>
        <meta name="description" content="Venue manager administration for GHOST Pass™" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Manager Admin</h1>
                <p className="text-sm text-muted-foreground">Venue setup and oversight</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/manager-quickstart")}>
                <HelpCircle className="w-4 h-4 mr-2" />
                Quickstart Guide
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Venue Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Venue</label>
            <Select value={selectedVenueId || ""} onValueChange={setSelectedVenueId}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Select a venue" />
              </SelectTrigger>
              <SelectContent>
                {venues.map(venue => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.venue_name} — {venue.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedVenueId && (
            <Tabs defaultValue="settings" className="space-y-6">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="devices">
                  <Wifi className="w-4 h-4 mr-2" />
                  Devices
                </TabsTrigger>
                <TabsTrigger value="scans">
                  <Users className="w-4 h-4 mr-2" />
                  Scan Logs
                </TabsTrigger>
                <TabsTrigger value="manual-checks">
                  <Camera className="w-4 h-4 mr-2" />
                  Manual Checks
                </TabsTrigger>
              </TabsList>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      Venue Settings
                    </CardTitle>
                    <CardDescription>Configure entry policies for {selectedVenue?.venue_name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Age Policy */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Age Policy</label>
                      <div className="flex gap-2">
                        <Button
                          variant={venueSettings?.age_policy === "18+" ? "default" : "outline"}
                          onClick={() => saveAgePolicy("18+")}
                          disabled={isSaving}
                        >
                          18+
                        </Button>
                        <Button
                          variant={venueSettings?.age_policy === "21+" ? "default" : "outline"}
                          onClick={() => saveAgePolicy("21+")}
                          disabled={isSaving}
                        >
                          21+
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Members under this age will be denied entry automatically.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Scan Outcomes Reference */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scan Outcomes Reference</CardTitle>
                    <CardDescription>What each scan result means</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <span className="font-bold text-green-500">✅ Allow</span>
                        <span className="text-muted-foreground ml-2">— Approved entry</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-500" />
                      <div>
                        <span className="font-bold text-red-500">⛔ Deny</span>
                        <span className="text-muted-foreground ml-2">— Do not enter (expired/revoked/underage)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-yellow-500" />
                      <div>
                        <span className="font-bold text-yellow-500">🟨 Manual Check</span>
                        <span className="text-muted-foreground ml-2">— Requires manager-grade accountability</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Devices Tab */}
              <TabsContent value="devices" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Wifi className="w-5 h-5 text-primary" />
                          Connected Devices
                        </CardTitle>
                        <CardDescription>Door scanners, POS units, and manager devices</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => loadDevices(selectedVenueId!)}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {devices.length === 0 ? (
                      <div className="text-center py-8">
                        <WifiOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No devices registered yet.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Devices will appear here once they're paired to this venue.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {devices.map(device => (
                          <div
                            key={device.id}
                            className={`flex items-center justify-between p-4 rounded-lg border ${
                              device.is_online ? "border-green-500/30 bg-green-500/5" : "border-border"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {getDeviceIcon(device.device_type)}
                              <div>
                                <p className="font-medium">{device.device_name}</p>
                                <p className="text-sm text-muted-foreground capitalize">{device.device_type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {device.is_online ? (
                                <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                                  Online
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  <WifiOff className="w-3 h-3 mr-1" />
                                  Offline
                                </Badge>
                              )}
                              {device.last_seen_at && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(device.last_seen_at).toLocaleTimeString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Scan Logs Tab */}
              <TabsContent value="scans">
                <ScanLogTable venueId={selectedVenueId} />
              </TabsContent>

              {/* Manual Checks Tab */}
              <TabsContent value="manual-checks">
                <ManualCheckEvidence venueId={selectedVenueId} />
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </>
  );
};

export default ManagerAdmin;
