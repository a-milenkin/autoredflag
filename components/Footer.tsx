import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n';
import Logo from './Logo';
import { PHOTO_AUTHORS } from '@/lib/photos';

export default function Footer({ locale, t }: { locale: string; t: Dictionary }) {
  const hrefs = [`/${locale}/report/LGWHBUSRJGF4CBFPR`, `/${locale}/world`, `/${locale}#pricing`, `/${locale}#business`, '#'];
  return (
    <footer className="mt-24 border-t border-line bg-paper">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.2fr_2fr]">
        <div className="space-y-3">
          <Logo locale={locale} />
          <p className="max-w-xs text-sm text-ink-soft">{t.footer.about}</p>
          <p className="max-w-sm text-xs text-ink-faint">{t.how.disclaimer}</p>
        </div>
        <ul className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {t.footer.links.map((l, i) => (
            <li key={l}><Link href={hrefs[i]} className="text-ink-soft hover:text-ink">{l}</Link></li>
          ))}
        </ul>
      </div>
      <p className="container-page pb-4 text-xs text-ink-faint">
        Фото: <a href="https://unsplash.com" className="underline" rel="nofollow noopener" target="_blank">Unsplash</a>, авторы {PHOTO_AUTHORS.join(', ')}.
      </p>
      <div className="border-t border-line py-4 text-center text-xs text-ink-faint">© {new Date().getFullYear()} {t.footer.rights}</div>
    </footer>
  );
}
