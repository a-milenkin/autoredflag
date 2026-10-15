import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { LOCALES, isLocale } from '@/lib/i18n/config';
import { getCountry, getDictionary } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: t.meta.title,
    description: t.meta.description,
    alternates: { canonical: `/${locale}`, languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])) },
    openGraph: { title: t.meta.title, description: t.meta.description, siteName: t.brand, locale, type: 'website' },
  };
}

export const viewport: Viewport = { themeColor: '#14161A', width: 'device-width', initialScale: 1 };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={getCountry(locale).htmlLang}>
      <body>{children}</body>
    </html>
  );
}
