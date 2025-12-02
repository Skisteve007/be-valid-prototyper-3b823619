import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Mail, Lock, ShieldCheck, ShieldX, AlertTriangle, Eye, CheckCircle, XCircle } from "lucide-react";

interface LockedResult {
  id: string;
  barcode_value: string;
  result_status: string | null;
  test_type: string;
  created_at: string;
}

interface PrivateInboxProps {
  userId: string;
  onStatusUpdate?: () => void;
}

export const PrivateInbox = ({ userId, onStatusUpdate }: PrivateInboxProps) => {
  const [lockedResults, setLockedResults] = useState<LockedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<LockedResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchLockedResults = async () => {
    try {
      const { data, error } = await supabase
        .from("lab_orders")
        .select("id, barcode_value, result_status, test_type, created_at")
        .eq("user_id", userId)
        .eq("order_status", "result_received_locked")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLockedResults(data || []);
    } catch (error) {
      console.error("Error fetching locked results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockedResults();
  }, [userId]);

  const handleViewResult = (result: LockedResult) => {
    setSelectedResult(result);
    setShowResultModal(true);
  };

  const handleKeepPrivate = async () => {
    // Just close the modal - user chooses to keep results private
    setShowResultModal(false);
    setSelectedResult(null);
    toast.info("Your results remain private and will not be shared.");
  };

  const handleVerifyProfile = async () => {
    if (!selectedResult) return;
    
    setProcessing(true);
    try {
      // Update the lab order status to verified_active
      const { error: orderError } = await supabase
        .from("lab_orders")
        .update({ order_status: "verified_active" })
        .eq("id", selectedResult.id);

      if (orderError) throw orderError;

      // Only update profile to green if result is negative
      if (selectedResult.result_status === "negative") {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ status_color: "green" })
          .eq("user_id", userId);

        if (profileError) throw profileError;
        
        toast.success("Your profile has been verified! Green Pass activated.");
      } else {
        toast.info("Your result has been acknowledged. Profile status updated.");
      }

      // Refresh the list
      await fetchLockedResults();
      setShowResultModal(false);
      setSelectedResult(null);
      
      // Notify parent to refresh if needed
      onStatusUpdate?.();
    } catch (error) {
      console.error("Error verifying profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const getResultIcon = (result: string | null) => {
    switch (result) {
      case "negative":
        return <ShieldCheck className="h-12 w-12 text-green-500" />;
      case "positive":
        return <ShieldX className="h-12 w-12 text-destructive" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
    }
  };

  const getResultText = (result: string | null) => {
    switch (result) {
      case "negative":
        return { text: "NEGATIVE", color: "text-green-500", description: "All clear! Your test results are negative." };
      case "positive":
        return { text: "POSITIVE", color: "text-destructive", description: "Please consult with a healthcare provider." };
      case "inconclusive":
        return { text: "INCONCLUSIVE", color: "text-yellow-500", description: "Results were inconclusive. A retest may be required." };
      default:
        return { text: "PENDING", color: "text-muted-foreground", description: "Results are being processed." };
    }
  };

  const getTestTypeLabel = (testType: string) => {
    switch (testType) {
      case "STD_PANEL":
        return "13-Panel Sexual Health Screen";
      case "TOXICOLOGY":
        return "10-Panel Toxicology Screen";
      default:
        return testType;
    }
  };

  if (loading) {
    return null;
  }

  if (lockedResults.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="border-2 border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-amber-500/10 mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-full">
              <Mail className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Private Inbox
                <Badge variant="destructive" className="animate-pulse">
                  {lockedResults.length} New
                </Badge>
              </CardTitle>
              <CardDescription>
                Confidential lab results awaiting your review
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {lockedResults.map((result) => (
            <div 
              key={result.id}
              className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{getTestTypeLabel(result.test_type)}</p>
                  <p className="text-xs text-muted-foreground">
                    Received: {new Date(result.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => handleViewResult(result)}
                className="bg-orange-500 hover:bg-orange-600"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Private Results
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Result Reveal Modal */}
      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Your Confidential Results</DialogTitle>
            <DialogDescription className="text-center">
              {selectedResult && getTestTypeLabel(selectedResult.test_type)}
            </DialogDescription>
          </DialogHeader>

          {selectedResult && (
            <div className="py-6">
              <div className="flex flex-col items-center gap-4">
                {getResultIcon(selectedResult.result_status)}
                <div className="text-center">
                  <p className={`text-3xl font-bold ${getResultText(selectedResult.result_status).color}`}>
                    {getResultText(selectedResult.result_status).text}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {getResultText(selectedResult.result_status).description}
                  </p>
                </div>
              </div>

              {/* Privacy Disclaimer */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  <Lock className="h-3 w-3 inline mr-1" />
                  <strong>Clean Check respects your privacy.</strong> Your status is never shared unless you explicitly click "Verify Profile".
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleKeepPrivate}
              disabled={processing}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Keep Private
            </Button>
            <Button
              onClick={handleVerifyProfile}
              disabled={processing}
              className={`flex-1 ${
                selectedResult?.result_status === "negative" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-primary"
              }`}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {processing ? "Processing..." : "Verify Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
