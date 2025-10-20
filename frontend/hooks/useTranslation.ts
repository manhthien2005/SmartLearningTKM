import { useState, useEffect } from 'react';
import { Locale } from '@/i18n/config';

type TranslationKeys = Record<string, string>;

export function useTranslation(locale: Locale = 'vi') {
  const [translations, setTranslations] = useState<TranslationKeys>({});

  useEffect(() => {
    // Load translations dynamically
    import(`@/i18n/locales/${locale}/common.json`)
      .then((module) => setTranslations(module.default))
      .catch((error) => console.error('Failed to load translations:', error));
  }, [locale]);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return { t, locale };
}










