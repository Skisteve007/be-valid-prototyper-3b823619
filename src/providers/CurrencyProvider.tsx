import { ReactNode } from 'react';
import { CurrencyContext, useCurrencyState } from '@/hooks/useCurrency';

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const currencyState = useCurrencyState();

  return (
    <CurrencyContext.Provider value={currencyState}>
      {children}
    </CurrencyContext.Provider>
  );
};
