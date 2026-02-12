import { useState, useEffect, useRef } from 'react';
import { ghostPassSupabase } from '@/integrations/supabase/ghostpass-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { QrCode, Download, Printer, Copy, Plus, Loader2, Eye } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';

interface Event {
  id: string;
  name: string;
  venue_name: string;
}

interface QRCodeData {
  id: string;
  event_id: string;
  type: 'entry' | 'vip' | 'staff' | 'vendor';
  code: string;
  scan_count: number;
  created_at: string;
}

const QR_CODE_TYPES = [
  { value: 'entry', label: 'General Entry', color: '#3b82f6' },
  { value: 'vip', label: 'VIP Entry', color: '#f59e0b' },
  { value: 'staff', label: 'Staff Entry', color: '#10b981' },
  { value: 'vendor', label: 'Vendor Access', color: '#8b5cf6' },
];

export const QRCodeGenerator = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedType, setSelectedType] = useState<'entry' | 'vip' | 'staff' | 'vendor'>('entry');
  const [quantity, setQuantity] = useState(1);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (previewCode && qrRef.current) {
      const typeConfig = QR_CODE_TYPES.find(t => t.value === selectedType);
      
      if (!qrCodeInstance.current) {
        qrCodeInstance.current = new QRCodeStyling({
          width: 300,
          height: 300,
          data: previewCode,
          dotsOptions: {
            color: typeConfig?.color || '#000000',
            type: 'rounded',
          },
          backgroundOptions: {
            color: '#ffffff',
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 10,
          },
        });
        qrCodeInstance.current.append(qrRef.current);
      } else {
        qrCodeInstance.current.update({
          data: previewCode,
          dotsOptions: {
            color: typeConfig?.color || '#000000',
            type: 'rounded',
          },
        });
      }
    }
  }, [previewCode, selectedType]);

  const loadData = async () => {
    try {
      // Load events
      const { data: eventsData, error: eventsError } = await ghostPassSupabase
        .from('events')
        .select('id, name, venue_name')
        .eq('status', 'active')
        .order('start_date', { ascending: true });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // Load existing QR codes (from a hypothetical qr_codes table)
      // For now, we'll create this table structure
      const { data: qrData, error: qrError } = await ghostPassSupabase
        .from('qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!qrError && qrData) {
        setQrCodes(qrData);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    if (!selectedEvent) {
      toast.error('Please select an event');
      return;
    }

    setGenerating(true);

    try {
      const codes: QRCodeData[] = [];
      
      for (let i = 0; i < quantity; i++) {
        // Generate a UUID v4 format that the scanner expects
        const uuid = crypto.randomUUID();
        
        // Format: ghostpass:uuid (scanner will extract the UUID)
        const code = `ghostpass:${uuid}`;
        
        const qrData = {
          id: `qr_${Date.now()}_${i}`,
          event_id: selectedEvent,
          type: selectedType,
          code: code,
          scan_count: 0,
          created_at: new Date().toISOString(),
        };

        // Insert into database
        const { error } = await ghostPassSupabase
          .from('qr_codes')
          .insert([qrData]);

        if (error) throw error;
        codes.push(qrData);
      }

      toast.success(`Generated ${quantity} QR code${quantity > 1 ? 's' : ''} successfully`);
      setDialogOpen(false);
      loadData();
    } catch (error: any) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setGenerating(false);
    }
  };

  const downloadQRCode = async (code: string, type: string, format: 'png' | 'svg' = 'png') => {
    const typeConfig = QR_CODE_TYPES.find(t => t.value === type);
    
    const qrCode = new QRCodeStyling({
      width: 1000,
      height: 1000,
      data: code,
      dotsOptions: {
        color: typeConfig?.color || '#000000',
        type: 'rounded',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
    });

    qrCode.download({
      name: `qr_${type}_${code.slice(-8)}`,
      extension: format,
    });

    toast.success(`QR code downloaded as ${format.toUpperCase()}`);
  };

  const downloadBatch = async (eventId: string) => {
    const eventCodes = qrCodes.filter(qr => qr.event_id === eventId);
    
    if (eventCodes.length === 0) {
      toast.error('No QR codes found for this event');
      return;
    }

    toast.info(`Downloading ${eventCodes.length} QR codes...`);
    
    for (const qr of eventCodes) {
      await downloadQRCode(qr.code, qr.type);
      // Small delay to prevent browser blocking
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    toast.success('Batch download complete');
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const getTypeColor = (type: string) => {
    const config = QR_CODE_TYPES.find(t => t.value === type);
    return config?.color || '#000000';
  };

  const getTypeLabel = (type: string) => {
    const config = QR_CODE_TYPES.find(t => t.value === type);
    return config?.label || type;
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
          <h2 className="text-2xl sm:text-3xl font-bold">QR Code Generator</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Generate and manage QR codes for event access</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Generate QR Codes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">Generate QR Codes</DialogTitle>
              <DialogDescription className="text-sm">
                Create QR codes for event entry, VIP access, staff, or vendors
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="event" className="text-sm">Select Event *</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name} - {event.venue_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm">QR Code Type *</Label>
                <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                  <SelectTrigger className="text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QR_CODE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Generate multiple QR codes at once (max 100)
                </p>
              </div>

              {/* Preview */}
              {selectedEvent && (
                <div className="space-y-2">
                  <Label className="text-sm">Preview</Label>
                  <div className="flex justify-center p-4 bg-muted rounded-lg">
                    <div ref={qrRef} className="max-w-full" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setPreviewCode(`ghostpass:${crypto.randomUUID()}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Generate Preview
                  </Button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1 order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={generateQRCode}
                  disabled={generating || !selectedEvent}
                  className="flex-1 order-1 sm:order-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>Generate {quantity} QR Code{quantity > 1 ? 's' : ''}</>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* QR Codes by Event */}
      <div className="space-y-4">
        {events.map((event) => {
          const eventQRs = qrCodes.filter(qr => qr.event_id === event.id);
          
          if (eventQRs.length === 0) return null;

          return (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">{event.name}</CardTitle>
                    <CardDescription className="text-sm">{event.venue_name}</CardDescription>
                  </div>
                  <div className="flex gap-2 self-end sm:self-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadBatch(event.id)}
                      className="text-xs sm:text-sm"
                    >
                      <Download className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Download All</span>
                      <span className="sm:hidden">All</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {eventQRs.map((qr) => (
                    <div
                      key={qr.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <QrCode
                          className="h-8 w-8 flex-shrink-0"
                          style={{ color: getTypeColor(qr.type) }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{getTypeLabel(qr.type)}</p>
                            <Badge variant="outline" className="text-xs">{qr.scan_count} scans</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono truncate">
                            {qr.code}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(qr.code)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadQRCode(qr.code, qr.type, 'png')}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadQRCode(qr.code, qr.type, 'svg')}
                          className="h-8 px-2 text-xs"
                        >
                          SVG
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {qrCodes.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No QR codes generated yet. Create your first QR code to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
