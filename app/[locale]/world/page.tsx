import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import PricingCards from '@/components/PricingCards';
import SearchBox from '@/components/SearchBox';
import { getCountry, getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { allRows } from '@/lib/provider/vinTable';

const FLAGS: Record<string, string> = { CN: '🇨🇳', KR: '🇰🇷', JP: '🇯🇵', US: '🇺🇸', AE: '🇦🇪', DE: '🇪🇺' };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.meta.worldTitle, description: t.meta.worldDescription, alternates: { canonical: `/${locale}/world` } };
}

export default async function World({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const country = getCountry(locale);
  const cnModels = allRows().filter((r) => r.originCountry === 'CN');
  const otherModels = allRows().filter((r) => ['KR', 'JP', 'US'].includes(r.originCountry)).slice(0, 8);

  return (
    <>
      <Header locale={locale} t={t} />
      <main id="top">
        <section>
          <div className="container-page py-14 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-full bg-flag-soft px-3 py-1 text-sm font-semibold text-flag">
              <Icon name="globe" className="h-4 w-4" /> {t.world.eyebrow}
            </span>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">{t.world.title}</h1>
            <p className="lead mt-5 max-w-2xl">{t.world.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {t.world.countries.map((c) => (
                <span key={c.code} className="inline-flex items-center gap-2 rounded-xl bg-mist px-3.5 py-2 font-medium">
                  <span aria-hidden="true">{FLAGS[c.code]}</span>
                  {c.name}
                </span>
              ))}
            </div>
            <div className="mt-8 max-w-3xl">
              <SearchBox locale={locale} t={t.search} sampleHref={`/${locale}/report/${country.examples.vin}`} />
            </div>
          </div>
        </section>

        <section className="container-page mt-20">
          <h2 className="h2">{t.world.risksTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.world.risks.map((r) => (
              <div key={r.title} className="rounded-2xl bg-flag-soft p-6">
                <Icon name="flag" className="h-6 w-6 text-flag" />
                <div className="mt-3 text-lg font-bold">{r.title}</div>
                <p className="mt-2 text-ink-soft">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-page mt-20 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="h2">{t.world.reportTitle}</h2>
            <ul className="mt-6 space-y-3">
              {t.world.reportItems.map((i) => (
                <li key={i} className="flex gap-3 text-lg">
                  <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-ok" strokeWidth={2.4} />
                  {i}
                </li>
              ))}
            </ul>
            <Link href={`/${locale}/report/${country.examples.vin}`} className="btn-dark mt-8">
              {t.sample.cta} <Icon name="arrow" />
            </Link>
          </div>
          <div className="rounded-2xl bg-ink p-8 text-white">
            <div className="text-sm font-semibold uppercase tracking-wider text-flag">🇨🇳 {t.world.countries[0].name}</div>
            <div className="mt-2 text-2xl font-bold">{t.world.chinaTitle}</div>
            <p className="mt-3 text-white/70">{t.world.chinaText}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {cnModels.map((r) => (
                <Link key={r.vin} href={`/${locale}/report/${r.vin}`} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20">
                  {r.make} {r.model}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page mt-20">
          <h2 className="h2">{t.popular.title}</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {otherModels.map((r) => (
              <Link key={r.vin} href={`/${locale}/report/${r.vin}`} className="rounded-xl bg-mist px-4 py-2 text-sm font-medium hover:bg-[#E6E8EC]">
                {FLAGS[r.originCountry]} {r.make} {r.model}
              </Link>
            ))}
          </div>
        </section>

        <section id="pricing" className="container-page mt-20">
          <h2 className="h2">{t.pricing.title}</h2>
          <p className="lead mt-3">{t.pricing.subtitle}</p>
          <div className="mt-8">
            <PricingCards locale={locale} />
          </div>
        </section>

        <Faq t={t.faq} />
      </main>
      <Footer locale={locale} t={t} />
    </>
  );
}
