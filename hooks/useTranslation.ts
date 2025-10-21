/**
 * Translation Hook - Automatic language detection based on browser settings
 * Usage: const { t, language } = useTranslation();
 */

import { useState, useEffect } from 'react';
import { 
  detectBrowserLanguage, 
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
    // Automatically detect browser language on every render
    const detectedLang = detectBrowserLanguage();
    setLanguage(detectedLang);
  }, []);

  const t = (key: string): string => {
    if (!isClient) return key; // Return key during SSR
    return translate(key, language);
  };

  return {
    t,
    language,
    languages: SUPPORTED_LANGUAGES,
    isClient,
  };
};

