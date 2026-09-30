import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '../lib/assistant/types';
import { dictionaries, type StringKey } from './strings';

type Vars = Record<string, string | number>;

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: StringKey, vars?: Vars) => string;
  relativeTime: (iso: string | undefined) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'mahaaai.assistant.locale';

function initialLocale(fallback: Locale): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'te') return stored;
  } catch {
    /* storage unavailable — use fallback */
  }
  return fallback;
}

export function I18nProvider({ children, defaultLocale = 'en' }: { children: ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale(defaultLocale));

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nValue>(() => {
    const dict = dictionaries[locale];
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    return {
      locale,
      setLocale,
      t: (key, vars) =>
        dict[key].replace(/\{(\w+)\}/g, (m, name: string) => (vars && name in vars ? String(vars[name]) : m)),
      relativeTime: (iso) => {
        if (!iso) return dict.state_unknown;
        const minutes = Math.round((new Date(iso).getTime() - Date.now()) / 60_000);
        if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
        const hours = Math.round(minutes / 60);
        if (Math.abs(hours) < 48) return rtf.format(hours, 'hour');
        return rtf.format(Math.round(hours / 24), 'day');
      },
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
