import Link from 'next/link';

export default function Logo({ locale }: { locale: string }) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2" aria-label="AutoRedFlag">
      <img src="/logo-mark.png" alt="" width={32} height={32} className="size-8 shrink-0" />
      <span className="text-lg font-bold leading-none">
        Auto<span className="text-flag">Red</span>Flag
      </span>
    </Link>
  );
}
