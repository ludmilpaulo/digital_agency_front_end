/**
 * Currency Conversion Utility
 * Detects user location and converts ZAR prices to local currency
 */

export type SupportedCurrency = 'ZAR' | 'USD' | 'EUR' | 'GBP' | 'BRL' | 'CNY' | 'SAR' | 'AED';

interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string;
  country: string;
}

export const CURRENCY_CONFIGS: Record<SupportedCurrency, CurrencyConfig> = {
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', country: 'ZA' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', country: 'US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', country: 'EU' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', country: 'GB' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', country: 'BR' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', country: 'CN' },
  SAR: { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal', flag: '🇸🇦', country: 'SA' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', country: 'AE' },
};

// Approximate exchange rates (ZAR as base)
// Note: In production, fetch from API like exchangerate-api.com
export const EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  ZAR: 1,       // Base currency
  USD: 0.055,   // 1 ZAR = 0.055 USD (approx)
  EUR: 0.050,   // 1 ZAR = 0.050 EUR (approx)
  GBP: 0.043,   // 1 ZAR = 0.043 GBP (approx)
  BRL: 0.27,    // 1 ZAR = 0.27 BRL (approx)
  CNY: 0.39,    // 1 ZAR = 0.39 CNY (approx)
  SAR: 0.21,    // 1 ZAR = 0.21 SAR (approx)
  AED: 0.20,    // 1 ZAR = 0.20 AED (approx)
};

// Country to currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, SupportedCurrency> = {
  'ZA': 'ZAR', // South Africa
  'US': 'USD', // United States
  'GB': 'GBP', // United Kingdom
  'EU': 'EUR', // European Union
  'DE': 'EUR', // Germany
  'FR': 'EUR', // France
  'ES': 'EUR', // Spain
  'IT': 'EUR', // Italy
  'BR': 'BRL', // Brazil
  'PT': 'EUR', // Portugal
  'CN': 'CNY', // China
  'SA': 'SAR', // Saudi Arabia
  'AE': 'AED', // UAE
};

/**
 * Detect user's country and currency
 */
export const detectUserCurrency = async (): Promise<SupportedCurrency> => {
  if (typeof window === 'undefined') return 'ZAR';

  // Check localStorage first
  const stored = localStorage.getItem('preferred-currency');
  if (stored && stored in CURRENCY_CONFIGS) {
    return stored as SupportedCurrency;
  }

  try {
    // Use free IP geolocation API
    const response = await fetch('https://ipapi.co/json/', {
      cache: 'force-cache',
    });
    
    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country_code || 'ZA';
      const currency = COUNTRY_CURRENCY_MAP[countryCode] || 'ZAR';
      
      // Store for future use
      localStorage.setItem('user-country', countryCode);
      localStorage.setItem('detected-currency', currency);
      
      return currency;
    }
  } catch (error) {
    console.warn('Currency detection failed, using default (ZAR):', error);
  }

  return 'ZAR'; // Default to South African Rand
};

/**
 * Convert ZAR amount to target currency
 */
export const convertCurrency = (
  zarAmount: number,
  targetCurrency: SupportedCurrency = 'ZAR'
): number => {
  if (targetCurrency === 'ZAR') return zarAmount;
  
  const rate = EXCHANGE_RATES[targetCurrency];
  return zarAmount * rate;
};

/**
 * Format currency for display
 */
export const formatCurrency = (
  amount: number,
  currency: SupportedCurrency = 'ZAR',
  includeSymbol: boolean = true
): string => {
  const config = CURRENCY_CONFIGS[currency];
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return includeSymbol ? `${config.symbol}${formatted}` : formatted;
};

/**
 * Convert and format ZAR price to user's currency
 */
export const convertAndFormat = async (zarAmount: number): Promise<string> => {
  const userCurrency = await detectUserCurrency();
  const converted = convertCurrency(zarAmount, userCurrency);
  return formatCurrency(converted, userCurrency);
};

/**
 * Parse price string and extract amount
 * Handles: "R39,000", "$5,000", "€10,000"
 */
export const parsePriceString = (priceStr: string): number => {
  const numbers = priceStr.replace(/[^\d.]/g, '');
  return parseFloat(numbers) || 0;
};

/**
 * Set user's preferred currency
 */
export const setPreferredCurrency = (currency: SupportedCurrency): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('preferred-currency', currency);
};

/**
 * Get current currency
 */
export const getCurrentCurrency = (): SupportedCurrency => {
  if (typeof window === 'undefined') return 'ZAR';
  
  const stored = localStorage.getItem('preferred-currency') || 
                 localStorage.getItem('detected-currency');
  
  if (stored && stored in CURRENCY_CONFIGS) {
    return stored as SupportedCurrency;
  }
  
  return 'ZAR';
};

/**
 * Update exchange rates from API (for production use)
 */
export const updateExchangeRates = async (): Promise<boolean> => {
  try {
    // Using free API (limited to 1500 requests/month)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/ZAR');
    
    if (response.ok) {
      const data = await response.json();
      const rates = data.rates;
      
      // Update rates
      if (rates) {
        EXCHANGE_RATES.USD = rates.USD || EXCHANGE_RATES.USD;
        EXCHANGE_RATES.EUR = rates.EUR || EXCHANGE_RATES.EUR;
        EXCHANGE_RATES.GBP = rates.GBP || EXCHANGE_RATES.GBP;
        EXCHANGE_RATES.BRL = rates.BRL || EXCHANGE_RATES.BRL;
        EXCHANGE_RATES.CNY = rates.CNY || EXCHANGE_RATES.CNY;
        EXCHANGE_RATES.SAR = rates.SAR || EXCHANGE_RATES.SAR;
        EXCHANGE_RATES.AED = rates.AED || EXCHANGE_RATES.AED;
        
        // Store in localStorage with timestamp
        localStorage.setItem('exchange-rates', JSON.stringify(EXCHANGE_RATES));
        localStorage.setItem('exchange-rates-updated', new Date().toISOString());
        
        return true;
      }
    }
  } catch (error) {
    console.error('Failed to update exchange rates:', error);
  }
  
  return false;
};

/**
 * Check if rates need updating (older than 24 hours)
 */
export const shouldUpdateRates = (): boolean => {
  const lastUpdate = localStorage.getItem('exchange-rates-updated');
  if (!lastUpdate) return true;
  
  const lastUpdateTime = new Date(lastUpdate).getTime();
  const now = new Date().getTime();
  const hoursSinceUpdate = (now - lastUpdateTime) / (1000 * 60 * 60);
  
  return hoursSinceUpdate >= 24;
};

/**
 * Initialize currency system (call on app load)
 */
export const initCurrency = async (): Promise<void> => {
  // Update rates if needed
  if (shouldUpdateRates()) {
    await updateExchangeRates();
  }
  
  // Detect user currency
  await detectUserCurrency();
};

