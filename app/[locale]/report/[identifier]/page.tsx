import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ReportView from '@/components/report/ReportView';
import SearchBox from '@/components/SearchBox';
import { getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { getProvider, toPreview } from '@/lib/provider';

type Params = { params: Promise<{ locale: string; identifier: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, identifier } = await params;
  if (!isLocale(locale)) return {};
  const report = await getProvider().getReport(decodeURIComponent(identifier));
  const title = report ? `${report.vehicle.make} ${report.vehicle.model}, ${report.vehicle.year}: проверка истории` : 'Проверка авто';
  return { title, robots: { index: false, follow: true } };
}

export default async function ReportPage({ params }: Params) {
  const { locale, identifier } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const id = decodeURIComponent(identifier);
  const report = await getProvider().getReport(id);

  return (
    <>
      <Header locale={locale} t={t} compactSearch />
      <main className="container-page py-10">
        {report ? (
          <ReportView preview={toPreview(report)} locale={locale} />
        ) : (
          <div className="mx-auto max-w-2xl py-16 text-center">
            <h1 className="text-3xl font-extrabold">{t.report.notFound}</h1>
            <p className="lead mt-3">{t.report.notFoundText}</p>
            <div className="mt-8 text-left">
              <SearchBox locale={locale} t={t.search} />
            </div>
            <Link href={`/${locale}`} className="mt-6 inline-block text-sm font-semibold underline">На главную</Link>
          </div>
        )}
      </main>
      <Footer locale={locale} t={t} />
    </>
  );
}
