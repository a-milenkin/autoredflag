import { brandPhotoCredit, brandPhotoUrl, type Brand, type BrandPhoto as P } from '@/lib/brands/ru';

type Props = {
  brand: Brand;
  photo?: P; // фото конкретной модели, если есть
  label?: string; // подпись: марка или модель
  className?: string;
  priority?: boolean;
  credit?: boolean;
  w?: number;
  h?: number;
};

// Фото машины: Unsplash или Wikimedia Commons, с подписью автора и лицензии.
export default function BrandPhoto({ brand, photo, label, className = '', priority = false, credit = false, w = 1200, h = 800 }: Props) {
  const p = photo ?? brand.photo;
  const name = label ?? brand.name;
  const c = brandPhotoCredit(p);
  const img = (
    <img
      src={brandPhotoUrl(p, w, h)}
      alt={name}
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
        {name}. Фото: {c.author}, <a href={c.href} className="underline" rel="nofollow noopener" target="_blank">{c.where}</a>, {c.license}
      </figcaption>
    </figure>
  );
}
