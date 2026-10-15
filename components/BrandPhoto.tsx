import { brandPhotoCredit, brandPhotoUrl, type Brand } from '@/lib/brands/ru';

type Props = { brand: Brand; className?: string; priority?: boolean; credit?: boolean; w?: number; h?: number };

// Фото машины марки: Unsplash или Wikimedia Commons, с подписью автора и лицензии.
export default function BrandPhoto({ brand, className = '', priority = false, credit = false, w = 1200, h = 800 }: Props) {
  const c = brandPhotoCredit(brand.photo);
  const img = (
    <img
      src={brandPhotoUrl(brand.photo, w, h)}
      alt={brand.name}
      width={w}
      height={h}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`bg-mist object-cover ${className}`}
    />
  );
  if (!credit) return img;
  return (
    <figure>
      {img}
      <figcaption className="mt-2 text-xs text-ink-faint">
        {brand.name}. Фото: {c.author}, <a href={c.href} className="underline" rel="nofollow noopener" target="_blank">{c.where}</a>, {c.license}
      </figcaption>
    </figure>
  );
}
