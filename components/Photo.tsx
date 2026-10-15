import { photoSrcSet, photoUrl, type Photo as P } from '@/lib/photos';

type Props = { photo: P; ratio: number; sizes: string; className?: string; priority?: boolean };

// Обычный <img> с srcset: фото отдаёт CDN Unsplash, без серверной оптимизации.
export default function Photo({ photo, ratio, sizes, className = '', priority = false }: Props) {
  const widths = [480, 800, 1200, 1600];
  return (
    <img
      src={photoUrl(photo, 1200, Math.round(1200 / ratio))}
      srcSet={photoSrcSet(photo, widths, ratio)}
      sizes={sizes}
      width={1200}
      height={Math.round(1200 / ratio)}
      alt={photo.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`bg-mist object-cover ${className}`}
    />
  );
}
