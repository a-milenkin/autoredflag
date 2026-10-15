import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from './lib/i18n/config';

// Всё, что пришло без префикса языка, отправляем в /ru.
// Когда появятся другие страны, здесь можно смотреть Accept-Language и показывать выбор страны.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|.*\\..*).*)'],
};
