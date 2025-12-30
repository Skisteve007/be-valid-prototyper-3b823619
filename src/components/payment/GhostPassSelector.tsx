import React, { useState } from 'react';
import { ArrowLeft, Ghost, Crown, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GhostPassSelectorProps {
  onSelect: (tier: 'bronze' | 'silver' | 'gold', promoterCode?: string) => void;
  onBack: () => void;
}

const TIERS = [
  {
    id: 'bronze' as const,
    name: 'Bronze',
    price: 10,
    icon: Shield,
    gradient: 'from-amber-600 to-amber-800',
    description: 'Standard entry access',
  },
  {
    id: 'silver' as const,
    name: 'Silver',
    price: 20,
    icon: Star,
    gradient: 'from-slate-400 to-slate-600',
    description: 'Enhanced access + perks',
  },
  {
    id: 'gold' as const,
    name: 'Gold',
    price: 50,
    icon: Crown,
    gradient: 'from-yellow-500 to-yellow-700',
    description: 'VIP access + full perks',
  },
];

const GhostPassSelector: React.FC<GhostPassSelectorProps> = ({ onSelect, onBack }) => {
  const [selectedTier, setSelectedTier] = useState<'bronze' | 'silver' | 'gold' | null>(null);
  const [promoterCode, setPromoterCode] = useState('');

  const handleContinue = () => {
    if (selectedTier) {
      onSelect(selectedTier, promoterCode || undefined);
    }
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-base font-bold">Select GHOST™ PASS</h2>
          <p className="text-xs text-muted-foreground">Choose a tier</p>
        </div>
      </div>

      <div className="grid gap-2">
        {TIERS.map((tier) => (
          <Card
            key={tier.id}
            className={`cursor-pointer transition-all ${
              selectedTier === tier.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-muted-foreground/50'
            }`}
            onClick={() => setSelectedTier(tier.id)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${tier.gradient} flex items-center justify-center flex-shrink-0`}>
                <tier.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">{tier.name}</h3>
                  <span className="text-base font-bold">${tier.price}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{tier.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="promoterCode" className="text-xs">Promoter Code (Optional)</Label>
        <Input
          id="promoterCode"
          placeholder="Enter promoter code"
          value={promoterCode}
          onChange={(e) => setPromoterCode(e.target.value.toUpperCase())}
          className="h-9"
        />
      </div>

      <div className="pt-3 border-t border-border">
        <div className="bg-muted/50 rounded-lg p-2 mb-3">
          <p className="text-[10px] text-muted-foreground text-center">
            <span className="font-medium text-cyan-500">Split:</span> 30% Venue • 30% Promoter • 10% Pool • 30% VALID™
          </p>
        </div>

        <Button 
          className="w-full" 
          size="default"
          disabled={!selectedTier}
          onClick={handleContinue}
        >
          <Ghost className="mr-2 h-4 w-4" />
          Continue with {selectedTier ? TIERS.find(t => t.id === selectedTier)?.name : 'Selection'}
        </Button>
      </div>
    </div>
  );
};

export default GhostPassSelector;
