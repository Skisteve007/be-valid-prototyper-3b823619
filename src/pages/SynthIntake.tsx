import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, Check, Shield, User, MapPin, Target, Briefcase, Bot, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AVATAR_CLASSES = [
  { id: 'dune_pilot', name: 'Dune Pilot', color: '#D4A574', icon: '🛸' },
  { id: 'nebula_archivist', name: 'Nebula Archivist', color: '#9B59B6', icon: '📚' },
  { id: 'rift_engineer', name: 'Rift Engineer', color: '#3498DB', icon: '⚙️' },
  { id: 'solar_warden', name: 'Solar Warden', color: '#F39C12', icon: '☀️' },
  { id: 'cryo_cartographer', name: 'Cryo Cartographer', color: '#1ABC9C', icon: '🗺️' },
  { id: 'signal_mystic', name: 'Signal Mystic', color: '#E74C3C', icon: '📡' },
  { id: 'orbit_nomad', name: 'Orbit Nomad', color: '#95A5A6', icon: '🌙' },
  { id: 'void_courier', name: 'Void Courier', color: '#2C3E50', icon: '📦' },
  { id: 'prism_mechanist', name: 'Prism Mechanist', color: '#E91E63', icon: '💎' },
  { id: 'atlas_sentinel', name: 'Atlas Sentinel', color: '#00BCD4', icon: '🛡️' },
];

const SynthIntake = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [city, setCity] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');
  const [genderSelfDescribe, setGenderSelfDescribe] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [domainInterest, setDomainInterest] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [leaderboardVisibility, setLeaderboardVisibility] = useState('anonymous');
  const [consentScoring, setConsentScoring] = useState(false);
  const [consentFairness, setConsentFairness] = useState(false);

  // LLM profile
  const [llmExperience, setLlmExperience] = useState('');
  const [primaryAssistant, setPrimaryAssistant] = useState('');
  const [primaryAssistantOther, setPrimaryAssistantOther] = useState('');
  const [usageFrequency, setUsageFrequency] = useState('');
  const [useCases, setUseCases] = useState<string[]>([]);

  // Avatar
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUserId(user.id);

      // Check if intake already completed
      const { data: profile } = await supabase
        .from('profiles')
        .select('synth_intake_completed_at')
        .eq('user_id', user.id)
        .single();

      if (profile?.synth_intake_completed_at) {
        navigate('/synth/accepted');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleUseCaseToggle = (useCase: string) => {
    setUseCases(prev => 
      prev.includes(useCase) 
        ? prev.filter(c => c !== useCase)
        : [...prev, useCase]
    );
  };

  const randomizeAvatar = () => {
    const randomIndex = Math.floor(Math.random() * AVATAR_CLASSES.length);
    setSelectedAvatar(AVATAR_CLASSES[randomIndex].id);
  };

  const handleSubmit = async () => {
    if (!consentScoring) {
      toast.error('You must consent to scoring to continue');
      return;
    }

    setLoading(true);
    try {
      // Generate codename
      const { data: codenameData } = await supabase
        .rpc('generate_synth_codename', { p_tier: 'Initiate' });

      const codename = codenameData || `INITIATE-Σ${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          synth_display_name: displayName || null,
          synth_codename: codename,
          synth_avatar_class_id: selectedAvatar || null,
          synth_avatar_color: selectedAvatar ? AVATAR_CLASSES.find(a => a.id === selectedAvatar)?.color : null,
          synth_country: country || null,
          synth_state_region: stateRegion || null,
          synth_city: city || null,
          synth_age_range: ageRange || null,
          synth_gender: gender || null,
          synth_gender_self_describe: gender === 'self-describe' ? genderSelfDescribe : null,
          synth_primary_goal: primaryGoal || null,
          synth_domain_interest: domainInterest || null,
          synth_experience_level: experienceLevel || null,
          synth_leaderboard_visibility: leaderboardVisibility,
          synth_consent_scoring: consentScoring,
          synth_consent_analytics: consentFairness,
          synth_llm_experience_level: llmExperience || null,
          synth_primary_assistant: primaryAssistant === 'other' ? null : primaryAssistant || null,
          synth_primary_assistant_other: primaryAssistant === 'other' ? primaryAssistantOther : null,
          synth_usage_frequency: usageFrequency || null,
          synth_use_cases: useCases.length > 0 ? useCases : null,
          synth_intake_completed_at: new Date().toISOString(),
          synth_accepted_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Create trial entitlement
      await supabase.rpc('get_or_create_synth_entitlement', { p_user_id: userId });

      toast.success('Intake complete!');
      navigate('/synth/accepted');
    } catch (err) {
      console.error('Intake error:', err);
      toast.error('Failed to complete intake');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Identity */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase">Identity</h3>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>
        <div>
          <Label htmlFor="displayName" className="text-sm text-muted-foreground">Display Name / Handle</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Anonymous by default"
            className="mt-1 bg-muted/20 border-muted/30"
          />
        </div>
      </section>

      {/* Location */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase">Location</h3>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="text-sm text-muted-foreground">Country</Label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="USA"
              className="mt-1 bg-muted/20 border-muted/30"
            />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">State/Region</Label>
            <Input
              value={stateRegion}
              onChange={(e) => setStateRegion(e.target.value)}
              placeholder="CA"
              className="mt-1 bg-muted/20 border-muted/30"
            />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">City</Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="San Francisco"
              className="mt-1 bg-muted/20 border-muted/30"
            />
          </div>
        </div>
      </section>

      {/* Demographics */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase">Demographics</h3>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Age Range</Label>
            <Select value={ageRange} onValueChange={setAgeRange}>
              <SelectTrigger className="mt-1 bg-muted/20 border-muted/30">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-24">18–24</SelectItem>
                <SelectItem value="25-34">25–34</SelectItem>
                <SelectItem value="35-44">35–44</SelectItem>
                <SelectItem value="45-54">45–54</SelectItem>
                <SelectItem value="55+">55+</SelectItem>
                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="mt-1 bg-muted/20 border-muted/30">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="nonbinary">Nonbinary</SelectItem>
                <SelectItem value="self-describe">Self-describe</SelectItem>
                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {gender === 'self-describe' && (
          <Input
            value={genderSelfDescribe}
            onChange={(e) => setGenderSelfDescribe(e.target.value)}
            placeholder="How do you identify?"
            className="mt-3 bg-muted/20 border-muted/30"
          />
        )}
      </section>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Goals */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase">Goals</h3>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Primary Goal</Label>
            <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
              <SelectTrigger className="mt-1 bg-muted/20 border-muted/30">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="college">College / Education</SelectItem>
                <SelectItem value="job-search">Job Search</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="creator">Creator / Content</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Domain Interest</Label>
            <Select value={domainInterest} onValueChange={setDomainInterest}>
              <SelectTrigger className="mt-1 bg-muted/20 border-muted/30">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="swe">Software Engineering</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="ai-ml">AI / ML</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="law">Law</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase">Experience Level</h3>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>
        <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel} className="flex flex-wrap gap-3">
          {['0-1', '2-4', '5-9', '10+'].map((level) => (
            <div key={level} className="flex items-center">
              <RadioGroupItem value={level} id={`exp-${level}`} className="peer sr-only" />
              <Label
                htmlFor={`exp-${level}`}
                className="px-4 py-2 rounded-full border border-muted/30 bg-muted/10 cursor-pointer transition-all peer-data-[state=checked]:border-cyan-500 peer-data-[state=checked]:bg-cyan-500/20 peer-data-[state=checked]:text-cyan-400"
              >
                {level} years
              </Label>
            </div>
          ))}
        </RadioGroup>
      </section>

      {/* Leaderboard Visibility */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase">Leaderboard Visibility</h3>
        </div>
        <RadioGroup value={leaderboardVisibility} onValueChange={setLeaderboardVisibility} className="flex flex-wrap gap-3">
          {[
            { value: 'anonymous', label: 'Anonymous' },
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
          ].map((opt) => (
            <div key={opt.value} className="flex items-center">
              <RadioGroupItem value={opt.value} id={`vis-${opt.value}`} className="peer sr-only" />
              <Label
                htmlFor={`vis-${opt.value}`}
                className="px-4 py-2 rounded-full border border-muted/30 bg-muted/10 cursor-pointer transition-all peer-data-[state=checked]:border-cyan-500 peer-data-[state=checked]:bg-cyan-500/20 peer-data-[state=checked]:text-cyan-400"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <p className="text-xs text-muted-foreground mt-2">Default: Anonymous. Your codename is used on public boards.</p>
      </section>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      {/* LLM Profile */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase">Current Tooling</h3>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">LLM Experience Level</Label>
            <Select value={llmExperience} onValueChange={setLlmExperience}>
              <SelectTrigger className="mt-1 bg-muted/20 border-muted/30">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New (0–2 weeks)</SelectItem>
                <SelectItem value="beginner">Beginner (1–3 months)</SelectItem>
                <SelectItem value="intermediate">Intermediate (3–12 months)</SelectItem>
                <SelectItem value="advanced">Advanced (1–2 years)</SelectItem>
                <SelectItem value="power">Power user (2+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Primary Assistant Used Most</Label>
            <Select value={primaryAssistant} onValueChange={setPrimaryAssistant}>
              <SelectTrigger className="mt-1 bg-muted/20 border-muted/30">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chatgpt">ChatGPT</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="copilot">Copilot</SelectItem>
                <SelectItem value="perplexity">Perplexity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {primaryAssistant === 'other' && (
            <Input
              value={primaryAssistantOther}
              onChange={(e) => setPrimaryAssistantOther(e.target.value)}
              placeholder="Which assistant?"
              className="bg-muted/20 border-muted/30"
            />
          )}

          <div>
            <Label className="text-sm text-muted-foreground">Usage Frequency</Label>
            <Select value={usageFrequency} onValueChange={setUsageFrequency}>
              <SelectTrigger className="mt-1 bg-muted/20 border-muted/30">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="rarely">Rarely</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Primary Use Cases (select all that apply)</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'resume', label: 'Resume/Cover Letters' },
                { id: 'coding', label: 'Coding' },
                { id: 'studying', label: 'Studying' },
                { id: 'research', label: 'Research' },
                { id: 'writing', label: 'Writing/Content' },
                { id: 'strategy', label: 'Strategy/Business' },
                { id: 'other', label: 'Other' },
              ].map((uc) => (
                <button
                  key={uc.id}
                  type="button"
                  onClick={() => handleUseCaseToggle(uc.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    useCases.includes(uc.id)
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                      : 'border-muted/30 bg-muted/10 text-muted-foreground hover:border-muted/50'
                  }`}
                >
                  {uc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Consent */}
      <section className="border-t border-cyan-500/10 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase">Consent</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
            <Checkbox
              id="consent-scoring"
              checked={consentScoring}
              onCheckedChange={(checked) => setConsentScoring(checked as boolean)}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor="consent-scoring" className="text-sm text-foreground font-medium cursor-pointer">
                Required: Scoring & Ranking Consent
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                I consent to storing my submissions + metadata for scoring, ranking, and longitudinal reports.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border border-muted/20 bg-muted/5">
            <Checkbox
              id="consent-fairness"
              checked={consentFairness}
              onCheckedChange={(checked) => setConsentFairness(checked as boolean)}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor="consent-fairness" className="text-sm text-foreground font-medium cursor-pointer">
                Optional: Fairness Analytics
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                I consent to demographic analytics for fairness monitoring (optional).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">SELECT YOUR AVATAR CLASS</h2>
        <p className="text-sm text-muted-foreground">Cosmetic only. Does not affect ranking.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {AVATAR_CLASSES.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => setSelectedAvatar(avatar.id)}
            className={`p-4 rounded-xl border text-center transition-all hover:scale-105 ${
              selectedAvatar === avatar.id
                ? 'border-cyan-500 bg-cyan-500/20 shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                : 'border-muted/30 bg-muted/10 hover:border-muted/50'
            }`}
          >
            <div 
              className="text-3xl mb-2"
              style={{ filter: selectedAvatar === avatar.id ? 'none' : 'grayscale(50%)' }}
            >
              {avatar.icon}
            </div>
            <p className="text-xs font-medium text-foreground">{avatar.name}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={randomizeAvatar}
          className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 bg-transparent"
        >
          🎲 RANDOMIZE
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setSelectedAvatar(null)}
          className="border-muted/40 text-muted-foreground hover:bg-muted/10 bg-transparent"
        >
          SKIP
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>INITIATE INTAKE - SYNTH Board™ | Valid™</title>
        <meta name="description" content="Complete intake to receive clearance and begin calibration." />
      </Helmet>

      <div className="min-h-screen synth-bg text-foreground font-electrolize relative overflow-hidden">
        <div className="fixed inset-0 z-0 synth-grid opacity-30" />
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.06), transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(183, 65, 14, 0.05), transparent 50%)
            `,
          }}
        />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 synth-header px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/synth')}
                className="p-2 rounded-full bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 transition"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
              </button>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">SYNTH BOARD</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-all ${
                    s <= step ? 'bg-cyan-400' : 'bg-muted/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="relative z-10 pt-20 pb-12 px-4 max-w-3xl mx-auto">
          <div 
            className="synth-card rounded-2xl p-6 sm:p-8 border border-cyan-500/20"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            {step < 4 && (
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">INITIATE INTAKE</h1>
                <p className="text-muted-foreground text-sm">Complete intake to receive clearance and begin calibration.</p>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-cyan-500/10">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="border-muted/40 text-muted-foreground hover:bg-muted/10 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="synth-btn-primary"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !consentScoring}
                    className="synth-btn-primary synth-pulse"
                  >
                    {loading ? 'Processing...' : 'REQUEST CLEARANCE'}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/synth/policies')}
                className="text-xs text-cyan-400/60 hover:text-cyan-400 transition"
              >
                Privacy & Data Use
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SynthIntake;
