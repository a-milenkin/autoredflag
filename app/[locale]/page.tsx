import Link from 'next/link';
import { notFound } from 'next/navigation';
import HeroArt from '@/components/art/HeroArt';
import { FlagsArt, VerdictArt, WorldArt } from '@/components/art/BenefitArt';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import PricingCards from '@/components/PricingCards';
import SearchBox from '@/components/SearchBox';
import { getCountry, getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { allRows } from '@/lib/provider/vinTable';

const VERDICT_TONE: Record<string, { ring: string; badge: string }> = {
  walk: { ring: 'border-flag/40', badge: 'bg-flag text-white' },
  negotiate: { ring: 'border-warn/40', badge: 'bg-warn text-white' },
  buy: { ring: 'border-ok/40', badge: 'bg-ok text-white' },
};


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
        <section className="container-page pt-8 lg:pt-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <a href="#benefits" className="inline-flex items-center gap-4 rounded-2xl bg-flag-soft py-2.5 pl-3 pr-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-flag text-white"><Icon name="flag" className="h-5 w-5" /></span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold">{t.promo.title}</span>
                  <span className="block text-sm text-ink-soft">{t.promo.text}</span>
                </span>
                <span className="whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-sm font-medium">{t.promo.button}</span>
              </a>
              <h1 className="mt-6 text-[34px] font-bold leading-[1.1] tracking-tight sm:text-[44px]">{t.hero.title}</h1>
              <p className="mt-4 max-w-xl text-[18px] leading-relaxed text-ink">{t.hero.subtitle}</p>
              <div className="mt-7">
                <SearchBox locale={locale} t={t.search} sampleHref={`/${locale}/report/${country.examples.vin}`} />
              </div>
            </div>
            <HeroArt className="mx-auto w-full max-w-[520px]" />
          </div>

          {/* Зарубежные отчёты */}
          <Link href={`/${locale}/world`} className="mt-10 flex items-center gap-4 rounded-2xl bg-mist px-5 py-4 transition-colors hover:bg-[#E9EBEE]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DE2910] text-lg" aria-hidden="true">🇨🇳</span>
            <span className="flex-1">
              <span className="block font-semibold">{t.foreign.title}</span>
              <span className="block text-sm text-ink-soft">{t.foreign.text}</span>
            </span>
            <span className="hidden rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white sm:inline-block">{t.foreign.button}</span>
          </Link>

          {/* Пакеты: для себя и для бизнеса */}
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl bg-mist p-6">
              <div className="text-lg font-semibold">{t.packs.self.title}</div>
              <p className="mt-2 max-w-sm text-[15px] text-ink-soft">{t.packs.self.text}</p>
              <a href="#pricing" className="mt-5 inline-block rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white">{t.packs.self.button}</a>
              <svg viewBox="0 0 120 100" className="absolute -bottom-2 right-3 hidden h-28 sm:block" aria-hidden="true">
                <rect x="14" y="20" width="70" height="78" rx="10" fill="#fff" transform="rotate(-8 50 60)" />
                <rect x="34" y="14" width="70" height="78" rx="10" fill="#FDECEB" stroke="#E5372F" strokeOpacity="0.3" transform="rotate(6 70 50)" />
                <path d="M62 30v40M63 31h22l-5 7 5 7H63z" fill="#E5372F" stroke="#E5372F" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <div id="business" className="relative scroll-mt-24 overflow-hidden rounded-2xl bg-mist p-6">
              <div className="text-lg font-semibold">{t.packs.business.title}</div>
              <p className="mt-2 max-w-sm text-[15px] text-ink-soft">{t.packs.business.text}</p>
              <div className="mt-5 flex gap-2">
                <a href="mailto:hello@carredflag.com" className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white">{t.packs.business.button}</a>
                <a href="#audiences" className="rounded-lg bg-white px-4 py-2 text-sm font-medium">{t.packs.business.more}</a>
              </div>
              <span className="absolute bottom-5 right-5 hidden rounded-xl bg-white px-3 py-1.5 text-lg font-bold text-flag shadow-sm sm:block">API</span>
            </div>
          </div>
        </section>

        {/* Чем полезен */}
        <section id="benefits" className="container-page mt-20 scroll-mt-24">
          <h2 className="h2">{t.benefits.title}</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {t.benefits.items.map((b) => (
              <div key={b.title}>
                {b.art === 'flags' ? <FlagsArt /> : b.art === 'verdict' ? <VerdictArt /> : <WorldArt />}
                <div className="mt-5 text-xl font-semibold">{b.title}</div>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">{b.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Якорь потерь */}
        <section className="container-page mt-24">
          <h2 className="h2 max-w-3xl">{t.lossAnchor.title}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-flag-soft p-7">
              <div className="flex items-center gap-2 text-lg font-bold text-flag"><Icon name="x" /> {t.lossAnchor.without.title}</div>
              <ul className="mt-4 space-y-3">
                {t.lossAnchor.without.items.map((i) => (
                  <li key={i} className="flex gap-3 text-ink"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flag" />{i}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-ok-soft p-7">
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
                <span className="inline-flex rounded-xl bg-white p-2.5 text-flag"><Icon name={i.icon} className="h-6 w-6" /></span>
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
              <div className="text-2xl font-bold">{t.sample.title}</div>
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
                <span className="inline-flex rounded-xl bg-white p-2.5 text-ok"><Icon name={['shield', 'recall', 'lock'][i]} className="h-6 w-6" /></span>
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

        {/* 10. Для кого */}
        <section id="audiences" className="container-page mt-24 scroll-mt-24">
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
              <Link key={r.vin} href={`/${locale}/report/${r.vin}`} className="rounded-xl bg-mist px-4 py-2 text-sm font-medium hover:bg-[#E6E8EC]">
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
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.finalCta.title}</h2>
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
