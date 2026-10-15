import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n';
import { DEMO_MODE } from '@/lib/site';
import Logo from './Logo';
import SearchBox from './SearchBox';

export default function Header({ locale, t }: { locale: string; t: Dictionary; compactSearch?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      {DEMO_MODE && <div className="bg-ink px-4 py-1 text-center text-xs text-white/75">{t.demoBanner}</div>}
      <div className="container-page flex h-16 items-center gap-6">
        <Logo locale={locale} />
        <div className="hidden w-full max-w-sm md:block">
          <SearchBox locale={locale} t={t.search} size="sm" />
        </div>
        <nav className="ml-auto hidden items-center gap-5 text-sm lg:flex">
          <Link href={`/${locale}/world`} className="text-flag hover:text-flag-dark">{t.nav.world}</Link>
          <Link href={`/${locale}/report/LGWHBUSRJGF4CBFPR`} className="text-flag hover:text-flag-dark">{t.nav.sample}</Link>
          <Link href={`/${locale}#pricing`} className="text-flag hover:text-flag-dark">{t.nav.pricing}</Link>
        </nav>
        <button className="ml-auto rounded-lg bg-flag-soft px-5 py-2 text-[15px] font-semibold text-flag hover:bg-[#FADAD8] lg:ml-0">{t.nav.login}</button>
      </div>
    </header>
  );
}
