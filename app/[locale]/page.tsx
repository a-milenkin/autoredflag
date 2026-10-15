import Link from 'next/link';
import { notFound } from 'next/navigation';
import CarPicture from '@/components/CarPicture';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import PricingCards from '@/components/PricingCards';
import SearchBox from '@/components/SearchBox';
import TeaserList from '@/components/TeaserList';
import { getCountry, getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { allRows } from '@/lib/provider/vinTable';
import type { Severity } from '@/lib/report/types';

const VERDICT_TONE: Record<string, { ring: string; badge: string }> = {
  walk: { ring: 'border-flag/40', badge: 'bg-flag text-white' },
  negotiate: { ring: 'border-warn/40', badge: 'bg-warn text-white' },
  buy: { ring: 'border-ok/40', badge: 'bg-ok text-white' },
};

const HERO_DEMO: { title: string; severity: Severity }[] = [
  { title: 'Записи о ДТП', severity: 'red' },
  { title: 'История пробега', severity: 'red' },
  { title: 'Юридическая чистота', severity: 'green' },
  { title: 'История до ввоза (Китай)', severity: 'yellow' },
  { title: 'Ввоз и растаможка', severity: 'yellow' },
  { title: 'Такси и каршеринг', severity: 'green' },
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const country = getCountry(locale);
  const popular = allRows().filter((r) => r.originCountry === 'CN').slice(0, 12);

  return (
    <>
      <Header locale={locale} t={t} />
      <main id="top">
        {/* 1. Первый экран */}
        <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper to-white">
          <div className="container-page grid items-center gap-12 py-14 lg:grid-cols-[1.15fr_1fr] lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-flag-soft px-3 py-1 text-sm font-semibold text-flag">
                <Icon name="flag" className="h-4 w-4" /> {t.hero.eyebrow}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px]">{t.hero.title}</h1>
              <p className="lead mt-5 max-w-xl">{t.hero.subtitle}</p>
              <div className="mt-8">
                <SearchBox locale={locale} t={t.search} />
              </div>
            </div>

            {/* Пример бесплатной проверки */}
            <div className="card p-5 shadow-[0_30px_60px_-30px_rgba(20,22,26,0.35)]">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-faint">
                <span>{t.teaserDemo.title}</span>
                <span className="rounded bg-paper px-2 py-0.5 normal-case tracking-normal">пример</span>
              </div>
              <div className="mt-4 flex gap-4">
                <CarPicture make="Haval" model="Jolion" color="Серый" className="h-24 w-36 shrink-0" />
                <div>
                  <div className="text-xl font-extrabold">Haval Jolion, 2023</div>
                  <div className="mt-1 text-sm text-ink-soft">VIN LGWH*************</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-flag px-2.5 py-1 text-sm font-bold text-white">
                    <Icon name="flag" className="h-4 w-4" /> 2 красных флага
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <TeaserList items={HERO_DEMO} statusLabel={t.report.statusLabel} columns={1} />
              </div>
              <p className="mt-4 border-t border-line pt-3 text-sm text-ink-soft">{t.teaserDemo.note}</p>
            </div>
          </div>
        </section>

        {/* 2. Якорь потерь */}
        <section className="container-page mt-24">
          <h2 className="h2 max-w-3xl">{t.lossAnchor.title}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-flag/20 bg-flag-soft/60 p-7">
              <div className="flex items-center gap-2 text-lg font-bold text-flag"><Icon name="x" /> {t.lossAnchor.without.title}</div>
              <ul className="mt-4 space-y-3">
                {t.lossAnchor.without.items.map((i) => (
                  <li key={i} className="flex gap-3 text-ink"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flag" />{i}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-ok/20 bg-ok-soft/70 p-7">
              <div className="flex items-center gap-2 text-lg font-bold text-ok"><Icon name="check" /> {t.lossAnchor.with.title}</div>
              <ul className="mt-4 space-y-3">
                {t.lossAnchor.with.items.map((i) => (
                  <li key={i} className="flex gap-3 text-ink"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ok" />{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. ИИ-вердикт */}
        <section className="container-page mt-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <h2 className="h2">{t.verdict.title}</h2>
              <p className="lead mt-4">{t.verdict.subtitle}</p>
              <ul className="mt-6 space-y-2">
                {t.verdict.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 font-medium"><Icon name="check" className="h-5 w-5 text-ok" strokeWidth={2.4} />{b}</li>
                ))}
              </ul>
            </div>
            <div className="grid gap-3">
              {t.verdict.cards.map((c) => (
                <div key={c.label} className={`flex gap-4 rounded-2xl border-2 bg-white p-5 ${VERDICT_TONE[c.tone].ring}`}>
                  <span className={`h-fit shrink-0 rounded-lg px-3 py-1 text-sm font-bold ${VERDICT_TONE[c.tone].badge}`}>{c.label}</span>
                  <p className="text-ink">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Что проверяем */}
        <section className="container-page mt-24">
          <h2 className="h2">{t.contents.title}</h2>
          <p className="lead mt-3 max-w-2xl">{t.contents.subtitle}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.contents.items.map((i) => (
              <div key={i.title} className="card p-5">
                <span className="inline-flex rounded-xl bg-paper p-2.5 text-ink"><Icon name={i.icon} className="h-6 w-6" /></span>
                <div className="mt-4 font-bold">{i.title}</div>
                <div className="mt-1 text-sm text-ink-soft">{i.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Пример отчёта */}
        <section className="container-page mt-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-ink p-8 text-white sm:flex-row sm:items-center">
            <div>
              <div className="text-2xl font-extrabold">{t.sample.title}</div>
              <p className="mt-2 text-white/70">{t.sample.text}</p>
            </div>
            <Link href={`/${locale}/report/${country.examples.vin}`} className="btn-primary shrink-0">
              {t.sample.cta} <Icon name="arrow" />
            </Link>
          </div>
        </section>

        {/* 6. Тарифы */}
        <section id="pricing" className="container-page mt-24 scroll-mt-24">
          <h2 className="h2">{t.pricing.title}</h2>
          <p className="lead mt-3">{t.pricing.subtitle}</p>
          <div className="mt-8">
            <PricingCards locale={locale} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
            <span>{t.pricing.payments}</span>
            <a href="#business" className="font-semibold text-ink underline underline-offset-4">{t.pricing.business}</a>
          </div>
        </section>

        {/* 7. Гарантии */}
        <section className="container-page mt-24">
          <h2 className="h2">{t.guarantees.title}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.guarantees.items.map((g, i) => (
              <div key={g.title} className="card p-6">
                <span className="inline-flex rounded-xl bg-ok-soft p-2.5 text-ok"><Icon name={['shield', 'recall', 'lock'][i]} className="h-6 w-6" /></span>
                <div className="mt-4 text-lg font-bold">{g.title}</div>
                <p className="mt-2 text-ink-soft">{g.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Как работает и источники */}
        <section className="container-page mt-24">
          <h2 className="h2">{t.how.title}</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {t.how.steps.map((s, i) => (
              <li key={s.title} className="card p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flag text-sm font-bold text-white">{i + 1}</span>
                <div className="mt-4 text-lg font-bold">{s.title}</div>
                <p className="mt-2 text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-2xl bg-paper p-6">
            <div className="font-bold">{t.how.sourcesTitle}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.how.sources.map((s) => (
                <span key={s} className="rounded-full border border-line bg-white px-3 py-1 text-sm">{s}</span>
              ))}
            </div>
            <p className="mt-4 text-sm text-ink-faint">{t.how.disclaimer}</p>
          </div>
        </section>

        {/* 9. Авто из-за рубежа */}
        <section className="container-page mt-24">
          <Link href={`/${locale}/world`} className="group grid gap-6 overflow-hidden rounded-2xl border border-line bg-gradient-to-r from-flag-soft to-white p-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-flag">{t.world.eyebrow}</span>
              <div className="mt-2 text-3xl font-extrabold tracking-tight">{t.world.title}</div>
              <p className="mt-3 text-ink-soft">{t.world.subtitle}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold group-hover:gap-3">Подробнее <Icon name="arrow" /></span>
            </div>
            <div className="flex flex-wrap gap-2">
              {t.world.countries.map((c) => (
                <span key={c.code} className="rounded-xl border border-line bg-white px-4 py-2 font-semibold">{c.name}</span>
              ))}
            </div>
          </Link>
        </section>

        {/* 10. Для кого */}
        <section id="business" className="container-page mt-24 scroll-mt-24">
          <h2 className="h2">{t.audiences.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.audiences.items.map((a) => (
              <div key={a.title} className="card p-6">
                <div className="text-lg font-bold">{a.title}</div>
                <p className="mt-2 text-ink-soft">{a.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 11. Популярные модели: перелинковка под SEO */}
        <section className="container-page mt-24">
          <h2 className="h2">{t.popular.title}</h2>
          <p className="lead mt-3">{t.popular.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {popular.map((r) => (
              <Link key={r.vin} href={`/${locale}/report/${r.vin}`} className="rounded-xl border border-line px-4 py-2 text-sm font-medium hover:border-ink">
                {r.make} {r.model}
              </Link>
            ))}
          </div>
        </section>

        {/* 12. FAQ */}
        <Faq t={t.faq} />

        {/* 13. Финальный призыв */}
        <section className="container-page mt-24">
          <div className="rounded-3xl bg-ink px-6 py-12 text-white sm:px-12">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t.finalCta.title}</h2>
            <p className="mt-3 text-white/70">{t.finalCta.text}</p>
            <div className="mt-8 max-w-3xl">
              <SearchBox locale={locale} t={t.search} dark />
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} t={t} />
    </>
  );
}
