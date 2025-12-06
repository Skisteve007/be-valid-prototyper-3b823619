import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface PartnerBetaSurveyProps {
  partnerId?: string;
}

const PartnerBetaSurvey = ({ partnerId }: PartnerBetaSurveyProps) => {
  const [responses, setResponses] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!responses.q1 || !responses.q2 || !responses.q3) {
      toast.error("Please complete all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('partner_beta_surveys')
        .insert({
          partner_id: partnerId || null,
          revenue_share_rating: responses.q1,
          zero_trust_liability: responses.q2,
          staff_efficiency: responses.q3,
          deployment_barrier: responses.q4 || null,
          missing_feature: responses.q5 || null
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Survey submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting survey:", error);
      toast.error("Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-accent/50 bg-card/80 backdrop-blur-sm shadow-[0_0_30px_hsl(var(--accent)/0.3)]">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_hsl(var(--accent)/0.5)]">
            <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-accent mb-2">Thank you for your valuable insight!</h3>
          <p className="text-muted-foreground">Your feedback helps us build the best platform for partners.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-600/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-amber-500">
          Partner Solutions: Operational Validation Survey
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Help us validate the B2B revenue and security models for optimal market launch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1: Revenue Share Value */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              1. Rate the value of the <strong className="text-amber-500">Automated Revenue Share</strong> model (Profitability). *
            </Label>
            <Select value={responses.q1} onValueChange={(value) => setResponses(prev => ({ ...prev, q1: value }))}>
              <SelectTrigger className="bg-secondary border-amber-600/50">
                <SelectValue placeholder="Select Rating (1-5)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 - Extremely High Value</SelectItem>
                <SelectItem value="4">4 - High Value</SelectItem>
                <SelectItem value="3">3 - Moderate Value</SelectItem>
                <SelectItem value="2">2 - Low Value</SelectItem>
                <SelectItem value="1">1 - No Value</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question 2: Zero-Trust Liability Reduction */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              2. Does the <strong className="text-amber-500">Zero-Trust Architecture</strong> clearly reduce your operational liability risk? *
            </Label>
            <Select value={responses.q2} onValueChange={(value) => setResponses(prev => ({ ...prev, q2: value }))}>
              <SelectTrigger className="bg-secondary border-amber-600/50">
                <SelectValue placeholder="Select Answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes, significantly</SelectItem>
                <SelectItem value="No">No, not significantly</SelectItem>
                <SelectItem value="Clarification">Needs further clarification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question 3: Staff Efficiency */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              3. Estimate the time <strong className="text-amber-500">Frictionless Staff Workflow</strong> saves your entry team per event: *
            </Label>
            <Select value={responses.q3} onValueChange={(value) => setResponses(prev => ({ ...prev, q3: value }))}>
              <SelectTrigger className="bg-secondary border-amber-600/50">
                <SelectValue placeholder="Select Time Saved" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15+">15+ minutes per event</SelectItem>
                <SelectItem value="5-15">5 – 15 minutes per event</SelectItem>
                <SelectItem value="0-5">0 – 5 minutes per event</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question 4: Barrier to Deployment */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              4. What is the biggest barrier to deploying VALID across your <strong className="text-amber-500">entire workforce/fleet</strong>?
            </Label>
            <Input
              value={responses.q4}
              onChange={(e) => setResponses(prev => ({ ...prev, q4: e.target.value }))}
              placeholder="e.g., HRIS integration, training cost, legal review..."
              className="bg-secondary border-amber-600/50"
              maxLength={500}
            />
          </div>

          {/* Question 5: Missing Feature for Recommendation */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              5. What one feature is <strong className="text-amber-500">missing</strong> that would make you recommend VALID to industry peers?
            </Label>
            <Textarea
              value={responses.q5}
              onChange={(e) => setResponses(prev => ({ ...prev, q5: e.target.value }))}
              placeholder="Suggest a feature for market dominance..."
              className="bg-secondary border-amber-600/50 min-h-[80px]"
              maxLength={1000}
            />
          </div>

          <Button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-primary-foreground font-bold py-6 text-lg shadow-[0_0_20px_hsl(var(--accent)/0.4)] hover:shadow-[0_0_30px_hsl(var(--accent)/0.6)] transition-all"
          >
            {submitting ? "Submitting..." : "Submit Validation Survey"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PartnerBetaSurvey;
