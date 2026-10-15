import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BrandPhoto from '@/components/BrandPhoto';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import SearchBox from '@/components/SearchBox';
import { BRANDS, COUNTRY_META, COUNTRY_RISKS, brandsByCountry, getBrand } from '@/lib/brands/ru';
import { SRC, type SourceKey } from '@/lib/brands/sources';
import { getCountry, getDictionary } from '@/lib/i18n';
import { LOCALES, isLocale } from '@/lib/i18n/config';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => BRANDS.map((b) => ({ locale, slug: b.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const b = getBrand(slug);
  if (!isLocale(locale) || !b) return {};
  const title = `Проверка ${b.name} по VIN: типичные проблемы и риски | AutoRedFlag`;
  const description = `Что чаще всего ломается у ${b.name} (${b.models.slice(0, 3).join(', ')}) по разборам и отзывам владельцев, риски ввоза ${COUNTRY_META[b.country].from} и как проверить машину по VIN до сделки.`;
  return { title, description, alternates: { canonical: `/${locale}/brands/${b.slug}` }, openGraph: { title, description } };
}

const REPORT_CHECKS = [
  'Пробег по всем записям, включая историю до ввоза',
  'ДТП, расчёты ремонта и страховые случаи',
  'Залог, ограничения и розыск',
  'Работа в такси и каршеринге',
  'Аукционы, экспорт и растаможка',
  'Отзывные кампании по VIN',
];

export default async function BrandPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const b = getBrand(slug);
  if (!isLocale(locale) || !b) notFound();
  const t = getDictionary(locale);
  const country = getCountry(locale);
  const meta = COUNTRY_META[b.country];
  const risks = COUNTRY_RISKS[b.country];
  const siblings = brandsByCountry(b.country).filter((x) => x.slug !== b.slug);

  const used = new Set<SourceKey>([...b.problems.map((p) => p.src), ...risks.map((r) => r.src)]);
  if (b.importNote) used.add(b.importNote.src);
  const sources = [...used].map((k) => SRC[k]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Марки', item: `${SITE_URL}/${locale}/brands` },
      { '@type': 'ListItem', position: 3, name: b.name, item: `${SITE_URL}/${locale}/brands/${b.slug}` },
    ],
  };

  return (
    <>
      <Header locale={locale} t={t} />
      <main id="top">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <section className="container-page pt-6">
          <nav aria-label="Хлебные крошки" className="text-sm text-ink-soft">
            <Link href={`/${locale}`} className="hover:text-ink">Главная</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/brands`} className="hover:text-ink">Марки</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{b.name}</span>
          </nav>
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-flag-soft px-3 py-1 text-sm font-semibold text-flag">
                <span aria-hidden="true">{meta.flag}</span> Авто {meta.from}
              </span>
              <h1 className="mt-4 text-[32px] font-bold leading-[1.1] sm:text-[42px]">Проверка {b.name} по VIN и госномеру</h1>
              <p className="lead mt-4 max-w-xl">{b.lead}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {b.models.map((m) => (
                  <span key={m} className="rounded-lg bg-mist px-3 py-1.5 text-sm font-medium">{m}</span>
                ))}
              </div>
              <div className="mt-7">
                <SearchBox locale={locale} t={t.search} sampleHref={`/${locale}/report/${country.examples.vin}`} />
              </div>
            </div>
            <BrandPhoto brand={b} priority credit className="aspect-[3/2] w-full rounded-3xl" />
          </div>
        </section>

        <section className="container-page mt-20">
          <h2 className="h2">Что чаще всего ломается у {b.name}</h2>
          <p className="lead mt-3 max-w-3xl">
            Собрали из открытых разборов и отзывов владельцев. Каждый пункт - повод проверить конкретный узел на осмотре и посмотреть историю обслуживания по VIN.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {b.problems.map((p) => (
              <article key={p.title} className="card p-6">
                <div className="flex items-center gap-2">
                  <Icon name="flag" className="size-5 shrink-0 text-flag" />
                  <h3 className="text-lg font-bold leading-snug">{p.title}</h3>
                </div>
                <p className="mt-3 text-ink-soft">{p.text}</p>
                <a href={SRC[p.src].url} target="_blank" rel="nofollow noopener" className="mt-3 inline-block text-xs text-ink-faint underline hover:text-ink-soft">
                  Источник
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="container-page mt-20">
          <h2 className="h2">Риски, если машина {meta.from}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {risks.map((r) => (
              <article key={r.title} className="rounded-2xl bg-flag-soft p-6">
                <h3 className="text-lg font-bold">{r.title}</h3>
                <p className="mt-2 text-ink-soft">{r.text}</p>
              </article>
            ))}
          </div>
          {b.importNote && (
            <p className="mt-6 max-w-3xl rounded-2xl border border-line p-6 text-[17px] leading-relaxed">
              <span className="font-semibold">Про {b.name} отдельно. </span>
              {b.importNote.text}
            </p>
          )}
        </section>

        <section className="container-page mt-20 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="h2">Что покажет отчёт по {b.name}</h2>
            <p className="lead mt-3">Вбиваете VIN или госномер, получаете бесплатную часть за пару секунд и видите, есть ли красные флаги.</p>
            <ul className="mt-6 space-y-3">
              {REPORT_CHECKS.map((c) => (
                <li key={c} className="flex gap-3 text-lg">
                  <Icon name="check" className="mt-1 size-5 shrink-0 text-ok" strokeWidth={2.4} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-ink p-8 text-white sm:p-10">
            <div className="text-2xl font-bold">Проверьте {b.name} до задатка</div>
            <p className="mt-3 text-white/70">Отчёт стоит меньше, чем замена любого узла из списка выше.</p>
            <div className="mt-6">
              <SearchBox locale={locale} t={t.search} dark />
            </div>
          </div>
        </section>

        <section className="container-page mt-20">
          <h2 className="text-xl font-bold">Источники</h2>
          <p className="mt-2 max-w-3xl text-sm text-ink-soft">
            Это жалобы из открытых материалов, они описывают типичные случаи. Конкретная машина может быть в полном порядке, и отчёт по VIN помогает это понять.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="nofollow noopener" className="text-ink-soft underline hover:text-ink">{s.title}</a>
              </li>
            ))}
          </ul>
        </section>

        {siblings.length > 0 && (
          <section className="container-page mt-16">
            <h2 className="text-xl font-bold">Другие марки {meta.from}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {siblings.map((s) => (
                <Link key={s.slug} href={`/${locale}/brands/${s.slug}`} className="rounded-xl bg-mist px-4 py-2 text-sm font-medium hover:bg-[#E6E8EC]">
                  {s.name}
                </Link>
              ))}
              <Link href={`/${locale}/brands`} className="rounded-xl px-4 py-2 text-sm font-medium text-flag hover:underline">Все марки</Link>
            </div>
          </section>
        )}
      </main>
      <Footer locale={locale} t={t} />
    </>
  );
}
