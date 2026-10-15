import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BrandPhoto from '@/components/BrandPhoto';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import SearchBox from '@/components/SearchBox';
import { COUNTRY_META, COUNTRY_RISKS, getBrand } from '@/lib/brands/ru';
import { SRC, type SourceKey } from '@/lib/brands/sources';
import { getCountry, getDictionary } from '@/lib/i18n';
import { LOCALES, isLocale } from '@/lib/i18n/config';
import { MODELS, getModel, modelsOf } from '@/lib/models/ru';
import { SITE_URL } from '@/lib/site';

function plural(n: number) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return 'слабое место';
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return 'слабых места';
  return 'слабых мест';
}

type Params = Promise<{ locale: string; slug: string; model: string }>;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => MODELS.map((m) => ({ locale, slug: m.brand, model: m.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug, model } = await params;
  const m = getModel(slug, model);
  if (!isLocale(locale) || !m) return {};
  const title = `${m.name}: слабые места и болячки, проверка по VIN | AutoRedFlag`;
  const description = `Что ломается у ${m.name}: ${m.problems.slice(0, 3).map((p) => p.title.toLowerCase()).join(', ')}. На что смотреть на осмотре и как проверить историю по VIN до задатка.`;
  return { title, description, alternates: { canonical: `/${locale}/brands/${slug}/${model}` }, openGraph: { title, description } };
}

export default async function ModelPage({ params }: { params: Params }) {
  const { locale, slug, model } = await params;
  const m = getModel(slug, model);
  const b = getBrand(slug);
  if (!isLocale(locale) || !m || !b) notFound();
  const t = getDictionary(locale);
  const country = getCountry(locale);
  const meta = COUNTRY_META[b.country];
  const risks = COUNTRY_RISKS[b.country];
  const siblings = modelsOf(b.slug).filter((x) => x.slug !== m.slug);

  const used = new Set<SourceKey>([...m.problems.map((p) => p.src), ...m.faq.map((f) => f.src), ...risks.map((r) => r.src)]);
  const sources = [...used].map((k) => SRC[k]);
  const url = `${SITE_URL}/${locale}/brands/${b.slug}/${m.slug}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE_URL}/${locale}` },
        { '@type': 'ListItem', position: 2, name: 'Марки', item: `${SITE_URL}/${locale}/brands` },
        { '@type': 'ListItem', position: 3, name: b.name, item: `${SITE_URL}/${locale}/brands/${b.slug}` },
        { '@type': 'ListItem', position: 4, name: m.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: m.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];

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
            <Link href={`/${locale}/brands/${b.slug}`} className="hover:text-ink">{b.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{m.name}</span>
          </nav>
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-flag-soft px-3 py-1 text-sm font-semibold text-flag">
                <span aria-hidden="true">{meta.flag}</span> {m.problems.length} {plural(m.problems.length)} по открытым разборам
              </span>
              <h1 className="mt-4 text-[32px] font-bold leading-[1.1] sm:text-[42px]">{m.name}: слабые места и что проверить перед покупкой</h1>
              <p className="lead mt-4 max-w-xl">{m.lead}</p>
              <p className="mt-3 text-sm text-ink-faint">Разборы касаются: {m.covers}.</p>
              <div className="mt-7">
                <SearchBox locale={locale} t={t.search} sampleHref={`/${locale}/report/${country.examples.vin}`} />
              </div>
            </div>
            <BrandPhoto brand={b} photo={m.photo} label={m.photo ? m.name : b.name} priority credit className="aspect-[3/2] w-full rounded-3xl" />
          </div>
        </section>

        <section className="container-page mt-20">
          <h2 className="h2">Болячки {m.name}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {m.problems.map((p) => (
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

        <section className="container-page mt-20 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="h2">Что проверить на осмотре</h2>
            <ul className="mt-6 space-y-3">
              {m.inspect.map((c) => (
                <li key={c} className="flex gap-3 text-lg">
                  <Icon name="check" className="mt-1 size-5 shrink-0 text-ok" strokeWidth={2.4} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-ink p-8 text-white sm:p-10">
            <div className="text-2xl font-bold">Сначала история, потом осмотр</div>
            <p className="mt-3 text-white/70">
              Отчёт по VIN покажет пробег по записям, ДТП, залоги, такси, отзывные кампании и историю до ввоза. Если там красный флаг, на осмотр можно не ехать.
            </p>
            <div className="mt-6">
              <SearchBox locale={locale} t={t.search} dark />
            </div>
          </div>
        </section>

        <section className="container-page mt-20">
          <h2 className="h2">Риски, если {m.name} {meta.from}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {risks.map((r) => (
              <article key={r.title} className="rounded-2xl bg-flag-soft p-6">
                <h3 className="text-lg font-bold">{r.title}</h3>
                <p className="mt-2 text-ink-soft">{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container-page mt-20 max-w-4xl">
          <h2 className="h2">Частые вопросы про {m.name}</h2>
          <div className="mt-6 divide-y divide-line rounded-2xl border border-line">
            {m.faq.map((f) => (
              <details key={f.q} className="group p-5" open>
                <summary className="cursor-pointer list-none text-lg font-semibold">{f.q}</summary>
                <p className="mt-2 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="container-page mt-16">
          <h2 className="text-xl font-bold">Источники</h2>
          <p className="mt-2 max-w-3xl text-sm text-ink-soft">
            Это типичные случаи из открытых материалов. Конкретная машина может быть в порядке, и отчёт по VIN помогает это понять.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="nofollow noopener" className="text-ink-soft underline hover:text-ink">{s.title}</a>
              </li>
            ))}
          </ul>
        </section>

        <section className="container-page mt-16">
          <h2 className="text-xl font-bold">Ещё по {b.name}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {siblings.map((s) => (
              <Link key={s.slug} href={`/${locale}/brands/${b.slug}/${s.slug}`} className="rounded-xl bg-mist px-4 py-2 text-sm font-medium hover:bg-[#E6E8EC]">
                {s.name}
              </Link>
            ))}
            <Link href={`/${locale}/brands/${b.slug}`} className="rounded-xl px-4 py-2 text-sm font-medium text-flag hover:underline">Все проблемы {b.name}</Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} t={t} />
    </>
  );
}
