import id from './id.json';
import en from './en.json';

export type Locale = 'id' | 'en';
const dictionaries: Record<Locale, Record<string, string>> = { id, en };
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
const normalized = Object.fromEntries(Object.entries(dictionaries).map(([locale, messages]) => [locale, new Map(Object.entries(messages).map(([key, value]) => [normalize(key), value]))])) as Record<Locale, Map<string, string>>;
const insensitive = Object.fromEntries(Object.entries(dictionaries).map(([locale, messages]) => [locale, new Map(Object.entries(messages).map(([key, value]) => [normalize(key).toLowerCase(), value]))])) as Record<Locale, Map<string, string>>;
const patterns = Object.fromEntries(Object.entries(dictionaries).map(([locale, messages]) => [locale, Object.entries(messages).filter(([key]) => /\{\d+\}/.test(key)).map(([key, value]) => ({
  pattern: new RegExp('^' + normalize(key).split(/(\{\d+\})/).map(part => /^\{\d+\}$/.test(part) ? '(.+?)' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('') + '$'), value,
}))])) as Record<Locale, { pattern: RegExp; value: string }[]>;

/** Translate authored presentation strings only. IDs, answers and simulation logic remain canonical. */
export function translateText(text: string, locale: Locale): string {
  const trimmed = normalize(text);
  const direct = Object.prototype.hasOwnProperty.call(dictionaries[locale], text) ? dictionaries[locale][text] : normalized[locale].get(trimmed);
  const whitespace = (value: string) => (text.match(/^\s*/)?.[0] ?? '') + value.trim() + (text.match(/\s*$/)?.[0] ?? '');
  if (direct !== undefined) return whitespace(direct);
  const caseVariant = insensitive[locale].get(trimmed.toLowerCase());
  if (caseVariant !== undefined) return whitespace(trimmed === trimmed.toUpperCase() ? caseVariant.toUpperCase() : trimmed === trimmed.toLowerCase() ? caseVariant.toLowerCase() : caseVariant);
  for (const { pattern, value } of patterns[locale]) {
    const match = trimmed.match(pattern);
    if (match) return whitespace(value.replace(/\{(\d+)\}/g, (_, index: string) => translateText(match[Number(index) + 1], locale)));
  }
  // Joined terminal output and lists keep each authored entry independently translatable.
  if (text.includes('\n')) return text.split('\n').map(line => translateText(line, locale)).join('\n');
  if (text.includes(' · ')) return text.split(' · ').map(part => translateText(part, locale)).join(' · ');
  if (text.includes(' & ')) return text.split(' & ').map(part => translateText(part, locale)).join(' & ');
  return text;
}

export function translateContent<T>(value: T, locale: Locale): T {
  if (typeof value === 'string') return translateText(value, locale) as T;
  if (Array.isArray(value)) return value.map(item => translateContent(item, locale)) as T;
  return value;
}
