import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Briefcase } from "lucide-react";
import { LeadOutreachTab } from "./LeadOutreachTab";
import { InvestorCRMTab } from "./InvestorCRMTab";

export const PipelineTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Pipeline Management
        </CardTitle>
        <CardDescription>
          Manage marketing leads and investor relationships in one place
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Marketing Leads
            </TabsTrigger>
            <TabsTrigger value="investors" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Investor CRM
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <LeadOutreachTab />
          </TabsContent>
          
          <TabsContent value="investors">
            <InvestorCRMTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
