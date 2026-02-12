import { useState, useEffect } from 'react';
import { ghostPassSupabase } from '@/integrations/supabase/ghostpass-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, Plus, Edit, Trash2, QrCode, Clock, MapPin, Users, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  name: string;
  description: string | null;
  venue_id: string;
  venue_name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'cancelled' | 'completed';
  service_fee_percent: number;
  requires_pass: boolean;
  mode: 'mode_a' | 'mode_b';
  ticket_pricing_enabled: boolean;
  pass_pricing_1day: number | null;
  pass_pricing_3day: number | null;
  pass_pricing_7day: number | null;
  pass_pricing_custom: number | null;
  pass_pricing_custom_days: number | null;
  reentry_allowed: boolean;
  reentry_fee_venue: number | null;
  reentry_fee_valid: number | null;
  entry_fee: number | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  max_quantity: number;
  sold_count: number;
  allows_reentry: boolean;
  metadata: any;
}

export const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue_id: '',
    venue_name: '',
    start_date: '',
    end_date: '',
    service_fee_percent: 5.0,
    status: 'active' as 'active' | 'cancelled' | 'completed',
    requires_pass: false,
    mode: 'mode_a' as 'mode_a' | 'mode_b',
    ticket_pricing_enabled: true,
    pass_pricing_1day: null as number | null,
    pass_pricing_3day: null as number | null,
    pass_pricing_7day: null as number | null,
    pass_pricing_custom: null as number | null,
    pass_pricing_custom_days: null as number | null,
    reentry_allowed: false,
    reentry_fee_venue: null as number | null,
    reentry_fee_valid: null as number | null,
    entry_fee: null as number | null,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await ghostPassSupabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const eventData = {
        ...formData,
        id: editingEvent?.id || `event_${Date.now()}`,
        updated_at: new Date().toISOString(),
      };

      if (editingEvent) {
        // Update existing event
        const { error } = await ghostPassSupabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast.success('Event updated successfully');
      } else {
        // Create new event
        const { error } = await ghostPassSupabase
          .from('events')
          .insert([{ ...eventData, created_at: new Date().toISOString() }]);

        if (error) throw error;
        toast.success('Event created successfully');
      }

      setDialogOpen(false);
      resetForm();
      loadEvents();
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(error.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description || '',
      venue_id: event.venue_id,
      venue_name: event.venue_name,
      start_date: event.start_date.split('T')[0],
      end_date: event.end_date.split('T')[0],
      service_fee_percent: event.service_fee_percent,
      status: event.status,
      requires_pass: event.requires_pass,
      mode: event.mode,
      ticket_pricing_enabled: event.ticket_pricing_enabled,
      pass_pricing_1day: event.pass_pricing_1day,
      pass_pricing_3day: event.pass_pricing_3day,
      pass_pricing_7day: event.pass_pricing_7day,
      pass_pricing_custom: event.pass_pricing_custom,
      pass_pricing_custom_days: event.pass_pricing_custom_days,
      reentry_allowed: event.reentry_allowed,
      reentry_fee_venue: event.reentry_fee_venue,
      reentry_fee_valid: event.reentry_fee_valid,
      entry_fee: event.entry_fee,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all associated tickets.')) {
      return;
    }

    try {
      const { error } = await ghostPassSupabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      toast.success('Event deleted successfully');
      loadEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      description: '',
      venue_id: '',
      venue_name: '',
      start_date: '',
      end_date: '',
      service_fee_percent: 5.0,
      status: 'active',
      requires_pass: false,
      mode: 'mode_a',
      ticket_pricing_enabled: true,
      pass_pricing_1day: null,
      pass_pricing_3day: null,
      pass_pricing_7day: null,
      pass_pricing_custom: null,
      pass_pricing_custom_days: null,
      reentry_allowed: false,
      reentry_fee_venue: null,
      reentry_fee_valid: null,
      entry_fee: null,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
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
          <h2 className="text-2xl sm:text-3xl font-bold">Event Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Create and manage events for your venue</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
              <DialogDescription className="text-sm">
                Configure your event details, pricing, and access settings
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Event Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Summer Music Festival"
                    required
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your event..."
                    rows={3}
                    className="text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="venue_id" className="text-sm">Venue ID *</Label>
                    <Input
                      id="venue_id"
                      value={formData.venue_id}
                      onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
                      placeholder="venue_001"
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue_name" className="text-sm">Venue Name *</Label>
                    <Input
                      id="venue_name"
                      value={formData.venue_name}
                      onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                      placeholder="Central Park"
                      required
                      className="text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Event Dates</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-sm">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-sm">End Date *</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                      className="text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Fees */}
              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Pricing & Fees</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="service_fee" className="text-sm">VALID Service Fee (%) *</Label>
                  <Input
                    id="service_fee"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.service_fee_percent}
                    onChange={(e) => setFormData({ ...formData, service_fee_percent: parseFloat(e.target.value) })}
                    required
                    className="text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Percentage fee charged by VALID on each ticket sale
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entry_fee" className="text-sm">Entry Fee ($)</Label>
                  <Input
                    id="entry_fee"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.entry_fee ? (formData.entry_fee / 100).toFixed(2) : ''}
                    onChange={(e) => setFormData({ ...formData, entry_fee: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null })}
                    placeholder="10.00"
                    className="text-base"
                  />

                </div>
              </div>

              {/* Access Mode */}
              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Access Configuration</h3>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="requires_pass" className="text-sm font-medium">Requires Pass</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable if event requires a Ghost Pass
                    </p>
                  </div>
                  <Switch
                    id="requires_pass"
                    checked={formData.requires_pass}
                    onCheckedChange={(checked) => setFormData({ ...formData, requires_pass: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mode" className="text-sm">Access Mode</Label>
                  <Select
                    value={formData.mode}
                    onValueChange={(value: any) => setFormData({ ...formData, mode: value })}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mode_a">Mode A - Single Entry</SelectItem>
                      <SelectItem value="mode_b">Mode B - Duration Based</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Mode A: One-time entry | Mode B: Time-based access
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="ticket_pricing" className="text-sm font-medium">Enable Ticket Pricing</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow ticket purchases for this event
                    </p>
                  </div>
                  <Switch
                    id="ticket_pricing"
                    checked={formData.ticket_pricing_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, ticket_pricing_enabled: checked })}
                  />
                </div>
              </div>

              {/* Pass Pricing */}
              {formData.requires_pass && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-base sm:text-lg">Pass Pricing Options</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pass_1day" className="text-sm">1-Day Pass ($)</Label>
                      <Input
                        id="pass_1day"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.pass_pricing_1day ? (formData.pass_pricing_1day / 100).toFixed(2) : ''}
                        onChange={(e) => setFormData({ ...formData, pass_pricing_1day: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null })}
                        placeholder="25.00"
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pass_3day" className="text-sm">3-Day Pass ($)</Label>
                      <Input
                        id="pass_3day"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.pass_pricing_3day ? (formData.pass_pricing_3day / 100).toFixed(2) : ''}
                        onChange={(e) => setFormData({ ...formData, pass_pricing_3day: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null })}
                        placeholder="60.00"
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pass_7day" className="text-sm">7-Day Pass ($)</Label>
                      <Input
                        id="pass_7day"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.pass_pricing_7day ? (formData.pass_pricing_7day / 100).toFixed(2) : ''}
                        onChange={(e) => setFormData({ ...formData, pass_pricing_7day: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null })}
                        placeholder="120.00"
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pass_custom" className="text-sm">Custom Pass ($)</Label>
                      <Input
                        id="pass_custom"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.pass_pricing_custom ? (formData.pass_pricing_custom / 100).toFixed(2) : ''}
                        onChange={(e) => setFormData({ ...formData, pass_pricing_custom: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null })}
                        placeholder="150.00"
                        className="text-base"
                      />
                    </div>
                  </div>

                  {formData.pass_pricing_custom && (
                    <div className="space-y-2">
                      <Label htmlFor="custom_days" className="text-sm">Custom Pass Duration (days)</Label>
                      <Input
                        id="custom_days"
                        type="number"
                        min="1"
                        value={formData.pass_pricing_custom_days || ''}
                        onChange={(e) => setFormData({ ...formData, pass_pricing_custom_days: e.target.value ? parseInt(e.target.value) : null })}
                        placeholder="14"
                        className="text-base"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Re-entry Configuration */}
              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Re-entry Settings</h3>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="reentry_allowed" className="text-sm font-medium">Allow Re-entry</Label>
                    <p className="text-xs text-muted-foreground">
                      Permit attendees to exit and re-enter
                    </p>
                  </div>
                  <Switch
                    id="reentry_allowed"
                    checked={formData.reentry_allowed}
                    onCheckedChange={(checked) => setFormData({ ...formData, reentry_allowed: checked })}
                  />
                </div>

                {formData.reentry_allowed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reentry_venue" className="text-sm">Venue Re-entry Fee ($)</Label>
                      <Input
                        id="reentry_venue"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.reentry_fee_venue ? (formData.reentry_fee_venue / 100).toFixed(2) : ''}
                        onChange={(e) => setFormData({ ...formData, reentry_fee_venue: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null })}
                        placeholder="5.00"
                        className="text-base"
                      />
                      <p className="text-xs text-muted-foreground">
                        Fee charged by venue for re-entry
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reentry_valid" className="text-sm">VALID Re-entry Fee ($)</Label>
                      <Input
                        id="reentry_valid"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.reentry_fee_valid ? (formData.reentry_fee_valid / 100).toFixed(2) : ''}
                        onChange={(e) => setFormData({ ...formData, reentry_fee_valid: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null })}
                        placeholder="1.00"
                        className="text-base"
                      />
                      <p className="text-xs text-muted-foreground">
                        VALID service fee for re-entry
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Event Status</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <>{editingEvent ? 'Update Event' : 'Create Event'}</>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No events yet. Create your first event to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CardTitle className="text-lg sm:text-xl">{event.name}</CardTitle>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{event.description}</CardDescription>
                  </div>
                  <div className="flex gap-2 self-end sm:self-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(event)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{event.venue_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{event.venue_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium">{format(new Date(event.start_date), 'MMM d, yyyy')}</p>
                      <p className="text-xs text-muted-foreground">to {format(new Date(event.end_date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">ID: {event.id}</p>
                      <p className="text-xs text-muted-foreground">Event ID</p>
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
