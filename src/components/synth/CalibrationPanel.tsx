import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Sliders, Save, RotateCcw, Shield, AlertTriangle, User, Loader2 } from 'lucide-react';

interface CalibrationWeights {
  seat_1_weight: number;
  seat_2_weight: number;
  seat_3_weight: number;
  seat_4_weight: number;
  seat_5_weight: number;
  seat_6_weight: number;
  seat_7_weight: number;
}

const SEAT_NAMES = [
  { id: 1, name: 'OpenAI (GPT-4o)', icon: '🟢' },
  { id: 2, name: 'Anthropic (Claude 3.5)', icon: '🟠' },
  { id: 3, name: 'Google (Gemini 1.5)', icon: '🔵' },
  { id: 4, name: 'Meta (Llama 3)', icon: '🟣' },
  { id: 5, name: 'DeepSeek (V3)', icon: '🔷' },
  { id: 6, name: 'Mistral (Large)', icon: '🟡' },
  { id: 7, name: 'xAI (Grok)', icon: '🔴' },
];

const DEFAULT_WEIGHTS: CalibrationWeights = {
  seat_1_weight: 15,
  seat_2_weight: 15,
  seat_3_weight: 15,
  seat_4_weight: 14,
  seat_5_weight: 14,
  seat_6_weight: 14,
  seat_7_weight: 13,
};

interface CalibrationPanelProps {
  isEmployer?: boolean;
}

export const CalibrationPanel: React.FC<CalibrationPanelProps> = ({ isEmployer = false }) => {
  const [weights, setWeights] = useState<CalibrationWeights>(DEFAULT_WEIGHTS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [probationUserId, setProbationUserId] = useState('');
  const [probationEnabled, setProbationEnabled] = useState(false);
  const [isProbationSaving, setIsProbationSaving] = useState(false);

  useEffect(() => {
    loadCalibration();
  }, []);

  const loadCalibration = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('synth-calibration', {
        method: 'GET'
      });
      
      if (error) throw error;
      
      if (data?.calibration) {
        setWeights({
          seat_1_weight: data.calibration.seat_1_weight,
          seat_2_weight: data.calibration.seat_2_weight,
          seat_3_weight: data.calibration.seat_3_weight,
          seat_4_weight: data.calibration.seat_4_weight,
          seat_5_weight: data.calibration.seat_5_weight,
          seat_6_weight: data.calibration.seat_6_weight,
          seat_7_weight: data.calibration.seat_7_weight,
        });
      }
    } catch (error) {
      console.error('Failed to load calibration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const isValid = totalWeight === 100;

  const handleWeightChange = (seatKey: keyof CalibrationWeights, value: number) => {
    const newWeights = { ...weights, [seatKey]: value };
    const newTotal = Object.values(newWeights).reduce((a, b) => a + b, 0);
    
    if (newTotal > 100) {
      const diff = newTotal - 100;
      const otherSeats = Object.keys(newWeights).filter(k => k !== seatKey) as (keyof CalibrationWeights)[];
      const adjustPerSeat = Math.ceil(diff / otherSeats.length);
      
      otherSeats.forEach(key => {
        newWeights[key] = Math.max(0, newWeights[key] - adjustPerSeat);
      });
    }
    
    setWeights(newWeights);
  };

  const handleSave = async () => {
    if (!isValid) {
      toast.error('Weights must sum to 100');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke('synth-calibration', {
        method: 'PUT',
        body: weights
      });

      if (error) throw error;
      toast.success('Calibration saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save calibration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setWeights(DEFAULT_WEIGHTS);
    toast.info('Reset to default weights');
  };

  const handleEnableProbation = async () => {
    if (!probationUserId.trim()) {
      toast.error('Please enter a user ID');
      return;
    }

    setIsProbationSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('synth_probation').insert({
        target_user_id: probationUserId,
        enabled_by: user.id,
        started_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        extra_logging: true,
        strict_session_lock: true,
        step_up_auth: false
      });

      if (error) throw error;
      toast.success('30-day probation enabled for user');
      setProbationEnabled(true);
      setProbationUserId('');
    } catch (error) {
      console.error('Probation error:', error);
      toast.error('Failed to enable probation');
    } finally {
      setIsProbationSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="synth-card border-0">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mr-2" />
          <span className="text-gray-400">Loading calibration...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="synth-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Seat Weighting Configuration
          </CardTitle>
          <CardDescription className="text-gray-400">
            Adjust the influence of each AI seat. Weights must sum to 100%.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {SEAT_NAMES.map((seat) => {
            const key = `seat_${seat.id}_weight` as keyof CalibrationWeights;
            return (
              <div key={seat.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <span>{seat.icon}</span>
                    {seat.name}
                  </Label>
                  <span className="text-sm font-mono text-cyan-400">{weights[key]}%</span>
                </div>
                <Slider
                  value={[weights[key]]}
                  onValueChange={([value]) => handleWeightChange(key, value)}
                  max={100}
                  min={0}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <span className="text-gray-300 font-medium">Total</span>
            <Badge className={isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
              {totalWeight}% {isValid ? '✓' : '(must be 100)'}
            </Badge>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={!isValid || isSaving}
              className="synth-btn-primary flex-1"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Calibration'}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {isEmployer && (
        <Card className="synth-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-amber-400" />
              30-Day Probation Mode
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enable enhanced monitoring for specific users. Includes extra logging, stricter session locks, and optional step-up auth.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="probation-user" className="text-gray-300 mb-2 block">
                  <User className="w-4 h-4 inline mr-2" />
                  User ID
                </Label>
                <Input
                  id="probation-user"
                  placeholder="Enter user ID to put on probation"
                  value={probationUserId}
                  onChange={(e) => setProbationUserId(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-gray-200"
                />
              </div>
              <Button
                onClick={handleEnableProbation}
                disabled={!probationUserId.trim() || isProbationSaving}
                className="bg-amber-600 hover:bg-amber-700 text-white mt-6"
              >
                {isProbationSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mr-2" />
                )}
                {isProbationSaving ? 'Enabling...' : 'Enable Probation'}
              </Button>
            </div>

            {probationEnabled && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-sm text-amber-300">
                  Probation active for user. Effects: Extra logging enabled, strict session lock thresholds applied.
                </p>
              </div>
            )}

            <div className="space-y-3 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-300">Probation Effects:</h4>
              <div className="flex items-center justify-between">
                <Label className="text-gray-400">Extra Logging</Label>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-400">Strict Session Lock</Label>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-400">Step-up Auth on Flags</Label>
                <Switch checked={false} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalibrationPanel;