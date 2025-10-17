/**
 * Currency Hook
 * Usage: const { convertPrice, formatPrice, currency, setCurrency } = useCurrency();
 */

import { useState, useEffect } from 'react';
import {
  detectUserCurrency,
  convertCurrency,
  formatCurrency,
  setPreferredCurrency,
  getCurrentCurrency,
  parsePriceString,
  initCurrency,
  SupportedCurrency,
  CURRENCY_CONFIGS,
} from '@/utils/currencyConverter';

export const useCurrency = () => {
  const [currency, setCurrencyState] = useState<SupportedCurrency>('ZAR');
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const initializeCurrency = async () => {
      setIsLoading(true);
      await initCurrency();
      const detectedCurrency = await detectUserCurrency();
      setCurrencyState(detectedCurrency);
      setIsLoading(false);
    };

    initializeCurrency();
  }, []);

  const changeCurrency = (newCurrency: SupportedCurrency) => {
    setCurrencyState(newCurrency);
    setPreferredCurrency(newCurrency);
  };

  /**
   * Convert ZAR amount to current currency
   */
  const convertPrice = (zarAmount: number): number => {
    return convertCurrency(zarAmount, currency);
  };

  /**
   * Format amount in current currency
   */
  const formatPrice = (amount: number, includeSymbol: boolean = true): string => {
    return formatCurrency(amount, currency, includeSymbol);
  };

  /**
   * Convert ZAR to current currency and format
   */
  const convertAndFormatPrice = (zarAmount: number): string => {
    const converted = convertPrice(zarAmount);
    return formatPrice(converted);
  };

  /**
   * Parse price string (e.g., "R39,000") and convert to current currency
   */
  const parseAndConvert = (priceStr: string): string => {
    const zarAmount = parsePriceString(priceStr);
    return convertAndFormatPrice(zarAmount);
  };

  const getCurrencySymbol = (): string => {
    return CURRENCY_CONFIGS[currency].symbol;
  };

  const getCurrencyConfig = () => {
    return CURRENCY_CONFIGS[currency];
  };

  return {
    currency,
    setCurrency: changeCurrency,
    convertPrice,
    formatPrice,
    convertAndFormatPrice,
    parseAndConvert,
    getCurrencySymbol,
    getCurrencyConfig,
    isLoading,
    isClient,
    currencies: Object.values(CURRENCY_CONFIGS),
  };
};

