import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, UserPlus, Trash2, Building2, Users, Key } from "lucide-react";
import { format } from "date-fns";

interface Venue {
  id: string;
  venue_name: string;
  city: string;
}

interface Operator {
  id: string;
  user_id: string;
  venue_id: string;
  access_level: string;
  created_at: string;
  user_email?: string;
  partner_venues: {
    venue_name: string;
    city: string;
  };
}

export const VenueOperatorsManager = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newOperator, setNewOperator] = useState({
    email: "",
    venue_id: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load venues
      const { data: venueData, error: venueError } = await supabase
        .from("partner_venues")
        .select("id, venue_name, city")
        .order("venue_name");

      if (venueError) throw venueError;
      setVenues(venueData || []);

      // Load operators with venue info
      const { data: operatorData, error: operatorError } = await supabase
        .from("venue_operators")
        .select(`
          id,
          user_id,
          venue_id,
          access_level,
          created_at,
          partner_venues (
            venue_name,
            city
          )
        `)
        .order("created_at", { ascending: false });

      if (operatorError) throw operatorError;
      setOperators(operatorData as unknown as Operator[] || []);
    } catch (error: any) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // First, find or create user by email
      // For now, we'll need to look up the user by their profile email
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", newOperator.email.toLowerCase())
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData) {
        toast.error("No user found with that email. The user must sign up first.");
        setSaving(false);
        return;
      }

      // Check if already an operator for this venue
      const { data: existing } = await supabase
        .from("venue_operators")
        .select("id")
        .eq("user_id", profileData.user_id)
        .eq("venue_id", newOperator.venue_id)
        .maybeSingle();

      if (existing) {
        toast.error("This user is already an operator for this venue");
        setSaving(false);
        return;
      }

      // Add as operator
      const { error } = await supabase
        .from("venue_operators")
        .insert({
          user_id: profileData.user_id,
          venue_id: newOperator.venue_id,
          access_level: "operator",
        });

      if (error) throw error;

      toast.success("Venue operator added successfully");
      setDialogOpen(false);
      setNewOperator({ email: "", venue_id: "" });
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add operator");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveOperator = async (operatorId: string) => {
    if (!confirm("Remove this operator's access to the venue?")) return;

    try {
      const { error } = await supabase
        .from("venue_operators")
        .delete()
        .eq("id", operatorId);

      if (error) throw error;

      toast.success("Operator removed");
      loadData();
    } catch (error: any) {
      toast.error("Failed to remove operator");
      console.error(error);
    }
  };

  const copyPortalLink = () => {
    const link = `${window.location.origin}/venue-portal`;
    navigator.clipboard.writeText(link);
    toast.success("Portal link copied to clipboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Venue Operator Access
            </CardTitle>
            <CardDescription>
              Assign users as venue operators. They can only view their assigned venue's scan data.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyPortalLink}>
              Copy Portal Link
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Operator
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Venue Operator</DialogTitle>
                  <DialogDescription>
                    Grant a user operator access to a specific venue. They must have a Clean Check account first.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddOperator} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">User Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="operator@venue.com"
                      value={newOperator.email}
                      onChange={(e) => setNewOperator({ ...newOperator, email: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      The user must have signed up for Clean Check first
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">Assign to Venue *</Label>
                    <Select
                      value={newOperator.venue_id}
                      onValueChange={(value) => setNewOperator({ ...newOperator, venue_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a venue" />
                      </SelectTrigger>
                      <SelectContent>
                        {venues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.venue_name} - {venue.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Add Operator
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {operators.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No venue operators assigned yet</p>
            <p className="text-sm">Add operators to give venues their own portal access</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operators.map((operator) => (
                  <TableRow key={operator.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{operator.partner_venues.venue_name}</p>
                          <p className="text-sm text-muted-foreground">{operator.partner_venues.city}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{operator.access_level}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(operator.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOperator(operator.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VenueOperatorsManager;