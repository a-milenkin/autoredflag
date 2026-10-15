'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { identify } from '@/lib/identify';
import type { Dictionary } from '@/lib/i18n';
import Icon from './Icon';

type Props = { locale: string; t: Dictionary['search']; example?: string; size?: 'lg' | 'sm'; dark?: boolean; sampleHref?: string };

export default function SearchBox({ locale, t, example, size = 'lg', dark = false, sampleHref }: Props) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [showVin, setShowVin] = useState(false);
  const [tab, setTab] = useState<'plate' | 'vin' | 'body'>('plate');
  const detected = useMemo(() => (value.trim().length >= 6 ? identify(value) : null), [value]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = identify(value);
    if (id.type === 'unknown') {
      setError(true);
      return;
    }
    router.push(`/${locale}/report/${encodeURIComponent(id.value)}`);
  }

  if (size === 'sm') {
    return (
      <form onSubmit={submit} className="flex w-full max-w-md" role="search">
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          className={`min-w-0 flex-1 rounded-l-xl border border-r-0 px-3 py-2 text-sm outline-none focus:border-flag ${error ? 'border-flag' : 'border-transparent'} bg-[#F2F3F5]`}
        />
        <button className="rounded-r-xl bg-flag px-4 text-sm font-semibold text-white hover:bg-flag-dark">{t.buttonShort}</button>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="w-full" role="search">
      {!dark && (
        <div className="mb-2 inline-flex rounded-lg bg-mist p-1 text-sm" role="group" aria-label={t.tabsLabel}>
          {(['plate', 'vin', 'body'] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={tab === k}
              onClick={() => setTab(k)}
              className={`rounded-md px-3.5 py-1.5 font-medium transition-colors ${tab === k ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:text-ink'}`}
            >
              {t.tabs[k]}
            </button>
          ))}
        </div>
      )}
      <div className={`flex w-full max-w-xl overflow-hidden rounded-xl ring-2 transition-shadow ${error ? 'ring-flag' : dark ? 'ring-white/20' : 'ring-flag/25 focus-within:ring-flag/60'}`}>
        <div className="relative flex-1">
          <Icon name="search" className={`pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 ${dark ? 'text-white/60' : 'text-ink-soft'}`} />
          <input
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder={dark ? t.placeholder : t.tabPlaceholders[tab]}
            aria-label={t.placeholder}
            autoComplete="off"
            spellCheck={false}
            className={`h-12 w-full pl-10 ${detected ? 'pr-28' : 'pr-3'} text-[17px] uppercase outline-none placeholder:normal-case ${dark ? 'bg-white/10 text-white placeholder:text-white/50' : 'bg-[#FFF5F4] text-ink placeholder:text-ink-faint'}`}
          />
          {detected && (
            <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md px-2 py-0.5 text-xs font-semibold ${detected.type === 'unknown' ? 'bg-flag-soft text-flag' : 'bg-ok-soft text-ok'}`}>
              {t.detected[detected.type]}
            </span>
          )}
        </div>
        <button type="submit" className="bg-flag px-6 text-[15px] font-semibold text-white transition-colors hover:bg-flag-dark">
          {t.buttonShort}
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-sm font-medium text-flag">{t.error}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <button type="button" onClick={() => setShowVin((v) => !v)} className={dark ? 'text-white hover:underline' : 'text-flag hover:underline'}>
          {t.whereVin}
        </button>
        {sampleHref && (
          <a href={sampleHref} className={dark ? 'text-white hover:underline' : 'text-flag hover:underline'}>{t.sample}</a>
        )}
      </div>
      {showVin && <p className={`mt-2 max-w-xl text-sm ${dark ? 'text-white/80' : 'text-ink-soft'}`}>{t.whereVinText}</p>}
    </form>
  );
}
