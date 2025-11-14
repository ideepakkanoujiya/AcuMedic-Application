'use client';

import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '@/context/language-context';

type Translations = { [key: string]: any };

export function useTranslation() {
  const { language } = useContext(LanguageContext);
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    async function loadTranslations() {
      try {
        const module = await import(`@/locales/${language}.json`);
        setTranslations(module.default);
      } catch (error) {
        console.warn(`Could not load translations for language: ${language}. Falling back to English.`);
        // Fallback to English if the selected language file doesn't exist
        const module = await import(`@/locales/en.json`);
        setTranslations(module.default);
      }
    }
    loadTranslations();
  }, [language]);

  const t = (key: string): string => {
    // Simple key-value lookup
    // For nested keys, you can split by '.' and reduce
    const keys = key.split('.');
    let result = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // Return the key itself if not found, so it's obvious in the UI
        return key;
      }
    }
    return typeof result === 'string' ? result : key;
  };

  return { t, language };
}
