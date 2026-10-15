// Иллюстрация первого экрана: машина и телефон с бесплатной проверкой.
// Рисунок свой, в духе продуктовых лендингов: серебристый кроссовер + экран отчёта со статусами.

const ROWS: { label: string; tone: 'ok' | 'bad' | 'warn' }[] = [
  { label: 'Пробег', tone: 'bad' },
  { label: 'Залоги', tone: 'ok' },
  { label: 'Ограничения', tone: 'ok' },
  { label: 'ДТП', tone: 'bad' },
  { label: 'История до ввоза', tone: 'warn' },
  { label: 'Растаможка', tone: 'ok' },
  { label: 'Такси', tone: 'ok' },
];
const TONE = { ok: '#1F9D55', bad: '#E5372F', warn: '#E08A00' };

export default function HeroArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 400" className={className} role="img" aria-label="Пример бесплатной проверки на телефоне">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F5F7" />
          <stop offset="0.55" stopColor="#D3D7DE" />
          <stop offset="1" stopColor="#A9AFB9" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3A4250" />
          <stop offset="1" stopColor="#1C2129" />
        </linearGradient>
        <radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id="phoneShadow" x="-30%" y="-10%" width="160%" height="130%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#14161A" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Машина */}
      <ellipse cx="160" cy="330" rx="160" ry="18" fill="url(#shadow)" />
      <g transform="translate(0 70) scale(0.78)">
        <path d="M18 268c0-20 9-32 30-38l58-18 46-42c10-9 22-14 36-14h104c14 0 25 4 34 13l44 44 34 10c18 5 26 17 26 36v20c0 7-5 12-12 12H30c-7 0-12-5-12-12z" fill="url(#body)" stroke="#9AA1AC" strokeWidth="1.5" />
        <path d="M128 210l38-34c7-6 15-9 25-9h40v43z" fill="url(#glass)" />
        <path d="M243 167h48c10 0 17 3 24 10l33 33H243z" fill="url(#glass)" />
        <path d="M30 252h360" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
        <rect x="30" y="236" width="34" height="12" rx="4" fill="#F7E7A6" />
        <rect x="372" y="236" width="26" height="12" rx="4" fill="#E5372F" opacity="0.85" />
        <circle cx="104" cy="292" r="36" fill="#1F2328" />
        <circle cx="104" cy="292" r="20" fill="#C9CED6" />
        <circle cx="104" cy="292" r="7" fill="#6B7280" />
        <circle cx="318" cy="292" r="36" fill="#1F2328" />
        <circle cx="318" cy="292" r="20" fill="#C9CED6" />
        <circle cx="318" cy="292" r="7" fill="#6B7280" />
      </g>

      {/* Телефон */}
      <g filter="url(#phoneShadow)">
        <rect x="330" y="20" width="176" height="356" rx="30" fill="#14161A" />
        <rect x="338" y="28" width="160" height="340" rx="23" fill="#fff" />
        <rect x="392" y="34" width="52" height="12" rx="6" fill="#14161A" />
      </g>
      <text x="352" y="70" fontSize="12.5" fontWeight="700" fill="#14161A">Кроссовер, 2023</text>
      <rect x="352" y="80" width="132" height="70" rx="10" fill="#E9EBEF" />
      <path d="M366 132c0-6 3-9 8-11l16-5 13-11c3-2 6-3 10-3h28c4 0 7 1 9 3l12 12 9 3c5 1 7 5 7 10v4c0 2-1 3-3 3h-106c-2 0-3-1-3-3z" fill="#B8BEC8" />
      <circle cx="384" cy="138" r="8" fill="#1F2328" />
      <circle cx="456" cy="138" r="8" fill="#1F2328" />
      <rect x="352" y="160" width="108" height="20" rx="6" fill="#E5372F" />
      <path d="M359 166v9M359 166h8l-2 3 2 3h-8" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
      <text x="371" y="174" fontSize="9.5" fontWeight="700" fill="#fff">2 красных флага</text>
      {ROWS.map((r, i) => {
        const y = 196 + i * 22;
        return (
          <g key={r.label}>
            <text x="352" y={y + 4} fontSize="10" fill="#14161A">{r.label}</text>
            <circle cx="480" cy={y} r="4" fill={TONE[r.tone]} />
            <line x1="352" x2="484" y1={y + 11} y2={y + 11} stroke="#ECEEF2" />
          </g>
        );
      })}
    </svg>
  );
}
