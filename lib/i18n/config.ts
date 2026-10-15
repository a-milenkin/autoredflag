// Страны и языки. Сейчас включена только /ru, остальные добавляются
// новым словарём в lib/i18n/dictionaries и записью в COUNTRIES.

export const LOCALES = ['ru'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ru';

export type PricePlan = {
  id: string;
  reports: number;
  price: number; // в валюте страны
  validDays: number | null; // null = не сгорают
  highlight?: boolean;
};

export type CountryConfig = {
  locale: Locale;
  htmlLang: string;
  currency: string;
  currencySymbol: string;
  plans: PricePlan[];
  paymentMethods: string[];
  // Пример идентификаторов для плейсхолдера и демо-ссылок
  examples: { plate: string; vin: string };
};

export const COUNTRIES: Record<Locale, CountryConfig> = {
  ru: {
    locale: 'ru',
    htmlLang: 'ru',
    currency: 'RUB',
    currencySymbol: '₽',
    plans: [
      { id: 'one', reports: 1, price: 349, validDays: null },
      { id: 'three', reports: 3, price: 790, validDays: null, highlight: true },
      { id: 'ten', reports: 10, price: 1990, validDays: null },
      { id: 'fifty', reports: 50, price: 7490, validDays: null },
    ],
    paymentMethods: ['Банковская карта', 'СБП', 'SberPay'],
    examples: { plate: 'С908КХ163', vin: 'LGWHBUSRJGF4CBFPR' },
  },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function formatPrice(value: number, country: CountryConfig): string {
  return `${new Intl.NumberFormat(country.htmlLang).format(value)} ${country.currencySymbol}`;
}
