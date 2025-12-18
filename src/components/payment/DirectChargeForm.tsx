import React, { useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DirectChargeFormProps {
  onSubmit: (type: string, amount: number) => void;
  onBack: () => void;
}

const CHARGE_TYPES = [
  { id: 'cover', label: 'Cover Charge', icon: '🚪' },
  { id: 'bar_tab', label: 'Bar Tab', icon: '🍸' },
  { id: 'food_beverage', label: 'Food & Beverage', icon: '🍽️' },
  { id: 'bottle_service', label: 'Bottle Service', icon: '🍾' },
  { id: 'merch', label: 'Merchandise', icon: '👕' },
  { id: 'event_ticket', label: 'Event Ticket', icon: '🎟️' },
  { id: 'vip_upgrade', label: 'VIP Upgrade', icon: '⭐' },
  { id: 'other', label: 'Other', icon: '📝' },
];

const DirectChargeForm: React.FC<DirectChargeFormProps> = ({ onSubmit, onBack }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const handleContinue = () => {
    if (selectedType && amount) {
      const numAmount = parseFloat(amount);
      if (numAmount > 0) {
        onSubmit(selectedType, numAmount);
      }
    }
  };

  const parsedAmount = parseFloat(amount) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Direct Charge</h2>
          <p className="text-sm text-muted-foreground">Select charge type and amount</p>
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Charge Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {CHARGE_TYPES.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all ${
                selectedType === type.id 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : 'hover:border-muted-foreground/50'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <CardContent className="p-3 text-center">
                <span className="text-2xl mb-1 block">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-2xl font-bold h-14 text-center"
        />
      </div>

      <div className="pt-4 border-t border-border">
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <p className="text-xs text-muted-foreground text-center">
            <span className="font-medium text-purple-500">Direct Payment:</span> Venue keeps amount less 1.5% transaction fee + gas fee
          </p>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          disabled={!selectedType || parsedAmount <= 0}
          onClick={handleContinue}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Continue with ${parsedAmount.toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

export default DirectChargeForm;
