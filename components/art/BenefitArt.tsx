// Иллюстрации для блока "Чем полезен": машина + предмет сцены.

function Car({ x, y, color, flip = false }: { x: number; y: number; color: string; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})${flip ? ' scale(-1 1) translate(-150 0)' : ''}`}>
      <ellipse cx="75" cy="58" rx="70" ry="5" fill="#000" opacity="0.08" />
      <path d="M6 44c0-8 4-13 12-15l22-6 17-15c4-3 8-5 13-5h34c5 0 9 2 12 5l16 16 12 3c7 2 10 6 10 13v6c0 2-2 4-4 4H10c-2 0-4-2-4-4z" fill={color} />
      <path d="M46 23l13-11c2-2 5-3 9-3h13v14zM88 9h14c4 0 7 1 9 4l10 10H88z" fill="#fff" opacity="0.6" />
      <circle cx="36" cy="52" r="10" fill="#1F2328" />
      <circle cx="36" cy="52" r="4" fill="#C9CED6" />
      <circle cx="116" cy="52" r="10" fill="#1F2328" />
      <circle cx="116" cy="52" r="4" fill="#C9CED6" />
    </g>
  );
}

export function FlagsArt() {
  return (
    <svg viewBox="0 0 220 130" className="h-32 w-auto" aria-hidden="true">
      <rect x="20" y="6" width="120" height="76" rx="8" fill="#fff" stroke="#E7E9EE" strokeWidth="2" />
      <rect x="20" y="6" width="120" height="14" rx="7" fill="#2B4C7E" />
      {[32, 46, 60].map((y, i) => (
        <g key={y}>
          <rect x="30" y={y} width="62" height="6" rx="3" fill="#E7E9EE" />
          <circle cx="124" cy={y + 3} r="4" fill={i === 1 ? '#E5372F' : '#1F9D55'} />
        </g>
      ))}
      <path d="M160 10v58" stroke="#14161A" strokeWidth="3" strokeLinecap="round" />
      <path d="M161 11h40l-9 12 9 12h-40z" fill="#E5372F" />
      <Car x={36} y={66} color="#E5372F" />
    </svg>
  );
}

export function VerdictArt() {
  return (
    <svg viewBox="0 0 220 130" className="h-32 w-auto" aria-hidden="true">
      <rect x="96" y="4" width="100" height="74" rx="8" fill="#fff" stroke="#E7E9EE" strokeWidth="2" />
      <rect x="106" y="14" width="46" height="14" rx="4" fill="#E08A00" />
      <rect x="106" y="36" width="78" height="5" rx="2.5" fill="#E7E9EE" />
      <rect x="106" y="47" width="66" height="5" rx="2.5" fill="#E7E9EE" />
      <rect x="106" y="58" width="72" height="5" rx="2.5" fill="#E7E9EE" />
      <circle cx="44" cy="30" r="12" fill="#F2C9A0" />
      <path d="M30 70c0-14 6-24 14-24s14 10 14 24z" fill="#14161A" />
      <Car x={52} y={64} color="#1F9D55" />
    </svg>
  );
}

export function WorldArt() {
  return (
    <svg viewBox="0 0 220 130" className="h-32 w-auto" aria-hidden="true">
      <circle cx="66" cy="44" r="38" fill="#E7EEF8" stroke="#2B4C7E" strokeWidth="2" />
      <path d="M28 44h76M66 6c14 12 14 64 0 76M66 6c-14 12-14 64 0 76" stroke="#2B4C7E" strokeWidth="1.6" fill="none" />
      <rect x="130" y="14" width="48" height="32" rx="4" fill="#DE2910" />
      <path d="M142 22l2 4 4 .5-3 2.6 1 4-4-2.2-4 2.2 1-4-3-2.6 4-.5z" fill="#FFDE00" />
      <path d="M118 34c6-10 14-14 22-14" stroke="#14161A" strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
      <Car x={62} y={64} color="#2F6FDE" />
    </svg>
  );
}
