import { COUNTRIES, type Locale } from './config';
import ru, { type Dictionary } from './dictionaries/ru';

const DICTIONARIES: Record<Locale, Dictionary> = { ru };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export function getCountry(locale: Locale) {
  return COUNTRIES[locale];
}

export type { Dictionary };
