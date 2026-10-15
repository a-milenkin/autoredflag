import Link from 'next/link';

// Знак AutoRedFlag: лупа, машина и красный флаг. Исходники в public/brand.
export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#14161A" />
      <path d="M41.5 41.5 52 52" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <circle cx="28" cy="28" r="17" fill="#14161A" stroke="#fff" strokeWidth="4.5" />
      <path d="M16.5 35.4v-3.6c0-.9.5-1.6 1.4-1.8l3.1-.7 2.6-3.3c.5-.6 1.2-.9 2-.9h5.4c.8 0 1.5.3 2 .9l3 3.3 1.6.4c.9.2 1.4 1 1.4 1.9v3.8z" fill="#fff" />
      <circle cx="21.6" cy="35.6" r="2.6" fill="#14161A" stroke="#fff" strokeWidth="1.5" />
      <circle cx="33.6" cy="35.6" r="2.6" fill="#14161A" stroke="#fff" strokeWidth="1.5" />
      <path d="M27 25V16.8" stroke="#E5372F" strokeWidth="2" strokeLinecap="round" />
      <path d="M27.6 16.4h7.6l-2 2.9 2 2.9h-7.6z" fill="#E5372F" />
    </svg>
  );
}

export default function Logo({ locale }: { locale: string }) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2" aria-label="AutoRedFlag">
      <LogoMark className="size-8 shrink-0" />
      <span className="text-lg font-bold leading-none">
        Auto<span className="text-flag">Red</span>Flag
      </span>
    </Link>
  );
}
