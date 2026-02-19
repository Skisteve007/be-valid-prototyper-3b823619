import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, QrCode, Clock, User, Trash2, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Venue {
  id: string;
  venue_name: string;
  city: string;
}

interface StaffShift {
  id: string;
  venue_id: string;
  staff_user_id: string;
  staff_name: string;
  staff_role: string;
  shift_start: string;
  shift_end: string | null;
  qr_token: string | null;
  qr_token_expires_at: string | null;
  is_active: boolean;
  partner_venues?: {
    venue_name: string;
  };
}

const StaffShiftManager = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [shifts, setShifts] = useState<StaffShift[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedShiftQR, setSelectedShiftQR] = useState<StaffShift | null>(null);
  
  // Form state
  const [newShift, setNewShift] = useState({
    staff_name: '',
    staff_role: 'bartender',
    shift_start: '',
    shift_end: '',
  });

  useEffect(() => {
    fetchVenues();
    fetchShifts();
  }, []);

  const fetchVenues = async () => {
    const { data, error } = await supabase
      .from('partner_venues')
      .select('id, venue_name, city')
      .order('venue_name');

    if (error) {
      console.error('Error fetching venues:', error);
    } else {
      setVenues(data || []);
    }
  };

  const fetchShifts = async () => {
    const { data, error } = await supabase
      .from('staff_shifts')
      .select(`
        *,
        partner_venues (venue_name)
      `)
      .order('shift_start', { ascending: false });

    if (error) {
      console.error('Error fetching shifts:', error);
    } else {
      setShifts(data || []);
    }
    setLoading(false);
  };

  const generateQRToken = () => {
    // Generate a cryptographically secure token
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = crypto.getRandomValues(new Uint8Array(16));
    return 'STAFF_' + Array.from(randomBytes, (byte) => chars[byte % chars.length]).join('');
  };

  const handleAddShift = async () => {
    if (!selectedVenue || !newShift.staff_name || !newShift.shift_start) {
      toast.error('Please fill in all required fields');
      return;
    }

    const qrToken = generateQRToken();
    const shiftEnd = newShift.shift_end || null;
    const tokenExpiry = shiftEnd ? new Date(shiftEnd).toISOString() : new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('staff_shifts')
      .insert({
        venue_id: selectedVenue,
        staff_user_id: crypto.randomUUID(), // Placeholder - in production, link to actual user
        staff_name: newShift.staff_name,
        staff_role: newShift.staff_role,
        shift_start: new Date(newShift.shift_start).toISOString(),
        shift_end: shiftEnd ? new Date(shiftEnd).toISOString() : null,
        qr_token: qrToken,
        qr_token_expires_at: tokenExpiry,
        is_active: true,
      });

    if (error) {
      console.error('Error adding shift:', error);
      toast.error('Failed to add shift');
    } else {
      toast.success('Staff shift added successfully');
      setIsAddDialogOpen(false);
      setNewShift({ staff_name: '', staff_role: 'bartender', shift_start: '', shift_end: '' });
      fetchShifts();
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    const { error } = await supabase
      .from('staff_shifts')
      .delete()
      .eq('id', shiftId);

    if (error) {
      console.error('Error deleting shift:', error);
      toast.error('Failed to delete shift');
    } else {
      toast.success('Shift deleted');
      fetchShifts();
    }
  };

  const copyQRToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success('QR Token copied to clipboard');
  };

  const filteredShifts = selectedVenue && selectedVenue !== 'all'
    ? shifts.filter(s => s.venue_id === selectedVenue)
    : shifts;

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Staff & Shift Management
        </CardTitle>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Shift
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Staff Shift</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Venue *</label>
                <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue..." />
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
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Staff Name *</label>
                <Input
                  value={newShift.staff_name}
                  onChange={(e) => setNewShift(prev => ({ ...prev, staff_name: e.target.value }))}
                  placeholder="Enter staff name"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Role</label>
                <Select 
                  value={newShift.staff_role} 
                  onValueChange={(value) => setNewShift(prev => ({ ...prev, staff_role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bartender">Bartender</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="door">Door Staff</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="vip_host">VIP Host</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Shift Start *</label>
                  <Input
                    type="datetime-local"
                    value={newShift.shift_start}
                    onChange={(e) => setNewShift(prev => ({ ...prev, shift_start: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Shift End</label>
                  <Input
                    type="datetime-local"
                    value={newShift.shift_end}
                    onChange={(e) => setNewShift(prev => ({ ...prev, shift_end: e.target.value }))}
                  />
                </div>
              </div>
              
              <Button onClick={handleAddShift} className="w-full">
                Create Shift & Generate QR
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {/* Venue Filter */}
        <div className="mb-4">
          <Select value={selectedVenue} onValueChange={setSelectedVenue}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Filter by venue..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Venues</SelectItem>
              {venues.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  {venue.venue_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Shifts Table */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading shifts...</div>
        ) : filteredShifts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No shifts found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>QR</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShifts.map((shift) => {
                  const isExpired = shift.qr_token_expires_at && new Date(shift.qr_token_expires_at) < new Date();
                  
                  return (
                    <TableRow key={shift.id}>
                      <TableCell className="font-medium">{shift.staff_name}</TableCell>
                      <TableCell className="capitalize">{shift.staff_role}</TableCell>
                      <TableCell>{shift.partner_venues?.venue_name || '-'}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {formatDateTime(shift.shift_start)}
                          {shift.shift_end && ` - ${formatDateTime(shift.shift_end)}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isExpired 
                            ? 'bg-red-500/20 text-red-400' 
                            : shift.is_active 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {isExpired ? 'Expired' : shift.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <QrCode className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm">
                              <DialogHeader>
                                <DialogTitle className="text-center">{shift.staff_name}'s QR Code</DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col items-center gap-4 py-4">
                                <div className="bg-white p-4 rounded-lg">
                                  <QRCodeSVG
                                    value={JSON.stringify({
                                      type: 'STAFF_TOKEN',
                                      token: shift.qr_token,
                                      staffId: shift.staff_user_id,
                                      shiftId: shift.id,
                                      venueId: shift.venue_id,
                                      role: shift.staff_role,
                                    })}
                                    size={200}
                                    level="H"
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                  Valid until: {shift.qr_token_expires_at ? formatDateTime(shift.qr_token_expires_at) : 'N/A'}
                                </p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => shift.qr_token && copyQRToken(shift.qr_token)}
                                  className="gap-2"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy Token
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteShift(shift.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffShiftManager;