import Link from 'next/link';

// Знак AutoRedFlag: лупа, машина и красный флаг. Оригинал в public/brand/original-3d.jpg.
export default function Logo({ locale }: { locale: string }) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2" aria-label="AutoRedFlag">
      <img src="/brand/mark.png" alt="" width={36} height={36} className="size-9 shrink-0" />
      <span className="text-lg font-bold leading-none">
        Auto<span className="text-flag">Red</span>Flag
      </span>
    </Link>
  );
}
