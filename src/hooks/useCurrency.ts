import { useState, useEffect, createContext, useContext } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.00 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', rate: 17.15 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 4.97 },
  { code: 'COP', symbol: 'COL$', name: 'Colombian Peso', rate: 3950.00 },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (usdPrice: number) => number;
  formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Return default values if used outside provider
    const defaultCurrency = SUPPORTED_CURRENCIES[0];
    return {
      currency: defaultCurrency,
      setCurrency: () => {},
      convertPrice: (usdPrice: number) => usdPrice,
      formatPrice: (usdPrice: number) => `$${usdPrice.toFixed(2)}`,
    };
  }
  return context;
};

export const useCurrencyState = () => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    // Try to get saved currency from localStorage
    const saved = localStorage.getItem('preferred-currency');
    if (saved) {
      const found = SUPPORTED_CURRENCIES.find(c => c.code === saved);
      if (found) return found;
    }
    // Try to detect from browser locale
    const locale = navigator.language;
    if (locale.includes('GB') || locale.includes('en-GB')) {
      return SUPPORTED_CURRENCIES.find(c => c.code === 'GBP') || SUPPORTED_CURRENCIES[0];
    }
    if (locale.includes('DE') || locale.includes('FR') || locale.includes('ES') || locale.includes('IT')) {
      return SUPPORTED_CURRENCIES.find(c => c.code === 'EUR') || SUPPORTED_CURRENCIES[0];
    }
    if (locale.includes('CA')) {
      return SUPPORTED_CURRENCIES.find(c => c.code === 'CAD') || SUPPORTED_CURRENCIES[0];
    }
    if (locale.includes('AU')) {
      return SUPPORTED_CURRENCIES.find(c => c.code === 'AUD') || SUPPORTED_CURRENCIES[0];
    }
    if (locale.includes('MX')) {
      return SUPPORTED_CURRENCIES.find(c => c.code === 'MXN') || SUPPORTED_CURRENCIES[0];
    }
    if (locale.includes('BR')) {
      return SUPPORTED_CURRENCIES.find(c => c.code === 'BRL') || SUPPORTED_CURRENCIES[0];
    }
    if (locale.includes('CO')) {
      return SUPPORTED_CURRENCIES.find(c => c.code === 'COP') || SUPPORTED_CURRENCIES[0];
    }
    return SUPPORTED_CURRENCIES[0];
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('preferred-currency', newCurrency.code);
  };

  const convertPrice = (usdPrice: number): number => {
    return Math.round(usdPrice * currency.rate * 100) / 100;
  };

  const formatPrice = (usdPrice: number): string => {
    const converted = convertPrice(usdPrice);
    // Format based on currency
    if (currency.code === 'COP') {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  return {
    currency,
    setCurrency,
    convertPrice,
    formatPrice,
  };
};

export { CurrencyContext };
