import { useCurrency, SUPPORTED_CURRENCIES, Currency } from '@/hooks/useCurrency';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

export const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={currency.code}
        onValueChange={(value) => {
          const selected = SUPPORTED_CURRENCIES.find(c => c.code === value);
          if (selected) setCurrency(selected);
        }}
      >
        <SelectTrigger className="w-[140px] h-8 text-sm bg-background border-border">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span className="font-semibold">{currency.symbol}</span>
              <span>{currency.code}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-[100]">
          {SUPPORTED_CURRENCIES.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              <span className="flex items-center gap-2">
                <span className="font-semibold w-8">{curr.symbol}</span>
                <span>{curr.code}</span>
                <span className="text-muted-foreground text-xs">- {curr.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
