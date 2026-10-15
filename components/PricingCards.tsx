'use client';

import { getCountry, getDictionary } from '@/lib/i18n';
import { formatPrice, type Locale } from '@/lib/i18n/config';

// Словарь берём внутри: в нём есть функции, а их нельзя передавать с сервера в клиентский компонент.
type Props = { locale: Locale; onChoose?: (planId: string) => void; chooseHref?: string; busy?: boolean };

export default function PricingCards({ locale, onChoose, chooseHref = '#top', busy = false }: Props) {
  const t = getDictionary(locale).pricing;
  const country = getCountry(locale);
  const single = country.plans[0].price;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {country.plans.map((p) => {
        const per = Math.round(p.price / p.reports);
        const full = single * p.reports;
        const off = p.reports > 1 ? Math.round((1 - p.price / full) * 100) : 0;
        return (
          <div key={p.id} className={`relative flex flex-col rounded-2xl p-6 ${p.highlight ? 'bg-ink text-white ring-2 ring-flag' : 'bg-mist'}`}>
            {p.highlight && <span className="absolute -top-3 left-6 rounded-full bg-flag px-3 py-1 text-xs font-bold text-white">{t.popular}</span>}
            <div className="text-lg font-bold">{p.reports === 1 ? t.one : p.reports === 3 ? t.three : t.many(p.reports)}</div>
            <div className={`mt-1 text-sm ${p.highlight ? 'text-white/70' : 'text-ink-soft'}`}>{t.forWhom[p.id]}</div>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">{formatPrice(p.price, country)}</span>
              {off > 0 && <span className={`text-sm line-through ${p.highlight ? 'text-white/50' : 'text-ink-faint'}`}>{formatPrice(full, country)}</span>}
            </div>
            <div className={`mt-1 text-sm ${p.highlight ? 'text-white/70' : 'text-ink-soft'}`}>
              {formatPrice(per, country)} {t.perReport}
              {off > 0 && <span className="ml-2 rounded-md bg-flag px-1.5 py-0.5 text-xs font-bold text-white">−{off}%</span>}
            </div>
            <div className="mt-6 flex-1" />
            {onChoose ? (
              <button disabled={busy} onClick={() => onChoose(p.id)} className={p.highlight ? 'btn-primary w-full' : 'btn-dark w-full'}>{t.choose}</button>
            ) : (
              <a href={chooseHref} className={p.highlight ? 'btn-primary w-full' : 'btn-dark w-full'}>{t.choose}</a>
            )}
          </div>
        );
      })}
    </div>
  );
}
