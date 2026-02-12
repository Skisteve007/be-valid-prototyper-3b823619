import { useState, useEffect } from 'react';
import { ghostPassSupabase } from '@/integrations/supabase/ghostpass-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapPin, Plus, Edit, Trash2, Users, Building2, Loader2, DoorOpen } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  address: string | null;
  venue_type: string;
  capacity: number | null;
  gateway_count: number;
  default_service_fee: number;
  default_entry_fee: number | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

const VENUE_TYPES = [
  'club',
  'festival',
  'arena',
  'stadium',
  'theater',
  'conference',
  'bar',
  'restaurant',
  'other',
];

export const VenueManagement = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    venue_type: 'club',
    capacity: null as number | null,
    gateway_count: 1,
    default_service_fee: 5.0,
    default_entry_fee: null as number | null,
  });

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const { data, error } = await ghostPassSupabase
        .from('venues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVenues(data || []);
    } catch (error: any) {
      console.error('Error loading venues:', error);
      toast.error('Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const venueData = {
        ...formData,
        id: editingVenue?.id || `venue_${Date.now()}`,
        updated_at: new Date().toISOString(),
      };

      if (editingVenue) {
        const { error } = await ghostPassSupabase
          .from('venues')
          .update(venueData)
          .eq('id', editingVenue.id);

        if (error) throw error;
        toast.success('Venue updated successfully');
      } else {
        const { error } = await ghostPassSupabase
          .from('venues')
          .insert([{ ...venueData, created_at: new Date().toISOString() }]);

        if (error) throw error;
        toast.success('Venue created successfully');
      }

      setDialogOpen(false);
      resetForm();
      loadVenues();
    } catch (error: any) {
      console.error('Error saving venue:', error);
      toast.error(error.message || 'Failed to save venue');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      address: venue.address || '',
      venue_type: venue.venue_type,
      capacity: venue.capacity,
      gateway_count: venue.gateway_count,
      default_service_fee: venue.default_service_fee,
      default_entry_fee: venue.default_entry_fee,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (venueId: string) => {
    if (!confirm('Are you sure you want to delete this venue? This will affect all associated events.')) {
      return;
    }

    try {
      const { error } = await ghostPassSupabase
        .from('venues')
        .delete()
        .eq('id', venueId);

      if (error) throw error;
      toast.success('Venue deleted successfully');
      loadVenues();
    } catch (error: any) {
      console.error('Error deleting venue:', error);
      toast.error('Failed to delete venue');
    }
  };

  const resetForm = () => {
    setEditingVenue(null);
    setFormData({
      name: '',
      address: '',
      venue_type: 'club',
      capacity: null,
      gateway_count: 1,
      default_service_fee: 5.0,
      default_entry_fee: null,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Venue Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Configure venues and their default settings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Venue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">{editingVenue ? 'Edit Venue' : 'Add New Venue'}</DialogTitle>
              <DialogDescription className="text-sm">
                Configure venue details and default fee structure
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Venue Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="The Grand Arena"
                    required
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, City, State 12345"
                    rows={2}
                    className="text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="venue_type" className="text-sm">Venue Type *</Label>
                    <Select
                      value={formData.venue_type}
                      onValueChange={(value) => setFormData({ ...formData, venue_type: value })}
                    >
                      <SelectTrigger className="text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENUE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="text-sm">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity || ''}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="500"
                      className="text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Entry Points</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="gateway_count" className="text-sm">Number of Gateways/Entry Points *</Label>
                  <Input
                    id="gateway_count"
                    type="number"
                    min="1"
                    value={formData.gateway_count}
                    onChange={(e) => setFormData({ ...formData, gateway_count: parseInt(e.target.value) || 1 })}
                    required
                    className="text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of scanning stations/entry points
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Default Fee Structure</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default_service_fee" className="text-sm">Default Service Fee (%) *</Label>
                    <Input
                      id="default_service_fee"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.default_service_fee}
                      onChange={(e) => setFormData({ ...formData, default_service_fee: parseFloat(e.target.value) })}
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default_entry_fee" className="text-sm">Default Entry Fee ($)</Label>
                    <Input
                      id="default_entry_fee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.default_entry_fee ? (formData.default_entry_fee / 100).toFixed(2) : ''}
                      onChange={(e) => setFormData({ ...formData, default_entry_fee: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null })}
                      placeholder="10.00"
                      className="text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1 order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex-1 order-1 sm:order-2">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingVenue ? 'Update Venue' : 'Add Venue'}</>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {venues.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No venues yet. Add your first venue to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          venues.map((venue) => (
            <Card key={venue.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CardTitle className="text-lg sm:text-xl">{venue.name}</CardTitle>
                      <Badge variant="outline">
                        {venue.venue_type.charAt(0).toUpperCase() + venue.venue_type.slice(1)}
                      </Badge>
                    </div>
                    {venue.address && (
                      <CardDescription className="text-sm">{venue.address}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2 self-end sm:self-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(venue)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(venue.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  {venue.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium">{venue.capacity.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Capacity</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <DoorOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">{venue.gateway_count} Gateway{venue.gateway_count !== 1 ? 's' : ''}</p>
                      <p className="text-xs text-muted-foreground">Entry Points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">{venue.default_service_fee}%</p>
                      <p className="text-xs text-muted-foreground">Service Fee</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium truncate">ID: {venue.id}</p>
                      <p className="text-xs text-muted-foreground">Venue ID</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
