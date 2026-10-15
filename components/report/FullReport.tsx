'use client';

import Link from 'next/link';
import CarPicture from '@/components/CarPicture';
import Icon from '@/components/Icon';
import { SEVERITY_STYLE, SeverityIcon } from '@/components/Severity';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { prettyPlate } from '@/lib/identify';
import { countryName } from '@/lib/report/mock';
import type { Report, Severity } from '@/lib/report/types';
import MileageChart from './MileageChart';

const ORDER: Record<Severity, number> = { red: 0, yellow: 1, info: 2, green: 3 };
const VERDICT_STYLE = {
  walk: { box: 'border-flag bg-flag-soft', badge: 'bg-flag', icon: 'x' },
  negotiate: { box: 'border-warn bg-warn-soft', badge: 'bg-warn', icon: 'alert' },
  buy: { box: 'border-ok bg-ok-soft', badge: 'bg-ok', icon: 'check' },
} as const;

const rub = (n: number) => `${new Intl.NumberFormat('ru-RU').format(n)} ₽`;
const date = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) : '');

export default function FullReport({ report, locale }: { report: Report; locale: Locale }) {
  const t = getDictionary(locale).report;
  const { vehicle: v, verdict } = report;
  const vs = VERDICT_STYLE[verdict.decision];
  const sections = [...report.sections].sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <CarPicture make={v.make} model={v.model} color={v.color} className="aspect-[16/9] w-full shrink-0 sm:w-64" />
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {v.make} {v.model}, {v.year}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-ink-soft">
            <span>{t.vin} <b className="font-mono font-semibold text-ink">{v.vin}</b></span>
            {v.plate && <span>{t.plate} <b className="font-semibold text-ink">{prettyPlate(v.plate)}</b></span>}
            <span>{countryName(v.originCountry)}</span>
            <span>{v.engine}, {v.power} л.с.</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-flag-soft px-3 py-1.5 text-sm font-bold text-flag">
              <Icon name="flag" className="h-4 w-4" /> Красных флагов: {report.redFlags}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-warn-soft px-3 py-1.5 text-sm font-bold text-warn">
              <Icon name="alert" className="h-4 w-4" /> Замечаний: {report.warnings}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-paper px-3 py-1.5 text-sm font-semibold text-ink-soft">
              {t.marketPrice}: {rub(v.marketPrice)}
            </span>
          </div>
        </div>
        <button onClick={() => window.print()} className="btn-ghost no-print shrink-0 py-2 text-sm">{t.print}</button>
      </div>

      {/* Вердикт */}
      <section className={`mt-8 rounded-2xl border-2 p-6 sm:p-8 ${vs.box}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-lg font-extrabold text-white ${vs.badge}`}>
            <Icon name={vs.icon} className="h-5 w-5" strokeWidth={2.6} /> {t.decision[verdict.decision]}
          </span>
          <span className="text-sm font-semibold uppercase tracking-wider text-ink-soft">ИИ-{t.verdictTitle.toLowerCase()}</span>
        </div>
        <p className="mt-4 text-2xl font-bold leading-snug">{verdict.headline}</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-ink-soft">{t.reasons}</div>
            <ul className="mt-2 space-y-2">
              {verdict.reasons.map((r) => (
                <li key={r} className="flex gap-2"><Icon name="flag" className="mt-0.5 h-4 w-4 shrink-0 text-flag" />{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-ink-soft">{t.questions}</div>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              {verdict.questions.map((q) => <li key={q}>{q}</li>)}
            </ol>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-ink-soft">{t.discount}</div>
            {verdict.discountRub ? (
              <>
                <div className="mt-2 text-3xl font-extrabold">−{rub(verdict.discountRub)}</div>
                <p className="mt-1 text-sm text-ink-soft">от рыночной цены {rub(v.marketPrice)} с учётом найденных проблем</p>
              </>
            ) : (
              <p className="mt-2 text-ink-soft">Поводов для торга по истории нет. Цена зависит от состояния на осмотре.</p>
            )}
          </div>
        </div>
      </section>

      {/* Пробег */}
      <section className="card mt-8 p-6">
        <h2 className="text-xl font-bold">{t.mileageTitle}</h2>
        <MileageChart points={report.mileage} />
      </section>

      {/* Разделы */}
      <h2 className="mt-12 text-2xl font-extrabold">{t.sectionsTitle}</h2>
      <div className="mt-5 grid gap-4">
        {sections.map((s) => {
          const st = SEVERITY_STYLE[s.severity];
          return (
            <section key={s.id} id={s.id} className={`overflow-hidden rounded-2xl border ${s.severity === 'red' ? 'border-flag/40' : 'border-line'}`}>
              <div className={`flex items-center gap-3 px-5 py-4 ${s.severity === 'red' ? 'bg-flag-soft' : s.severity === 'yellow' ? 'bg-warn-soft/70' : 'bg-white'}`}>
                <SeverityIcon severity={s.severity} />
                <div className="flex-1">
                  <div className="font-bold">{s.title}</div>
                  <div className={`text-sm font-medium ${st.text}`}>{s.summary}</div>
                </div>
              </div>
              <ul className="divide-y divide-line bg-white">
                {s.findings.map((f, i) => (
                  <li key={i} className="flex gap-3 px-5 py-3.5">
                    <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${SEVERITY_STYLE[f.severity].dot}`} />
                    <div className="flex-1">
                      <div className={`font-semibold ${f.severity === 'red' ? 'text-flag' : ''}`}>{f.title}</div>
                      {f.detail && <p className="mt-0.5 text-sm text-ink-soft">{f.detail}</p>}
                    </div>
                    {f.date && <span className="shrink-0 text-sm text-ink-faint">{date(f.date)}</span>}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-ink-faint">
        Отчёт сформирован {new Date(report.generatedAt).toLocaleString('ru-RU')}. {report.demo ? 'Демо-данные: машина и история сгенерированы.' : ''}
      </p>
      <div className="no-print mt-6">
        <Link href={`/${locale}`} className="btn-dark">{t.newCheck} <Icon name="arrow" /></Link>
      </div>
    </div>
  );
}
