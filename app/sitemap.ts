import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n/config';
import { SITE_URL } from '@/lib/site';
import { BRANDS } from '@/lib/brands/ru';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/world', '/brands', ...BRANDS.map((b) => `/brands/${b.slug}`)];
  return LOCALES.flatMap((l) =>
    pages.map((p) => ({ url: `${SITE_URL}/${l}${p}`, changeFrequency: 'weekly' as const, priority: p ? 0.8 : 1 })),
  );
}
