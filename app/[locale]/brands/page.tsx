import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BrandPhoto from '@/components/BrandPhoto';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SearchBox from '@/components/SearchBox';
import { COUNTRY_META, brandsByCountry, type BrandCountry } from '@/lib/brands/ru';
import { getCountry, getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = 'Проверка авто по маркам: Китай, Япония, Корея | AutoRedFlag';
  const description = 'Типичные проблемы Haval, Chery, Geely, Toyota, Honda, Hyundai, Kia и других марок, которые везут в Россию. Что проверить до покупки и как проверить машину по VIN.';
  return { title, description, alternates: { canonical: `/${locale}/brands` } };
}

const ORDER: { c: BrandCountry; title: string }[] = [
  { c: 'CN', title: 'Китайские марки' },
  { c: 'JP', title: 'Японские марки' },
  { c: 'KR', title: 'Корейские марки' },
];

export default async function Brands({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const country = getCountry(locale);

  return (
    <>
      <Header locale={locale} t={t} />
      <main id="top">
        <section className="container-page pt-10">
          <h1 className="text-[32px] font-bold leading-[1.1] sm:text-[44px]">Проверка авто по маркам</h1>
          <p className="lead mt-4 max-w-2xl">
            Марки, которые сейчас чаще всего везут в Россию из Китая, Японии и Кореи. Для каждой собрали типичные поломки из открытых разборов и риски ввоза, которые стоит закрыть отчётом по VIN.
          </p>
          <div className="mt-7 max-w-2xl">
            <SearchBox locale={locale} t={t.search} sampleHref={`/${locale}/report/${country.examples.vin}`} />
          </div>
        </section>

        {ORDER.map(({ c, title }) => (
          <section key={c} className="container-page mt-16">
            <h2 className="h2">
              <span aria-hidden="true">{COUNTRY_META[c].flag}</span> {title}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {brandsByCountry(c).map((b) => (
                <Link key={b.slug} href={`/${locale}/brands/${b.slug}`} className="group overflow-hidden rounded-2xl bg-mist">
                  <BrandPhoto brand={b} w={600} h={400} className="aspect-[3/2] w-full transition-opacity group-hover:opacity-90" />
                  <div className="p-4">
                    <div className="font-bold">{b.name}</div>
                    <div className="mt-1 line-clamp-1 text-sm text-ink-soft">{b.models.slice(0, 3).join(', ')}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer locale={locale} t={t} />
    </>
  );
}
