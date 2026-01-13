import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Package, FileText } from "lucide-react";
import { CareersTab } from "./CareersTab";
import { HiringPacketTab } from "./HiringPacketTab";
import { LegalTemplatesTab } from "./LegalTemplatesTab";

export const HiringTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Hiring & Legal
        </CardTitle>
        <CardDescription>
          Manage job postings, hiring packets, and legal templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="careers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="careers" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Careers
            </TabsTrigger>
            <TabsTrigger value="packets" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Hiring Packets
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Legal Templates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="careers">
            <CareersTab />
          </TabsContent>
          
          <TabsContent value="packets">
            <HiringPacketTab />
          </TabsContent>
          
          <TabsContent value="legal">
            <LegalTemplatesTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
