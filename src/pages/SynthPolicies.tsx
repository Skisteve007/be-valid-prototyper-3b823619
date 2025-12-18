import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Home, Shield, Settings, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const SynthPolicies = () => {
  const navigate = useNavigate();
  
  // Default policy settings
  const [policies, setPolicies] = useState({
    coherence_threshold: 0.85,
    verification_threshold: 0.90,
    random_sample_percent: 5,
    store_full_text: false,
    review_all_failures: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updatePolicy = (key: string, value: number | boolean) => {
    setPolicies(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // In production, this would save to database
    localStorage.setItem('synth_policies', JSON.stringify(policies));
    toast.success('Policies saved successfully');
    setHasChanges(false);
  };

  const resetDefaults = () => {
    setPolicies({
      coherence_threshold: 0.85,
      verification_threshold: 0.90,
      random_sample_percent: 5,
      store_full_text: false,
      review_all_failures: true,
    });
    setHasChanges(true);
    toast.info('Reset to default values');
  };

  return (
    <>
      <Helmet>
        <title>SYNTH™ Policies | Valid™</title>
        <meta name="description" content="Configure SYNTH™ audit policies and thresholds" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Background */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(59,130,246,0.08), transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(168,85,247,0.08), transparent 50%),
              linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)))
            `,
          }}
        />
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-blue-500/20">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/synth/console')}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SYNTH™ Policies
                </h1>
                <p className="text-muted-foreground text-xs">Configure audit thresholds and settings</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetDefaults}
                className="border-muted-foreground/30"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={saveSettings}
                disabled={!hasChanges}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </header>

        {/* Spacer */}
        <div className="h-20" />

        {/* Main Content */}
        <main className="relative z-10 p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
          
          {/* Thresholds Card */}
          <Card className="border-blue-500/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="w-5 h-5 text-blue-400" />
                Verification Thresholds
              </CardTitle>
              <CardDescription>
                Requests failing these thresholds will be flagged for human review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="coherence" className="text-foreground">
                    Coherence Threshold
                  </Label>
                  <span className="text-blue-400 font-mono text-sm">
                    {policies.coherence_threshold.toFixed(2)}
                  </span>
                </div>
                <Input
                  id="coherence"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={policies.coherence_threshold}
                  onChange={(e) => updatePolicy('coherence_threshold', parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Default: 0.85 — Scores below this trigger HUMAN_REVIEW_REQUIRED
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="verification" className="text-foreground">
                    Verification Threshold
                  </Label>
                  <span className="text-purple-400 font-mono text-sm">
                    {policies.verification_threshold.toFixed(2)}
                  </span>
                </div>
                <Input
                  id="verification"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={policies.verification_threshold}
                  onChange={(e) => updatePolicy('verification_threshold', parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Default: 0.90 — Scores below this trigger HUMAN_REVIEW_REQUIRED
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Review Settings */}
          <Card className="border-amber-500/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Settings className="w-5 h-5 text-amber-400" />
                Human Review Settings
              </CardTitle>
              <CardDescription>
                Configure which outputs require human review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Review All Failures</Label>
                  <p className="text-xs text-muted-foreground">
                    Review 100% of failed cases (MISTRIAL / verification fail / policy fail)
                  </p>
                </div>
                <Switch
                  checked={policies.review_all_failures}
                  onCheckedChange={(checked) => updatePolicy('review_all_failures', checked)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sample" className="text-foreground">
                    Random Sample % of Released Outputs
                  </Label>
                  <span className="text-amber-400 font-mono text-sm">
                    {policies.random_sample_percent}%
                  </span>
                </div>
                <Input
                  id="sample"
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={policies.random_sample_percent}
                  onChange={(e) => updatePolicy('random_sample_percent', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Default: 5% — Sample released outputs for QA
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Logging Settings */}
          <Card className="border-emerald-500/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Settings className="w-5 h-5 text-emerald-400" />
                Privacy & Logging
              </CardTitle>
              <CardDescription>
                Configure how prompts and answers are stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Store Full Text</Label>
                  <p className="text-xs text-muted-foreground">
                    Store raw prompts/answers (default: hashed for privacy)
                  </p>
                </div>
                <Switch
                  checked={policies.store_full_text}
                  onCheckedChange={(checked) => updatePolicy('store_full_text', checked)}
                />
              </div>
              
              {policies.store_full_text && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-amber-400 text-sm font-medium">⚠️ Warning</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Storing full text may expose sensitive data. Only enable for internal testing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Settings Summary */}
          <Card className="border-border bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Current Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono text-foreground/80 bg-background/50 p-4 rounded-lg overflow-x-auto">
{JSON.stringify(policies, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </main>

        {/* Home FAB */}
        <button
          onClick={() => navigate('/')}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition z-50"
        >
          <Home className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default SynthPolicies;
