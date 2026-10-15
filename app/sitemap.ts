import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n/config';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/world'];
  return LOCALES.flatMap((l) =>
    pages.map((p) => ({ url: `${SITE_URL}/${l}${p}`, changeFrequency: 'weekly' as const, priority: p ? 0.8 : 1 })),
  );
}
