import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, Shield, CheckCircle, Info } from "lucide-react";

interface Account {
  id: string;
  data_environment: string | null;
  data_classes: string[];
  use_cases: string[];
  output_preference: string;
  intake_completed_at: string | null;
}

interface AccountIntakeTabProps {
  account: Account;
  onRefresh: () => void;
}

const DATA_CLASSES = [
  { id: "identity", label: "Identity", description: "Personal identification data" },
  { id: "health", label: "Health", description: "Medical and health records" },
  { id: "toxicology", label: "Toxicology", description: "Drug/substance screening" },
  { id: "wallet", label: "Wallet", description: "Payment and financial data" },
  { id: "profile", label: "Profile", description: "User profile and preferences" },
];

const USE_CASES = [
  { id: "output_validation", label: "Output Validation", description: "Validate AI/LLM outputs for accuracy" },
  { id: "hallucination_check", label: "Hallucination/Drift Check", description: "Detect AI hallucinations and model drift" },
  { id: "identity_check", label: "Identity/Status Check", description: "Verify user identity and current status" },
  { id: "source_crosscheck", label: "Record-of-Source Cross-Check", description: "Validate against authoritative sources" },
];

export const AccountIntakeTab = ({ account, onRefresh }: AccountIntakeTabProps) => {
  const [dataEnvironment, setDataEnvironment] = useState(account.data_environment || "cloud");
  const [dataClasses, setDataClasses] = useState<string[]>(account.data_classes || []);
  const [useCases, setUseCases] = useState<string[]>(account.use_cases || []);
  const [outputPreference, setOutputPreference] = useState(account.output_preference || "download");
  const [saving, setSaving] = useState(false);

  const toggleDataClass = (id: string) => {
    setDataClasses(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleUseCase = (id: string) => {
    setUseCases(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("enterprise_accounts")
        .update({
          data_environment: dataEnvironment as any,
          data_classes: dataClasses,
          use_cases: useCases,
          output_preference: outputPreference,
          intake_completed_at: new Date().toISOString(),
          status: "active",
        })
        .eq("id", account.id);

      if (error) throw error;

      toast.success("Intake saved successfully");
      onRefresh();
    } catch (error: any) {
      toast.error("Failed to save intake");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Retention Statement */}
      <Alert className="border-primary/50 bg-primary/5">
        <Shield className="h-4 w-4" />
        <AlertTitle>Data Retention Policy</AlertTitle>
        <AlertDescription>
          <strong>VALID stores proof records only.</strong> No raw sensitive data (IDs, medical images, passports) 
          is retained. All payloads are ephemeral and automatically flushed after processing or TTL expiry.
        </AlertDescription>
      </Alert>

      {/* Data Environment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Environment</CardTitle>
          <CardDescription>Where does your data reside?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={dataEnvironment} onValueChange={setDataEnvironment}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="on_prem" id="on_prem" />
              <Label htmlFor="on_prem">On-Premise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cloud" id="cloud" />
              <Label htmlFor="cloud">Cloud</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hybrid" id="hybrid" />
              <Label htmlFor="hybrid">Hybrid</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Data Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Classes</CardTitle>
          <CardDescription>What types of data will you be validating?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DATA_CLASSES.map((dc) => (
              <div key={dc.id} className="flex items-start space-x-3">
                <Checkbox
                  id={dc.id}
                  checked={dataClasses.includes(dc.id)}
                  onCheckedChange={() => toggleDataClass(dc.id)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={dc.id} className="font-medium cursor-pointer">
                    {dc.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{dc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Use Cases</CardTitle>
          <CardDescription>What will you use VALID for?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {USE_CASES.map((uc) => (
              <div key={uc.id} className="flex items-start space-x-3">
                <Checkbox
                  id={uc.id}
                  checked={useCases.includes(uc.id)}
                  onCheckedChange={() => toggleUseCase(uc.id)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={uc.id} className="font-medium cursor-pointer">
                    {uc.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{uc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Output Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Output Preference</CardTitle>
          <CardDescription>How do you want to receive results?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={outputPreference} onValueChange={setOutputPreference}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="download" id="download" />
              <Label htmlFor="download">Download (manual export)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="webhook" id="webhook" />
              <Label htmlFor="webhook">Webhook (automatic push)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both">Both</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Save Intake
        </Button>
      </div>
    </div>
  );
};
