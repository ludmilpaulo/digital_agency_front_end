/**
 * Translation Hook
 * Usage: const { t, language, setLanguage } = useTranslation();
 */

import { useState, useEffect } from 'react';
import { 
  detectBrowserLanguage, 
  setPreferredLanguage, 
  getCurrentLanguage,
  t as translate,
  SupportedLanguage,
  SUPPORTED_LANGUAGES
} from '@/utils/languageDetector';

export const useTranslation = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const detectedLang = detectBrowserLanguage();
    setLanguage(detectedLang);
  }, []);

  const changeLanguage = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setPreferredLanguage(newLang);
    
    // Reload page to apply new language
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const t = (key: string): string => {
    if (!isClient) return key; // Return key during SSR
    return translate(key, language);
  };

  return {
    t,
    language,
    setLanguage: changeLanguage,
    languages: SUPPORTED_LANGUAGES,
    isClient,
  };
};

