import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Send, CheckCircle, ClipboardList } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  // Header fields (Required)
  client_team_name: z.string().min(1, "Client / Team Name is required"),
  primary_contact: z.string().min(1, "Primary Contact is required"),
  role_team: z.string().optional(),
  engagement_start_date: z.string().optional(),
  
  // Section 1: System Context & Intent
  system_name: z.string().min(1, "System Name is required"),
  primary_use_case: z.string().optional(),
  model_interaction_pattern: z.array(z.string()).optional(),
  system_description: z.string().optional(),
  
  // Section 2: Risk & Regulated Consequence
  primary_risk: z.array(z.string()).optional(),
  potential_impact: z.array(z.string()).optional(),
  applicable_policies: z.array(z.string()).optional(),
  
  // Section 3: Model & Platform Inventory
  providers_in_scope: z.array(z.string()).optional(),
  model_versions_tested: z.string().optional(),
  environment: z.array(z.string()).optional(),
  
  // Section 4: Evaluation Goals
  evaluation_focus: z.array(z.string()).optional(),
  metrics_used: z.array(z.string()).optional(),
  
  // Section 5: Datasets & Benchmarks
  ground_truth_available: z.string().optional(),
  dataset_type: z.array(z.string()).optional(),
  versioning_in_place: z.string().optional(),
  
  // Section 6: Evaluation Pipelines & Tools
  frameworks_in_use: z.array(z.string()).optional(),
  automation_level: z.string().optional(),
  
  // Section 7: Outputs & Expectations
  success_30_days: z.string().optional(),
  preferred_reporting: z.array(z.string()).optional(),
  
  // Section 8: Operational Constraints
  budget_sensitivity: z.string().optional(),
  update_cadence: z.string().optional(),
  approval_required: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AIGovernanceIntakeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckboxGroup = ({ 
  options, 
  values = [], 
  onChange 
}: { 
  options: string[]; 
  values: string[]; 
  onChange: (values: string[]) => void;
}) => {
  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...values, option]);
    } else {
      onChange(values.filter(v => v !== option));
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={option.replace(/\s+/g, '-').toLowerCase()}
            checked={values.includes(option)}
            onCheckedChange={(checked) => handleChange(option, checked as boolean)}
          />
          <Label htmlFor={option.replace(/\s+/g, '-').toLowerCase()} className="text-sm font-normal cursor-pointer">
            {option}
          </Label>
        </div>
      ))}
    </div>
  );
};

const AIGovernanceIntakeForm: React.FC<AIGovernanceIntakeFormProps> = ({ isOpen, onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_team_name: '',
      primary_contact: '',
      role_team: '',
      engagement_start_date: '',
      system_name: '',
      primary_use_case: '',
      model_interaction_pattern: [],
      system_description: '',
      primary_risk: [],
      potential_impact: [],
      applicable_policies: [],
      providers_in_scope: [],
      model_versions_tested: '',
      environment: [],
      evaluation_focus: [],
      metrics_used: [],
      ground_truth_available: '',
      dataset_type: [],
      versioning_in_place: '',
      frameworks_in_use: [],
      automation_level: '',
      success_30_days: '',
      preferred_reporting: [],
      budget_sensitivity: '',
      update_cadence: '',
      approval_required: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await (supabase.from('ai_governance_intakes' as never) as ReturnType<typeof supabase.from>)
        .insert({
          full_name: data.primary_contact,
          work_email: `${data.client_team_name.toLowerCase().replace(/\s+/g, '.')}@intake.form`,
          organization: data.client_team_name,
          role_team: data.role_team || null,
          system_name: data.system_name,
          system_description: data.system_description || null,
          primary_use_case: data.primary_use_case ? [data.primary_use_case] : null,
          prompting_pattern: data.model_interaction_pattern || null,
          primary_risk: data.primary_risk || null,
          potential_impact: data.potential_impact || null,
          applicable_policies: data.applicable_policies || null,
          ai_providers: data.providers_in_scope || null,
          models_tested: data.model_versions_tested || null,
          runtime_environment: data.environment || null,
          evaluation_focus: data.evaluation_focus || null,
          metrics_used: data.metrics_used || null,
          ground_truth_available: data.ground_truth_available || null,
          dataset_type: data.dataset_type || null,
          dataset_versioning: data.versioning_in_place === 'Yes',
          evaluation_frameworks: data.frameworks_in_use || null,
          automation_level: data.automation_level || null,
          success_30_days: data.success_30_days || null,
          preferred_reporting: data.preferred_reporting || null,
          budget_sensitivity: data.budget_sensitivity || null,
          update_cadence: data.update_cadence || null,
        });

      if (error) throw error;
      
      setIsSubmitted(true);
      toast.success("Intake form submitted successfully");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    form.reset();
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-16 w-16 text-cyan-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Thank You</h3>
            <p className="text-muted-foreground">
              Your intake has been received. We'll follow up shortly.
            </p>
            <Button onClick={handleClose} className="mt-6">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <ClipboardList className="h-5 w-5 text-cyan-500" />
            </div>
            <DialogTitle className="text-xl font-bold">
              AI System Evaluation & Governance — Intake Form
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-4 space-y-8">
            
            {/* Header Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_team_name">
                  Client / Team Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="client_team_name"
                  {...form.register('client_team_name')}
                  placeholder="Enter client or team name"
                />
                {form.formState.errors.client_team_name && (
                  <p className="text-sm text-destructive">{form.formState.errors.client_team_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primary_contact">
                  Primary Contact <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="primary_contact"
                  {...form.register('primary_contact')}
                  placeholder="Enter primary contact name"
                />
                {form.formState.errors.primary_contact && (
                  <p className="text-sm text-destructive">{form.formState.errors.primary_contact.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role_team">Role / Team (Product, Platform, Security, Research)</Label>
                <Input
                  id="role_team"
                  {...form.register('role_team')}
                  placeholder="e.g., Platform Engineering"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="engagement_start_date">Engagement Start Date</Label>
                <Input
                  id="engagement_start_date"
                  type="date"
                  {...form.register('engagement_start_date')}
                />
              </div>
            </div>

            {/* Section 1: System Context & Intent */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">
                1. System Context & Intent
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="system_name">
                  System Name / Internal Identifier <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="system_name"
                  {...form.register('system_name')}
                  placeholder="Enter system name"
                />
                {form.formState.errors.system_name && (
                  <p className="text-sm text-destructive">{form.formState.errors.system_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Primary Use Case (check one)</Label>
                <RadioGroup
                  value={form.watch('primary_use_case')}
                  onValueChange={(value) => form.setValue('primary_use_case', value)}
                >
                  {['Internal decision support', 'User-facing generation', 'Automated execution', 'Evaluation / benchmarking only'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`use_case_${option.replace(/\s+/g, '-')}`} />
                      <Label htmlFor={`use_case_${option.replace(/\s+/g, '-')}`} className="font-normal cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Model Interaction Pattern</Label>
                <CheckboxGroup
                  options={['Zero-shot', 'Few-shot', 'System-prompt driven', 'Tool-using / agentic']}
                  values={form.watch('model_interaction_pattern') || []}
                  onChange={(values) => form.setValue('model_interaction_pattern', values)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="system_description">What decisions or actions does this system influence?</Label>
                <Textarea
                  id="system_description"
                  {...form.register('system_description')}
                  placeholder="Short description..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Section 2: Risk & Regulated Consequence */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">
                2. Risk & Regulated Consequence <span className="text-cyan-500 text-sm font-normal">(Critical)</span>
              </h3>
              
              <div className="space-y-2">
                <Label>If the model is wrong, what is the primary risk?</Label>
                <CheckboxGroup
                  options={['Incorrect output', 'Hallucination', 'Latency / timeout', 'Bias / safety violation', 'Cost overrun']}
                  values={form.watch('primary_risk') || []}
                  onChange={(values) => form.setValue('primary_risk', values)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Potential Impact (check all that apply)</Label>
                <CheckboxGroup
                  options={['Customer harm', 'Compliance / regulatory exposure', 'Financial loss', 'Reputational risk']}
                  values={form.watch('potential_impact') || []}
                  onChange={(values) => form.setValue('potential_impact', values)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Applicable frameworks / policies</Label>
                <CheckboxGroup
                  options={['SOC 2', 'GDPR', 'Internal AI policy', 'Industry-specific requirements']}
                  values={form.watch('applicable_policies') || []}
                  onChange={(values) => form.setValue('applicable_policies', values)}
                />
              </div>
            </div>

            {/* Section 3: Model & Platform Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">
                3. Model & Platform Inventory
              </h3>
              
              <div className="space-y-2">
                <Label>Providers in Scope</Label>
                <CheckboxGroup
                  options={['Azure OpenAI', 'OpenAI', 'Anthropic', 'Google', 'Open source']}
                  values={form.watch('providers_in_scope') || []}
                  onChange={(values) => form.setValue('providers_in_scope', values)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model_versions_tested">Model Versions Tested</Label>
                <Input
                  id="model_versions_tested"
                  {...form.register('model_versions_tested')}
                  placeholder="e.g., GPT-4.x, GPT-4.1, Claude, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Environment</Label>
                <CheckboxGroup
                  options={['Linux', 'Cloud-hosted', 'Local / CI']}
                  values={form.watch('environment') || []}
                  onChange={(values) => form.setValue('environment', values)}
                />
              </div>
            </div>

            {/* Section 4: Evaluation Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">
                4. Evaluation Goals (Align to Role)
              </h3>
              
              <div className="space-y-2">
                <Label>Primary Evaluation Focus (rank 1–5)</Label>
                <CheckboxGroup
                  options={['Accuracy / relevance', 'Hallucination rate', 'Safety / bias', 'Latency / throughput', 'Cost per output']}
                  values={form.watch('evaluation_focus') || []}
                  onChange={(values) => form.setValue('evaluation_focus', values)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Metrics currently used (if any)</Label>
                <CheckboxGroup
                  options={['Precision / Recall', 'F1', 'BLEU / ROUGE', 'Custom heuristics', 'None (baseline needed)']}
                  values={form.watch('metrics_used') || []}
                  onChange={(values) => form.setValue('metrics_used', values)}
                />
              </div>
            </div>

            {/* Section 5: Datasets & Benchmarks */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">
                5. Datasets & Benchmarks
              </h3>
              
              <div className="space-y-2">
                <Label>Ground truth available?</Label>
                <RadioGroup
                  value={form.watch('ground_truth_available')}
                  onValueChange={(value) => form.setValue('ground_truth_available', value)}
                >
                  {['Yes', 'Partial', 'No'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`ground_truth_${option}`} />
                      <Label htmlFor={`ground_truth_${option}`} className="font-normal cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Dataset Type</Label>
                <CheckboxGroup
                  options={['Synthetic', 'Curated', 'Production-derived']}
                  values={form.watch('dataset_type') || []}
                  onChange={(values) => form.setValue('dataset_type', values)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Versioning in place?</Label>
                <RadioGroup
                  value={form.watch('versioning_in_place')}
                  onValueChange={(value) => form.setValue('versioning_in_place', value)}
                >
                  {['Yes', 'No'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`versioning_${option}`} />
                      <Label htmlFor={`versioning_${option}`} className="font-normal cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Section 6: Evaluation Pipelines & Tools */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">
                6. Evaluation Pipelines & Tools
              </h3>
              
              <div className="space-y-2">
                <Label>Frameworks in Use (check all)</Label>
                <CheckboxGroup
                  options={['OpenAI Evals', 'Hugging Face evals', 'Promptfoo', 'Ragas', 'DeepEval', 'LM Eval Harness']}
                  values={form.watch('frameworks_in_use') || []}
                  onChange={(values) => form.setValue('frameworks_in_use', values)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Automation Level</Label>
                <RadioGroup
                  value={form.watch('automation_level')}
                  onValueChange={(value) => form.setValue('automation_level', value)}
                >
                  {['Manual', 'Semi-automated', 'Fully automated (CI/CD)'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`automation_${option.replace(/\s+/g, '-')}`} />
                      <Label htmlFor={`automation_${option.replace(/\s+/g, '-')}`} className="font-normal cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Section 7: Outputs & Expectations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">
                7. Outputs & Expectations
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="success_30_days">What would success look like in 30 days?</Label>
                <Textarea
                  id="success_30_days"
                  {...form.register('success_30_days')}
                  placeholder="Short, plain English..."
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Reporting Format</Label>
                <CheckboxGroup
                  options={['Dashboard', 'Written evaluation summary', 'Executive brief', 'Raw metrics + analysis']}
                  values={form.watch('preferred_reporting') || []}
                  onChange={(values) => form.setValue('preferred_reporting', values)}
                />
              </div>
            </div>

            {/* Section 8: Operational Constraints */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">
                8. Operational Constraints
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Budget Sensitivity</Label>
                  <RadioGroup
                    value={form.watch('budget_sensitivity')}
                    onValueChange={(value) => form.setValue('budget_sensitivity', value)}
                  >
                    {['Low', 'Medium', 'High'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`budget_${option}`} />
                        <Label htmlFor={`budget_${option}`} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Update cadence required</Label>
                  <RadioGroup
                    value={form.watch('update_cadence')}
                    onValueChange={(value) => form.setValue('update_cadence', value)}
                  >
                    {['Weekly', 'Bi-weekly', 'Monthly'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`cadence_${option}`} />
                        <Label htmlFor={`cadence_${option}`} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Approval required for changes?</Label>
                  <RadioGroup
                    value={form.watch('approval_required')}
                    onValueChange={(value) => form.setValue('approval_required', value)}
                  >
                    {['Yes', 'No'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`approval_${option}`} />
                        <Label htmlFor={`approval_${option}`} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground italic border-t border-border pt-4">
              This intake establishes evaluation scope and does not include implementation details or proprietary methodologies.
            </p>

          </form>
        </ScrollArea>

        {/* Footer with Submit */}
        <div className="px-6 py-4 border-t border-border/50 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-cyan-500 hover:bg-cyan-600 text-black"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Intake'}
            <Send className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGovernanceIntakeForm;
