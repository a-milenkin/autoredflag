'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import CarPicture from '@/components/CarPicture';
import Icon from '@/components/Icon';
import PricingCards from '@/components/PricingCards';
import TeaserList from '@/components/TeaserList';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { prettyPlate } from '@/lib/identify';
import { countryName } from '@/lib/report/mock';
import type { Report, ReportPreview } from '@/lib/report/types';
import FullReport from './FullReport';

const STORAGE_KEY = 'crf_unlocked';

function readUnlocked(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function rememberUnlocked(id: string) {
  try {
    const list = new Set(readUnlocked());
    list.add(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...list].slice(-50)));
  } catch {
    /* хранилище недоступно: просто не запоминаем */
  }
}

export default function ReportView({ preview, locale }: { preview: ReportPreview; locale: Locale }) {
  const t = getDictionary(locale);
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const v = preview.vehicle;

  const unlock = useCallback(
    async (planId: string) => {
      setBusy(true);
      try {
        const res = await fetch('/api/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: preview.id, planId }),
        });
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
          rememberUnlocked(preview.id);
          requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
      } finally {
        setBusy(false);
      }
    },
    [preview.id],
  );

  // Если отчёт уже открывали в этом браузере, сразу показываем полный
  useEffect(() => {
    if (readUnlocked().includes(preview.id)) unlock('restored');
  }, [preview.id, unlock]);

  if (report) return <FullReport report={report} locale={locale} />;

  const flagTone =
    preview.redFlags > 0 ? 'bg-flag text-white' : preview.warnings > 0 ? 'bg-warn text-white' : 'bg-ok text-white';

  return (
    <div>
      {/* Шапка: машина и что нашли */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {v.make} {v.model}, {v.year}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-ink-soft">
            <span>
              {t.report.vin} <b className="font-semibold text-ink">{v.vinMasked}</b>
            </span>
            {v.plate && (
              <span>
                {t.report.plate} <b className="font-semibold text-ink">{prettyPlate(v.plate)}</b>
              </span>
            )}
          </div>
          <CarPicture make={v.make} model={v.model} color={v.color} className="mt-5 aspect-[16/9] w-full max-w-md" />
          <dl className="mt-5 grid max-w-md grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <dt className="text-ink-soft">{t.report.origin}</dt>
            <dd className="font-medium">{countryName(v.originCountry)}</dd>
            <dt className="text-ink-soft">{t.report.specs.engine}</dt>
            <dd className="font-medium">{v.engine}</dd>
            <dt className="text-ink-soft">{t.report.specs.power}</dt>
            <dd className="font-medium">{v.power} л.с.</dd>
            <dt className="text-ink-soft">{t.report.specs.body}</dt>
            <dd className="font-medium">{v.bodyType}</dd>
            <dt className="text-ink-soft">{t.report.specs.owners}</dt>
            <dd className="font-medium">{preview.ownersCount}</dd>
          </dl>
        </div>

        <div className="card p-6">
          <div className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-lg font-bold ${flagTone}`}>
            <Icon name={preview.redFlags ? 'flag' : preview.warnings ? 'alert' : 'check'} className="h-5 w-5" strokeWidth={2.2} />
            {t.report.found(preview.redFlags, preview.warnings)}
          </div>
          <p className="mt-3 text-sm text-ink-soft">{t.report.teaserLocked}</p>
          <div className="mt-5">
            <TeaserList items={preview.sections} statusLabel={t.report.statusLabel} />
          </div>
          <div className="mt-6 rounded-xl bg-paper p-4">
            <div className="flex items-center gap-2 font-bold">
              <Icon name="lock" className="h-4 w-4" /> {t.report.verdictTitle}: {t.report.decision.buy} / {t.report.decision.negotiate} / {t.report.decision.walk}
            </div>
            <p className="mt-1 text-sm text-ink-soft">{t.report.unlockSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Пейвол */}
      <section id="pricing" className="mt-14 scroll-mt-24">
        <h2 className="h2">{t.report.unlockTitle}</h2>
        <p className="lead mt-2">{t.pricing.subtitle}</p>
        <div className="mt-6">
          <PricingCards locale={locale} onChoose={unlock} busy={busy} />
        </div>
        <p className="mt-3 text-sm text-ink-faint">{t.report.demoPayNote}</p>
      </section>

      {/* Гарантии рядом с оплатой */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {t.guarantees.items.map((g, i) => (
          <div key={g.title} className="flex gap-3 rounded-2xl bg-paper p-5">
            <Icon name={['shield', 'recall', 'lock'][i]} className="h-6 w-6 shrink-0 text-ok" />
            <div>
              <div className="font-bold">{g.title}</div>
              <p className="mt-1 text-sm text-ink-soft">{g.text}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-10 text-center">
        <Link href={`/${locale}`} className="text-sm font-semibold underline underline-offset-4">
          {t.report.newCheck}
        </Link>
      </div>
    </div>
  );
}
