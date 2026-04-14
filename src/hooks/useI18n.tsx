import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'sw';

interface Translation {
  [key: string]: string | Translation;
}

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Remove static translations - use dynamic import only


// Load translations from JSON files (dynamic import)
async function loadTranslations(lang: Language): Promise<Translation> {
  try {
    const module = await import(`../i18n/${lang}.json`);
    return module.default;
  } catch {
    return {};
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translation>({});
  const [loading, setLoading] = useState(true);

  const setLang = (newLang: Language) => {
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language | null;
    const initialLang = savedLang || 'en';
    setLangState(initialLang);
  }, []);

  useEffect(() => {
    loadTranslations(lang).then(setTranslations);
    setLoading(false);
  }, [lang]);

  const t = (path: string): string => {
    const keys = path.split('.');
    let value = translations as any;
    for (const key of keys) {
      value = value[key];
      if (value === undefined || value === null) return path;
    }
    return String(value);
  };

  if (loading) return null;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

