import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  // Required fields
  full_name: z.string().min(1, 'Full name is required'),
  work_email: z.string().email('Valid email required'),
  organization: z.string().min(1, 'Organization is required'),
  system_name: z.string().min(1, 'System name is required'),
  // Optional fields
  role_team: z.string().optional(),
  preferred_followup: z.array(z.string()).optional(),
  primary_use_case: z.array(z.string()).optional(),
  prompting_pattern: z.array(z.string()).optional(),
  system_description: z.string().optional(),
  primary_risk: z.array(z.string()).optional(),
  potential_impact: z.array(z.string()).optional(),
  applicable_policies: z.array(z.string()).optional(),
  ai_providers: z.array(z.string()).optional(),
  models_tested: z.string().optional(),
  runtime_environment: z.array(z.string()).optional(),
  evaluation_focus: z.array(z.string()).optional(),
  metrics_used: z.array(z.string()).optional(),
  ground_truth_available: z.string().optional(),
  dataset_type: z.array(z.string()).optional(),
  dataset_versioning: z.boolean().optional(),
  evaluation_frameworks: z.array(z.string()).optional(),
  automation_level: z.string().optional(),
  success_30_days: z.string().optional(),
  preferred_reporting: z.array(z.string()).optional(),
  budget_sensitivity: z.string().optional(),
  update_cadence: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AIGovernanceIntakeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckboxGroup: React.FC<{
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}> = ({ options, selected, onChange }) => {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map(option => (
        <label key={option} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
          <Checkbox
            checked={selected.includes(option)}
            onCheckedChange={() => toggle(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

const RadioGroup: React.FC<{
  options: string[];
  selected: string | undefined;
  onChange: (value: string) => void;
}> = ({ options, selected, onChange }) => (
  <div className="flex flex-wrap gap-3">
    {options.map(option => (
      <label key={option} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
        <input
          type="radio"
          checked={selected === option}
          onChange={() => onChange(option)}
          className="w-4 h-4 text-cyan-500 border-border"
        />
        {option}
      </label>
    ))}
  </div>
);

const AIGovernanceIntakeForm: React.FC<AIGovernanceIntakeFormProps> = ({ isOpen, onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      work_email: '',
      organization: '',
      system_name: '',
      role_team: '',
      preferred_followup: [],
      primary_use_case: [],
      prompting_pattern: [],
      system_description: '',
      primary_risk: [],
      potential_impact: [],
      applicable_policies: [],
      ai_providers: [],
      models_tested: '',
      runtime_environment: [],
      evaluation_focus: [],
      metrics_used: [],
      ground_truth_available: '',
      dataset_type: [],
      dataset_versioning: false,
      evaluation_frameworks: [],
      automation_level: '',
      success_30_days: '',
      preferred_reporting: [],
      budget_sensitivity: '',
      update_cadence: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('ai_governance_intakes').insert({
        full_name: data.full_name,
        work_email: data.work_email,
        organization: data.organization,
        system_name: data.system_name,
        role_team: data.role_team || null,
        preferred_followup: data.preferred_followup || [],
        primary_use_case: data.primary_use_case || [],
        prompting_pattern: data.prompting_pattern || [],
        system_description: data.system_description || null,
        primary_risk: data.primary_risk || [],
        potential_impact: data.potential_impact || [],
        applicable_policies: data.applicable_policies || [],
        ai_providers: data.ai_providers || [],
        models_tested: data.models_tested || null,
        runtime_environment: data.runtime_environment || [],
        evaluation_focus: data.evaluation_focus || [],
        metrics_used: data.metrics_used || [],
        ground_truth_available: data.ground_truth_available || null,
        dataset_type: data.dataset_type || [],
        dataset_versioning: data.dataset_versioning || false,
        evaluation_frameworks: data.evaluation_frameworks || [],
        automation_level: data.automation_level || null,
        success_30_days: data.success_30_days || null,
        preferred_reporting: data.preferred_reporting || [],
        budget_sensitivity: data.budget_sensitivity || null,
        update_cadence: data.update_cadence || null,
      } as Record<string, unknown>);

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Intake submitted successfully');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit intake. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-md bg-card border border-border rounded-xl p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
          <CheckCircle className="h-16 w-16 text-cyan-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-orbitron text-foreground mb-3">Thank You</h2>
          <p className="text-muted-foreground">Your intake has been received. We'll follow up shortly.</p>
          <Button onClick={onClose} className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-black">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-cyan-500/30 rounded-xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold font-orbitron text-foreground">AI Evaluation & Governance Intake Form</h2>
          <p className="text-sm text-muted-foreground mt-1">Fields marked with * are required</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* SECTION 0 - Contact Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">Contact Information</h3>
              
              <FormField control={form.control} name="full_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl><Input {...field} placeholder="Your full name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="work_email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Email *</FormLabel>
                  <FormControl><Input type="email" {...field} placeholder="you@company.com" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="organization" render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization / Company *</FormLabel>
                  <FormControl><Input {...field} placeholder="Your organization" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="role_team" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Team</FormLabel>
                  <FormControl><Input {...field} placeholder="Your role or team" /></FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="preferred_followup" render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Follow-Up Method</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Email', 'Phone', 'Video call']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />
            </section>

            {/* SECTION 1 - System Context */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">System Context & Intent</h3>
              
              <FormField control={form.control} name="system_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>System Name or Internal Identifier *</FormLabel>
                  <FormControl><Input {...field} placeholder="System name or ID" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="primary_use_case" render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Use Case</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Internal decision support', 'User-facing generation', 'Automated execution', 'Evaluation / benchmarking only']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="prompting_pattern" render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompting Pattern</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Zero-shot', 'Few-shot', 'System-prompt driven', 'Tool-using / agentic']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="system_description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief Description of What the System Does</FormLabel>
                  <FormControl><Textarea {...field} placeholder="Describe your system..." rows={3} /></FormControl>
                </FormItem>
              )} />
            </section>

            {/* SECTION 2 - Risk */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">Risk & Regulated Consequence</h3>
              
              <FormField control={form.control} name="primary_risk" render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Risk If the System Is Wrong</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Incorrect output', 'Hallucination', 'Bias / safety violation', 'Latency / timeout', 'Cost overrun']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="potential_impact" render={({ field }) => (
                <FormItem>
                  <FormLabel>Potential Impact</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Customer harm', 'Compliance / regulatory exposure', 'Financial loss', 'Reputational risk']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="applicable_policies" render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicable Policies or Regulations</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['SOC 2', 'GDPR', 'Internal AI policy', 'Industry-specific requirements']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />
            </section>

            {/* SECTION 3 - Model Inventory */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">Model & Platform Inventory</h3>
              
              <FormField control={form.control} name="ai_providers" render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Providers in Scope</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Azure OpenAI', 'OpenAI', 'Anthropic', 'Google', 'Open source']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="models_tested" render={({ field }) => (
                <FormItem>
                  <FormLabel>Models / Versions Tested</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g., GPT-4.1, Claude, Gemini" /></FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="runtime_environment" render={({ field }) => (
                <FormItem>
                  <FormLabel>Runtime Environment</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Linux', 'Cloud-hosted', 'Local / CI']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />
            </section>

            {/* SECTION 4 - Evaluation Goals */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">Evaluation Goals & Metrics</h3>
              
              <FormField control={form.control} name="evaluation_focus" render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Evaluation Focus (Rank Top 3)</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Accuracy / relevance', 'Hallucination rate', 'Safety / bias', 'Latency / throughput', 'Cost per output']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="metrics_used" render={({ field }) => (
                <FormItem>
                  <FormLabel>Metrics Currently Used</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Precision / Recall', 'F1', 'BLEU / ROUGE', 'Custom heuristics', 'None (baseline needed)']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />
            </section>

            {/* SECTION 5 - Datasets */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">Datasets & Benchmarks</h3>
              
              <FormField control={form.control} name="ground_truth_available" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ground Truth Available?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      options={['Yes', 'Partial', 'No']}
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="dataset_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Dataset Type</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Synthetic', 'Curated', 'Production-derived']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="dataset_versioning" render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Dataset Versioning in Place?</FormLabel>
                </FormItem>
              )} />
            </section>

            {/* SECTION 6 - Pipelines */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">Evaluation Pipelines & Tools</h3>
              
              <FormField control={form.control} name="evaluation_frameworks" render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluation Frameworks in Use</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['OpenAI Evals', 'Hugging Face evals', 'Promptfoo', 'Ragas', 'DeepEval', 'LM Eval Harness']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="automation_level" render={({ field }) => (
                <FormItem>
                  <FormLabel>Automation Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      options={['Manual', 'Semi-automated', 'Fully automated (CI/CD)']}
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />
            </section>

            {/* SECTION 7 - Outputs */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">Outputs & Expectations</h3>
              
              <FormField control={form.control} name="success_30_days" render={({ field }) => (
                <FormItem>
                  <FormLabel>What Would Success Look Like in 30 Days?</FormLabel>
                  <FormControl><Textarea {...field} placeholder="Describe your success criteria..." rows={3} /></FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="preferred_reporting" render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Reporting Format</FormLabel>
                  <FormControl>
                    <CheckboxGroup
                      options={['Dashboard', 'Written evaluation summary', 'Executive brief', 'Raw metrics + analysis']}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />
            </section>

            {/* SECTION 8 - Constraints */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">Operational Constraints</h3>
              
              <FormField control={form.control} name="budget_sensitivity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Sensitivity</FormLabel>
                  <FormControl>
                    <RadioGroup
                      options={['Low', 'Medium', 'High']}
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="update_cadence" render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Update Cadence</FormLabel>
                  <FormControl>
                    <RadioGroup
                      options={['Weekly', 'Bi-weekly', 'Monthly']}
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )} />
            </section>

            {/* Privacy Note */}
            <div className="text-xs text-muted-foreground border-t border-border pt-4 mt-6">
              This intake is for evaluation scoping only and does not disclose proprietary methodologies or implementation details.
            </div>

            {/* Submit */}
            <Button type="submit" disabled={isSubmitting} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
              {isSubmitting ? 'Submitting...' : 'Submit Intake'}
              <Send className="h-4 w-4 ml-2" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AIGovernanceIntakeForm;
