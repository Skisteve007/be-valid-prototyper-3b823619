import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AccountOverviewTab } from "./AccountOverviewTab";
import { AccountIntakeTab } from "./AccountIntakeTab";
import { AccountDeploymentsTab } from "./AccountDeploymentsTab";
import { AccountConnectorsTab } from "./AccountConnectorsTab";
import { AccountProofRecordsTab } from "./AccountProofRecordsTab";

interface Account {
  id: string;
  account_name: string;
  industry: string;
  location_city: string | null;
  location_country: string;
  status: string;
  data_environment: string | null;
  data_classes: string[];
  use_cases: string[];
  output_preference: string;
  intake_completed_at: string | null;
  last_run_at: string | null;
  last_verdict: string | null;
  total_runs: number;
  created_at: string;
}

interface AccountDetailPageProps {
  accountId: string;
  onBack: () => void;
  onRunDemo: (accountId: string, deploymentId: string) => void;
}

export const AccountDetailPage = ({ accountId, onBack, onRunDemo }: AccountDetailPageProps) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadAccount();
  }, [accountId]);

  const loadAccount = async () => {
    try {
      const { data, error } = await supabase
        .from("enterprise_accounts")
        .select("*")
        .eq("id", accountId)
        .single();

      if (error) throw error;
      setAccount(data);
    } catch (error: any) {
      toast.error("Failed to load account");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Account not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            {account.account_name}
          </h1>
          <p className="text-muted-foreground">
            {account.location_city ? `${account.location_city}, ${account.location_country}` : account.location_country}
            {" • "}{account.industry}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="intake">Intake</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="connectors">Connectors</TabsTrigger>
          <TabsTrigger value="proof-records">Proof Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <AccountOverviewTab 
            account={account} 
            onRefresh={loadAccount}
            onRunDemo={onRunDemo}
          />
        </TabsContent>

        <TabsContent value="intake" className="mt-6">
          <AccountIntakeTab 
            account={account} 
            onRefresh={loadAccount}
          />
        </TabsContent>

        <TabsContent value="deployments" className="mt-6">
          <AccountDeploymentsTab 
            accountId={account.id} 
            onRunDemo={onRunDemo}
          />
        </TabsContent>

        <TabsContent value="connectors" className="mt-6">
          <AccountConnectorsTab accountId={account.id} />
        </TabsContent>

        <TabsContent value="proof-records" className="mt-6">
          <AccountProofRecordsTab accountId={account.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
