import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, QrCode, Users, Calendar, Building2, LogOut, Scan } from "lucide-react";
import { format } from "date-fns";
import logo from "@/assets/valid-logo.jpeg";
import { ScannerFullscreen } from "@/components/admin/ScannerFullscreen";
import { VenueBossDashboard } from "@/components/admin/VenueBossDashboard";

interface VenueAssignment {
  id: string;
  venue_id: string;
  access_level: string;
  partner_venues: {
    id: string;
    venue_name: string;
    city: string;
    category: string;
  };
}

interface VenueScan {
  id: string;
  scanned_member_id: string | null;
  scan_result: string | null;
  scanned_at: string;
  notes: string | null;
  profiles?: {
    full_name: string | null;
    status_color: string | null;
  } | null;
}

const VenueOperatorPortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [venueAssignments, setVenueAssignments] = useState<VenueAssignment[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueAssignment | null>(null);
  const [scans, setScans] = useState<VenueScan[]>([]);
  const [scansLoading, setScansLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [stats, setStats] = useState({ today: 0, thisWeek: 0, total: 0 });

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    if (selectedVenue) {
      loadVenueScans(selectedVenue.venue_id);
    }
  }, [selectedVenue]);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth?mode=login");
        return;
      }

      setUser(user);

      // Check if user is a venue operator
      const { data: assignments, error } = await supabase
        .from("venue_operators")
        .select(`
          id,
          venue_id,
          access_level,
          partner_venues (
            id,
            venue_name,
            city,
            category
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      if (!assignments || assignments.length === 0) {
        toast.error("You don't have access to any venues");
        navigate("/dashboard");
        return;
      }

      setVenueAssignments(assignments as unknown as VenueAssignment[]);
      
      // Auto-select first venue if only one
      if (assignments.length === 1) {
        setSelectedVenue(assignments[0] as unknown as VenueAssignment);
      }
    } catch (error: any) {
      console.error("Access check error:", error);
      toast.error("Failed to verify access");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadVenueScans = async (venueId: string) => {
    setScansLoading(true);
    try {
      const { data, error } = await supabase
        .from("venue_qr_scans")
        .select(`
          id,
          scanned_member_id,
          scan_result,
          scanned_at,
          notes,
          scanned_user_id
        `)
        .eq("venue_id", venueId)
        .order("scanned_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      setScans(data || []);

      // Calculate stats
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const today = data?.filter(s => new Date(s.scanned_at) >= todayStart).length || 0;
      const thisWeek = data?.filter(s => new Date(s.scanned_at) >= weekStart).length || 0;

      setStats({ today, thisWeek, total: data?.length || 0 });
    } catch (error: any) {
      toast.error("Failed to load scans");
      console.error(error);
    } finally {
      setScansLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleScanComplete = async (memberId: string, result: string) => {
    if (!selectedVenue) return;

    try {
      const { error } = await supabase
        .from("venue_qr_scans")
        .insert({
          venue_id: selectedVenue.venue_id,
          scanned_member_id: memberId,
          scan_result: result,
          scanned_by_operator_id: user?.id,
        });

      if (error) throw error;

      toast.success("Scan recorded");
      loadVenueScans(selectedVenue.venue_id);
    } catch (error: any) {
      console.error("Failed to record scan:", error);
    }
  };

  const getScanResultBadge = (result: string | null) => {
    switch (result?.toLowerCase()) {
      case 'verified':
      case 'green':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'pending':
      case 'yellow':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'denied':
      case 'red':
        return <Badge className="bg-red-500">Denied</Badge>;
      default:
        return <Badge variant="secondary">{result || 'Unknown'}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-y-auto bg-background"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Scanner Fullscreen */}
      {showScanner && selectedVenue && (
        <ScannerFullscreen 
          onClose={() => setShowScanner(false)} 
        />
      )}

      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Clean Check" className="h-10 w-auto" />
            <div className="hidden md:block">
              <h1 className="font-semibold text-lg">Venue Portal</h1>
              <p className="text-sm text-muted-foreground">Operator Access</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedVenue && (
              <Button onClick={() => setShowScanner(true)} className="gap-2">
                <Scan className="h-4 w-4" />
                <span className="hidden sm:inline">Scan QR</span>
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Venue Selection */}
        {venueAssignments.length > 1 && !selectedVenue && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your Venue</CardTitle>
              <CardDescription>You have access to multiple venues. Select one to view.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {venueAssignments.map((assignment) => (
                  <Card 
                    key={assignment.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedVenue(assignment)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">{assignment.partner_venues.venue_name}</h3>
                          <p className="text-sm text-muted-foreground">{assignment.partner_venues.city}</p>
                          <Badge variant="outline" className="mt-1">{assignment.partner_venues.category}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Venue Dashboard */}
        {selectedVenue && (
          <>
            {/* Venue Info */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold">{selectedVenue.partner_venues.venue_name}</h2>
                  <p className="text-muted-foreground">{selectedVenue.partner_venues.city} • {selectedVenue.partner_venues.category}</p>
                </div>
              </div>
              {venueAssignments.length > 1 && (
                <Button variant="outline" onClick={() => setSelectedVenue(null)}>
                  Switch Venue
                </Button>
              )}
            </div>

            {/* Venue Boss Dashboard - Financial Overview */}
            <VenueBossDashboard venueId={selectedVenue.venue_id} />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">{stats.today}</p>
                    <p className="text-sm text-muted-foreground">Scans Today</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-500">{stats.thisWeek}</p>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Scans</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scan History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      QR Scan History
                    </CardTitle>
                    <CardDescription>Recent member verifications at your venue</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => loadVenueScans(selectedVenue.venue_id)}>
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {scansLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : scans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No scans recorded yet</p>
                    <p className="text-sm">Use the scanner to verify members</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member ID</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scans.map((scan) => (
                          <TableRow key={scan.id}>
                            <TableCell className="font-mono">
                              {scan.scanned_member_id || '-'}
                            </TableCell>
                            <TableCell>
                              {getScanResultBadge(scan.scan_result)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(scan.scanned_at), 'MMM d, yyyy h:mm a')}
                            </TableCell>
                            <TableCell className="text-sm">
                              {scan.notes || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default VenueOperatorPortal;