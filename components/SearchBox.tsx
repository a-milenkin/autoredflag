'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { identify } from '@/lib/identify';
import type { Dictionary } from '@/lib/i18n';
import PlateForm from './PlateForm';

type Props = { locale: string; t: Dictionary['search']; example?: string; size?: 'lg' | 'sm'; dark?: boolean; sampleHref?: string };

// Большой вариант - поле в виде номера (PlateForm). Маленький - строка поиска в шапке.
export default function SearchBox({ locale, t, size = 'lg', dark = false, sampleHref }: Props) {
  if (size === 'lg') return <PlateForm locale={locale} t={t} dark={dark} sampleHref={sampleHref} />;
  return <CompactSearch locale={locale} t={t} />;
}

function CompactSearch({ locale, t }: { locale: string; t: Dictionary['search'] }) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = identify(value);
    if (id.type === 'unknown') {
      setError(true);
      return;
    }
    router.push(`/${locale}/report/${encodeURIComponent(id.value)}`);
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md" role="search">
      <input
        value={value}
        onChange={(e) => { setValue(e.target.value); setError(false); }}
        placeholder={t.placeholder}
        aria-label={t.placeholder}
        className={`min-w-0 flex-1 rounded-l-xl border border-r-0 bg-[#F2F3F5] px-3 py-2 text-sm outline-none focus:border-flag ${error ? 'border-flag' : 'border-transparent'}`}
      />
      <button className="rounded-r-xl bg-flag px-4 text-sm font-semibold text-white hover:bg-flag-dark">{t.buttonShort}</button>
    </form>
  );
}
