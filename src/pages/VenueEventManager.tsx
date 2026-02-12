import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, QrCode, Building2 } from 'lucide-react';
import { EventManagement } from '@/components/venue/EventManagement';
import { QRCodeGenerator } from '@/components/venue/QRCodeGenerator';
import { VenueManagement } from '@/components/venue/VenueManagement';
import { VenueOperatorGate } from '@/components/VenueOperatorGate';
import ResponsiveHeader from '@/components/ResponsiveHeader';

const VenueEventManager = () => {
  const [activeTab, setActiveTab] = useState('venues');

  return (
    <VenueOperatorGate>
      <Helmet>
        <title>Event Manager | VALID</title>
        <meta name="description" content="Manage events and generate QR codes for venue access control" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <ResponsiveHeader />

        <main className="container mx-auto px-4 py-8 mt-20">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Event Manager</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Create events, manage tickets, and generate QR codes for access control
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="venues" className="gap-2 py-3">
                <Building2 className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Venues</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2 py-3">
                <Calendar className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Events</span>
              </TabsTrigger>
              <TabsTrigger value="qr-codes" className="gap-2 py-3">
                <QrCode className="h-4 w-4" />
                <span className="text-xs sm:text-sm">QR Codes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="venues" className="mt-6">
              <VenueManagement />
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <EventManagement />
            </TabsContent>

            <TabsContent value="qr-codes" className="mt-6">
              <QRCodeGenerator />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </VenueOperatorGate>
  );
};

export default VenueEventManager;
