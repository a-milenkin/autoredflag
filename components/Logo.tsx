import Link from 'next/link';

export default function Logo({ locale }: { locale: string }) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2" aria-label="Car Red Flag">
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#14161A" />
        <path d="M22 14v38" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <path d="M24 15h22l-6 9 6 9H24z" fill="#E5372F" />
      </svg>
      <span className="text-lg font-extrabold leading-none tracking-tight">
        Car<span className="text-flag">Red</span>Flag
      </span>
    </Link>
  );
}
