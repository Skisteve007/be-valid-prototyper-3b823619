import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface MemberBetaSurveyProps {
  userId?: string;
}

const MemberBetaSurvey = ({ userId }: MemberBetaSurveyProps) => {
  const [open, setOpen] = useState(false);
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
        .from('member_beta_surveys')
        .insert({
          user_id: userId || null,
          ease_of_use: responses.q1,
          trust_in_security: responses.q2,
          qr_sharing_experience: responses.q3,
          missing_feature: responses.q4 || null,
          recommendation_likelihood: responses.q5 || null
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch (error: any) {
      console.error("Error submitting survey:", error);
      toast.error("Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const SurveyContent = () => {
    if (submitted) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-400 mb-2">Thank you for your feedback!</h3>
          <p className="text-muted-foreground">Your input helps us build a better experience for all members.</p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 1: Ease of Use */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            1. How <strong className="text-green-400">easy</strong> was it to set up your VALID profile? *
          </Label>
          <Select value={responses.q1} onValueChange={(value) => setResponses(prev => ({ ...prev, q1: value }))}>
            <SelectTrigger className="bg-secondary border-green-600/50">
              <SelectValue placeholder="Select Rating (1-5)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 - Extremely Easy</SelectItem>
              <SelectItem value="4">4 - Easy</SelectItem>
              <SelectItem value="3">3 - Moderate</SelectItem>
              <SelectItem value="2">2 - Difficult</SelectItem>
              <SelectItem value="1">1 - Very Difficult</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question 2: Trust in Security */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            2. How confident are you that your <strong className="text-green-400">data is secure</strong> with VALID? *
          </Label>
          <Select value={responses.q2} onValueChange={(value) => setResponses(prev => ({ ...prev, q2: value }))}>
            <SelectTrigger className="bg-secondary border-green-600/50">
              <SelectValue placeholder="Select Confidence Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Very Confident">Very Confident</SelectItem>
              <SelectItem value="Confident">Confident</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
              <SelectItem value="Concerned">Somewhat Concerned</SelectItem>
              <SelectItem value="Very Concerned">Very Concerned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question 3: QR Sharing Experience */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            3. How would you rate the <strong className="text-green-400">QR code sharing</strong> experience? *
          </Label>
          <Select value={responses.q3} onValueChange={(value) => setResponses(prev => ({ ...prev, q3: value }))}>
            <SelectTrigger className="bg-secondary border-green-600/50">
              <SelectValue placeholder="Select Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent - Fast & Seamless</SelectItem>
              <SelectItem value="Good">Good - Works Well</SelectItem>
              <SelectItem value="Average">Average - Could Be Better</SelectItem>
              <SelectItem value="Poor">Poor - Needs Improvement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question 4: Missing Feature */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            4. What <strong className="text-green-400">feature</strong> would you most like us to add?
          </Label>
          <Textarea
            value={responses.q4}
            onChange={(e) => setResponses(prev => ({ ...prev, q4: e.target.value }))}
            placeholder="Tell us what would make VALID even better..."
            className="bg-secondary border-green-600/50 min-h-[80px]"
            maxLength={1000}
          />
        </div>

        {/* Question 5: Recommendation Likelihood */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            5. How likely are you to <strong className="text-green-400">recommend VALID</strong> to a friend?
          </Label>
          <Select value={responses.q5} onValueChange={(value) => setResponses(prev => ({ ...prev, q5: value }))}>
            <SelectTrigger className="bg-secondary border-green-600/50">
              <SelectValue placeholder="Select Likelihood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 - Definitely Would</SelectItem>
              <SelectItem value="8-9">8-9 - Very Likely</SelectItem>
              <SelectItem value="6-7">6-7 - Likely</SelectItem>
              <SelectItem value="4-5">4-5 - Maybe</SelectItem>
              <SelectItem value="1-3">1-3 - Unlikely</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full md:w-auto px-6 py-3 text-lg font-extrabold rounded-lg 
                     bg-gray-800/80 text-green-400 border-2 border-green-600 
                     shadow-xl shadow-green-900/50 hover:shadow-green-600/70 transition-all 
                     flex items-center justify-center space-x-2 mt-6"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          <span role="img" aria-label="Clipboard">📋</span>
          <span>MEMBER BETA FEEDBACK (5 Questions)</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-green-600/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Member Beta Feedback
          </DialogTitle>
        </DialogHeader>
        <SurveyContent />
      </DialogContent>
    </Dialog>
  );
};

export default MemberBetaSurvey;
