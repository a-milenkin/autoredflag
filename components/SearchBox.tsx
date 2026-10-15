'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { identify } from '@/lib/identify';
import type { Dictionary } from '@/lib/i18n';
import Icon from './Icon';

type Props = { locale: string; t: Dictionary['search']; example?: string; size?: 'lg' | 'sm'; dark?: boolean };

export default function SearchBox({ locale, t, example, size = 'lg', dark = false }: Props) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [showVin, setShowVin] = useState(false);
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
          className={`min-w-0 flex-1 rounded-l-xl border border-r-0 px-3 py-2 text-sm outline-none focus:border-flag ${error ? 'border-flag' : 'border-line'} bg-paper`}
        />
        <button className="rounded-r-xl bg-flag px-4 text-sm font-semibold text-white hover:bg-flag-dark">{t.buttonShort}</button>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="w-full" role="search">
      <div className={`flex flex-col gap-2 rounded-2xl p-2 shadow-[0_10px_40px_-12px_rgba(20,22,26,0.25)] sm:flex-row ${dark ? 'bg-white/10 ring-1 ring-white/20' : 'bg-white ring-1 ring-line'}`}>
        <div className="relative flex-1">
          <Icon name="search" className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${dark ? 'text-white/60' : 'text-ink-faint'}`} />
          <input
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder={example ? `${t.placeholder}, например ${example}` : t.placeholder}
            aria-label={t.placeholder}
            autoComplete="off"
            spellCheck={false}
            className={`h-14 w-full rounded-xl pl-12 ${detected ? "pr-32" : "pr-4"} text-lg font-medium uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal ${dark ? 'bg-transparent text-white placeholder:text-white/50' : 'bg-paper text-ink placeholder:text-ink-faint'} ${error ? 'ring-2 ring-flag' : ''}`}
          />
          {detected && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold ${detected.type === 'unknown' ? 'bg-flag-soft text-flag' : 'bg-ok-soft text-ok'}`}>
              {t.detected[detected.type]}
            </span>
          )}
        </div>
        <button type="submit" className="btn-primary h-14 px-7 text-base">
          {t.button}
          <Icon name="arrow" className="h-5 w-5" />
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-flag">{t.error}</p>}
      <div className={`mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${dark ? 'text-white/75' : 'text-ink-soft'}`}>
        <button type="button" onClick={() => setShowVin((v) => !v)} className={`font-medium underline decoration-dotted underline-offset-4 ${dark ? 'text-white' : 'text-ink'}`}>
          {t.whereVin}
        </button>
        {t.microFacts.map((f) => (
          <span key={f} className="inline-flex items-center gap-1.5">
            <Icon name="check" className="h-4 w-4 text-ok" strokeWidth={2.4} />
            {f}
          </span>
        ))}
      </div>
      {showVin && <p className={`mt-2 max-w-2xl text-sm ${dark ? 'text-white/80' : 'text-ink-soft'}`}>{t.whereVinText}</p>}
    </form>
  );
}
