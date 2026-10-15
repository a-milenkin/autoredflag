import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n';
import { DEMO_MODE } from '@/lib/site';
import Logo from './Logo';
import SearchBox from './SearchBox';

export default function Header({ locale, t, compactSearch = false }: { locale: string; t: Dictionary; compactSearch?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
      {DEMO_MODE && <div className="bg-ink px-4 py-1.5 text-center text-xs text-white/80">{t.demoBanner}</div>}
      <div className="container-page flex h-16 items-center gap-6">
        <Logo locale={locale} />
        {compactSearch && (
          <div className="hidden flex-1 md:block">
            <SearchBox locale={locale} t={t.search} size="sm" />
          </div>
        )}
        <nav className={`ml-auto hidden items-center gap-5 text-sm font-medium lg:flex ${compactSearch ? '' : ''}`}>
          <Link href={`/${locale}/world`} className="text-ink-soft hover:text-ink">{t.nav.world}</Link>
          <Link href={`/${locale}/report/LGWHBUSRJGF4CBFPR`} className="text-ink-soft hover:text-ink">{t.nav.sample}</Link>
          <Link href={`/${locale}#pricing`} className="text-ink-soft hover:text-ink">{t.nav.pricing}</Link>
          <Link href={`/${locale}#business`} className="text-ink-soft hover:text-ink">{t.nav.business}</Link>
        </nav>
        <button className="btn-ghost ml-auto py-2 text-sm lg:ml-0">{t.nav.login}</button>
      </div>
    </header>
  );
}
