'use client';

import { useState } from 'react';
import type { MileagePoint } from '@/lib/report/types';

const km = (n: number) => `${new Intl.NumberFormat('ru-RU').format(n)} км`;

// Линия пробега по датам. Точка, где пробег упал, подсвечена красным.
export default function MileageChart({ points }: { points: MileagePoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  if (points.length < 2) return <p className="mt-3 text-ink-soft">Мало данных для графика.</p>;

  const W = 720, H = 240, L = 64, R = 24, T = 20, B = 36;
  const xs = points.map((p) => Date.parse(p.date));
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const yMax = Math.max(...points.map((p) => p.km)) * 1.1;
  const X = (t: number) => L + ((t - x0) / (x1 - x0 || 1)) * (W - L - R);
  const Y = (v: number) => T + (1 - v / yMax) * (H - T - B);
  const step = Math.pow(10, Math.floor(Math.log10(yMax / 4)));
  const tickStep = Math.ceil(yMax / 4 / step) * step;
  const ticks = Array.from({ length: Math.floor(yMax / tickStep) + 1 }, (_, i) => i * tickStep);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${X(xs[i]).toFixed(1)} ${Y(p.km).toFixed(1)}`).join(' ');

  return (
    <div className="relative mt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="График пробега">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} stroke="#E7E9EE" />
            <text x={L - 8} y={Y(v) + 4} textAnchor="end" fontSize="11" fill="#8A90A0">{new Intl.NumberFormat('ru-RU', { notation: 'compact' }).format(v)}</text>
          </g>
        ))}
        {points.map((p, i) => (
          <text key={`y${i}`} x={X(xs[i])} y={H - 10} textAnchor="middle" fontSize="11" fill="#8A90A0">{p.date.slice(0, 4)}</text>
        ))}
        <path d={path} fill="none" stroke="#14161A" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={X(xs[i])}
            cy={Y(p.km)}
            r={p.suspicious ? 7 : hover === i ? 6 : 4.5}
            fill={p.suspicious ? '#E5372F' : '#fff'}
            stroke={p.suspicious ? '#E5372F' : '#14161A'}
            strokeWidth="2"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="cursor-pointer"
          />
        ))}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: `${(X(xs[hover]) / W) * 100}%`, top: `${(Y(points[hover].km) / H) * 100}%` }}
        >
          <div className="text-ink-faint">{new Date(points[hover].date).toLocaleDateString('ru-RU')}</div>
          <div className={`font-bold ${points[hover].suspicious ? 'text-flag' : ''}`}>{km(points[hover].km)}</div>
          <div className="text-ink-soft">{points[hover].source}</div>
        </div>
      )}
      <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
        {points.map((p, i) => (
          <li key={i} className={`flex justify-between gap-3 rounded-lg px-3 py-1.5 ${p.suspicious ? 'bg-flag-soft font-semibold text-flag' : 'bg-paper'}`}>
            <span>{new Date(p.date).toLocaleDateString('ru-RU')} · {p.source}</span>
            <span className="tabular-nums">{km(p.km)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
