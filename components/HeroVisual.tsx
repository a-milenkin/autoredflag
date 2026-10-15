'use client';

import { useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import { PHOTOS } from '@/lib/photos';

// Первый экран: настоящее фото машины и телефон, на котором "идёт" проверка.
// Анимация на CSS (transform, opacity, clip-path), ставится на паузу, когда блок вне экрана,
// и выключается при prefers-reduced-motion.

const ROWS: { label: string; tone: 'ok' | 'bad' | 'warn'; note: string }[] = [
  { label: 'Пробег', tone: 'bad', note: '−48 000 км' },
  { label: 'Залоги', tone: 'ok', note: 'нет' },
  { label: 'ДТП', tone: 'bad', note: '1 серьёзное' },
  { label: 'История до ввоза', tone: 'warn', note: 'Китай' },
  { label: 'Ограничения', tone: 'ok', note: 'нет' },
  { label: 'Такси', tone: 'ok', note: 'нет' },
];
const DOT = { ok: 'bg-ok', bad: 'bg-flag', warn: 'bg-warn' };
const NOTE = { ok: 'text-ink-soft', bad: 'text-flag', warn: 'text-warn' };

export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="hero-anim relative mx-auto w-full max-w-[560px] pb-10" data-playing={playing}>
      <div className="overflow-hidden rounded-3xl">
        <Photo photo={PHOTOS.heroSuv} ratio={4 / 3} sizes="(min-width: 1024px) 520px, 92vw" priority className="aspect-[4/3] w-full" />
      </div>

      {/* Телефон */}
      <div className="absolute -bottom-2 right-2 w-[210px] rounded-[30px] bg-ink p-[7px] shadow-2xl sm:right-[-12px]" aria-hidden="true">
        <div className="relative overflow-hidden rounded-[24px] bg-white px-3.5 pb-4 pt-6">
          <div className="absolute left-1/2 top-1.5 h-3.5 w-14 -translate-x-1/2 rounded-full bg-ink" />
          <div className="flex h-8 items-center gap-1.5 rounded-lg bg-mist px-2.5">
            <svg viewBox="0 0 24 24" className="size-3.5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4" /></svg>
            <span className="hero-type font-mono text-[12px] font-semibold text-ink">С908КХ163</span>
          </div>
          <div className="relative mt-3">
            <div className="text-[13px] font-bold leading-tight">Haval Jolion, 2023</div>
            <div className="text-[10px] text-ink-soft">VIN LGWH•••••••••••••</div>
            <div className="hero-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-flag/60" />
          </div>
          <div className="hero-badge mt-2 inline-flex items-center gap-1 rounded-md bg-flag px-2 py-1 text-[10px] font-bold text-white">
            <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 21V4M5 4h12l-3 4 3 4H5" /></svg>
            2 красных флага
          </div>
          <ul className="mt-2.5 divide-y divide-line">
            {ROWS.map((r, i) => (
              <li key={r.label} className="hero-row flex items-center justify-between py-1.5 text-[11px]" style={{ ['--i' as string]: i }}>
                <span>{r.label}</span>
                <span className="flex items-center gap-1.5">
                  <span className={`text-[10px] tabular-nums ${NOTE[r.tone]}`}>{r.note}</span>
                  <span className={`size-2 rounded-full ${DOT[r.tone]}`} />
                </span>
              </li>
            ))}
          </ul>
          <div className="hero-verdict mt-2.5 rounded-lg bg-warn-soft px-2.5 py-1.5 text-[10px] font-semibold text-warn">Вердикт: торговаться, −220 000 ₽</div>
        </div>
      </div>
    </div>
  );
}
