'use client';

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { translateContent, type Locale } from './translate';
import { usePathname } from 'next/navigation';
import pageMetadata from './metadata.json';
import { translateText } from './translate';

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({ locale: 'id', setLocale: () => {} });
export const LOCALE_KEY = 'fyp-language';
const LOCALE_EVENT = 'fyp-language-change';
let memoryLocale: Locale = 'id';

function readLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved === 'id' || saved === 'en') return saved;
  } catch { /* Fall back to session memory when storage is unavailable. */ }
  return memoryLocale;
}
function subscribe(listener: () => void) {
  const sync = (event: StorageEvent) => {
    if (event.key === LOCALE_KEY || event.key === null) {
      memoryLocale = event.newValue === 'en' ? 'en' : 'id';
      listener();
    }
  };
  window.addEventListener('storage', sync);
  window.addEventListener(LOCALE_EVENT, listener);
  return () => {
    window.removeEventListener('storage', sync);
    window.removeEventListener(LOCALE_EVENT, listener);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, () => 'id' as Locale);
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.lang = locale;
    const pages = pageMetadata as Record<string, { title: string; description: string }>;
    const metadata = pages[pathname] ?? (pathname === '/quiz/results' ? pages['/quiz'] : pages['/_not-found']);
    if (metadata) {
      document.title = translateText(metadata.title, locale);
      document.querySelector('meta[name="description"]')?.setAttribute('content', translateText(metadata.description, locale));
    }
  }, [locale, pathname]);
  const setLocale = useCallback((next: Locale) => {
    memoryLocale = next;
    try { localStorage.setItem(LOCALE_KEY, next); } catch { /* Optional persistence. */ }
    window.dispatchEvent(new Event(LOCALE_EVENT));
  }, []);
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const { locale, setLocale } = useContext(LocaleContext);
  const t = useCallback(<T,>(value: T): T => translateContent(value, locale), [locale]);
  return { t, locale, setLocale, intlLocale: locale === 'id' ? 'id-ID' : 'en-US' };
}
