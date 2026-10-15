'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { identify } from '@/lib/identify';
import type { Dictionary } from '@/lib/i18n';

// Поле ввода в виде настоящего номера: госномер по ГОСТу, заводская табличка VIN, выбитый номер кузова.

type Tab = 'plate' | 'vin' | 'body';
type Props = { locale: string; t: Dictionary['search']; dark?: boolean; sampleHref?: string };

const PLATE_LETTERS = 'АВЕКМНОРСТУХ';
const LAT_TO_CYR: Record<string, string> = { A: 'А', B: 'В', E: 'Е', K: 'К', M: 'М', H: 'Н', O: 'О', P: 'Р', C: 'С', T: 'Т', Y: 'У', X: 'Х' };
const CYR_TO_LAT: Record<string, string> = Object.fromEntries(Object.entries(LAT_TO_CYR).map(([l, c]) => [c, l]));
// Шаблон номера: буква, три цифры, две буквы, регион 2-3 цифры
const PLATE_MASK = ['L', 'D', 'D', 'D', 'L', 'L', 'D', 'D', 'D'] as const;
const PLATE_GHOST = 'А000АА777';

function cleanPlate(raw: string): { value: string; dropped: boolean } {
  const chars = raw.toUpperCase().replace(/Ё/g, 'Е').replace(/[\s\-_.]/g, '').split('').map((c) => LAT_TO_CYR[c] ?? c);
  let value = '';
  let dropped = false;
  for (const c of chars) {
    if (value.length >= 9) break;
    const need = PLATE_MASK[value.length];
    const ok = need === 'L' ? PLATE_LETTERS.includes(c) : /\d/.test(c);
    if (ok) value += c;
    else dropped = true;
  }
  return { value, dropped };
}

function cleanVin(raw: string): string {
  return raw
    .toUpperCase()
    .split('')
    .map((c) => CYR_TO_LAT[c] ?? c)
    .join('')
    .replace(/O|Q/g, '0')
    .replace(/I/g, '1')
    .replace(/[^A-HJ-NPR-Z0-9]/g, '')
    .slice(0, 17);
}

function cleanBody(raw: string): string {
  return raw
    .toUpperCase()
    .split('')
    .map((c) => CYR_TO_LAT[c] ?? c)
    .join('')
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 20);
}

const TAB_HINTS: Record<Tab, string> = {
  plate: 'Номер с машины или из объявления. Регион - две или три цифры, латиницу переведём в кириллицу сами.',
  vin: 'Под лобовым стеклом слева, на стойке водительской двери и в СТС. Букв I, O и Q в VIN не бывает, заменим их на 1 и 0.',
  body: 'Для праворульных японских машин без VIN. Номер кузова есть в СТС и на моторном щите, например NHP10-1234567.',
};

export default function PlateForm({ locale, t, dark = false, sampleHref }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('plate');
  const [vals, setVals] = useState<Record<Tab, string>>({ plate: '', vin: '', body: '' });
  const [focused, setFocused] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [showWhere, setShowWhere] = useState(false);
  const inputs = { plate: useRef<HTMLInputElement>(null), vin: useRef<HTMLInputElement>(null), body: useRef<HTMLInputElement>(null) };

  function switchTo(next: Tab, value?: string) {
    setTab(next);
    setError(false);
    if (value !== undefined) setVals((v) => ({ ...v, [next]: value }));
    requestAnimationFrame(() => inputs[next].current?.focus());
  }

  // Что набрано во вкладке номера "как есть", до отсечения: по нему понимаем, что человек набирает VIN
  const plateRaw = useRef('');

  function onInput(kind: Tab, raw: string, inputType = '') {
    setError(false);
    setNote(null);
    const prev = vals[kind];
    // вставка, автозаполнение или замена всего значения
    const bulk = inputType === 'insertFromPaste' || inputType === 'insertReplacementText' || raw.length - prev.length > 1 || (!raw.startsWith(prev) && raw.length >= 8 && raw.length >= prev.length);

    // Вставили целое значение не в ту вкладку: переключаемся сами
    if (bulk) {
      const guess = identify(raw);
      if (guess.type !== 'unknown' && guess.type !== kind) {
        const target = guess.type as Tab;
        const v = target === 'plate' ? cleanPlate(guess.value).value : target === 'vin' ? cleanVin(guess.value) : cleanBody(raw);
        setNote(target === 'vin' ? 'Похоже на VIN, переключили' : target === 'plate' ? 'Похоже на госномер, переключили' : 'Похоже на номер кузова, переключили');
        switchTo(target, v);
        return;
      }
    }

    if (kind === 'plate') {
      plateRaw.current = raw.startsWith(prev) && !bulk ? plateRaw.current + raw.slice(prev.length) : raw;
      if (raw.length < prev.length) plateRaw.current = raw;
      const { value, dropped } = cleanPlate(raw);
      // Набирают латиницей буквы, которых нет в номерах (L, G, W...): это VIN
      const buf = plateRaw.current.toUpperCase();
      const foreign = buf.replace(/[ABEKMHOPCTYX0-9АВЕКМНОРСТУХ\s-]/g, '');
      if (foreign.length >= 2 && /^[A-Z0-9]+$/.test(buf)) {
        setNote('Похоже на VIN, переключили');
        plateRaw.current = '';
        switchTo('vin', cleanVin(buf));
        return;
      }
      if (dropped) setNote(`В номерах бывают только буквы ${PLATE_LETTERS.split('').join(' ')}`);
      setVals((v) => ({ ...v, plate: value }));
    } else if (kind === 'vin') {
      setVals((v) => ({ ...v, vin: cleanVin(raw) }));
    } else {
      setVals((v) => ({ ...v, body: cleanBody(raw) }));
    }
  }

  const value = vals[tab];
  const complete = tab === 'plate' ? value.length >= 8 : tab === 'vin' ? value.length === 17 : value.replace(/-/g, '').length >= 7;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = identify(value);
    if (!complete || id.type === 'unknown') {
      setError(true);
      inputs[tab].current?.focus();
      return;
    }
    router.push(`/${locale}/report/${encodeURIComponent(id.value)}`);
  }

  const status =
    tab === 'plate'
      ? value.length === 0 ? null : value.length < 6 ? 'Введите номер до конца' : value.length < 8 ? 'Осталось указать регион' : 'Номер полный'
      : tab === 'vin'
        ? value.length === 17 ? 'VIN полный' : null
        : null;

  const tabBase = dark ? 'text-white/70 hover:text-white' : 'text-ink-soft hover:text-ink';
  const tabActive = dark ? 'bg-white text-ink' : 'bg-white text-ink shadow-sm';

  return (
    <form onSubmit={submit} className="w-full" role="search" noValidate>
      <div className={`mb-3 inline-flex rounded-lg p-1 text-sm ${dark ? 'bg-white/10' : 'bg-mist'}`} role="group" aria-label={t.tabsLabel}>
        {(['plate', 'vin', 'body'] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={tab === k}
            onClick={() => switchTo(k)}
            className={`rounded-md px-3.5 py-1.5 font-medium transition-colors ${tab === k ? tabActive : tabBase}`}
          >
            {t.tabs[k]}
          </button>
        ))}
      </div>

      <div className="flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="min-w-0 flex-1">
          {tab === 'plate' && (
            <RuPlate value={value} focused={focused} error={error} inputRef={inputs.plate} onInput={(v, it) => onInput('plate', v, it)} setFocused={setFocused} />
          )}
          {tab === 'vin' && (
            <VinPlate value={value} focused={focused} error={error} inputRef={inputs.vin} onInput={(v, it) => onInput('vin', v, it)} setFocused={setFocused} />
          )}
          {tab === 'body' && (
            <BodyPlate value={value} focused={focused} error={error} inputRef={inputs.body} onInput={(v, it) => onInput('body', v, it)} setFocused={setFocused} />
          )}
        </div>
        <button
          type="submit"
          className={`h-14 shrink-0 rounded-xl px-7 text-[16px] font-semibold text-white transition-colors sm:h-auto bg-flag hover:bg-flag-dark`}
        >
          {t.buttonShort}
        </button>
      </div>

      <div className="mt-2 flex min-h-5 max-w-2xl flex-wrap items-center justify-between gap-x-4 text-sm" aria-live="polite">
        {error ? (
          <p role="alert" className={`font-medium ${dark ? 'text-[#FF9C96]' : 'text-flag'}`}>{t.error}</p>
        ) : note ? (
          <p className={dark ? 'text-white/80' : 'text-ink-soft'}>{note}</p>
        ) : (
          <p className={dark ? 'text-white/60' : 'text-ink-faint'}>{TAB_HINTS[tab]}</p>
        )}
        {status && <span className={`tabular-nums ${complete ? (dark ? 'text-[#7EE2A8]' : 'text-ok') : dark ? 'text-white/60' : 'text-ink-faint'}`}>{status}</span>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <button type="button" onClick={() => setShowWhere((v) => !v)} className={dark ? 'text-white hover:underline' : 'text-flag hover:underline'}>
          {t.whereVin}
        </button>
        {sampleHref && (
          <a href={sampleHref} className={dark ? 'text-white hover:underline' : 'text-flag hover:underline'}>{t.sample}</a>
        )}
      </div>
      {showWhere && <p className={`mt-2 max-w-xl text-sm ${dark ? 'text-white/80' : 'text-ink-soft'}`}>{t.whereVinText}</p>}
    </form>
  );
}

type FieldProps = {
  value: string;
  focused: boolean;
  error: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInput: (v: string, inputType?: string) => void;
  setFocused: (f: boolean) => void;
};

// Невидимый настоящий input поверх нарисованного номера: клавиатура, вставка, автозаполнение и скринридеры работают как обычно.
function HiddenInput({ value, inputRef, onInput, setFocused, label, maxLength }: FieldProps & { label: string; maxLength: number }) {
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onInput(e.target.value, (e.nativeEvent as InputEvent).inputType)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label={label}
      maxLength={maxLength + 6}
      autoComplete="off"
      autoCapitalize="characters"
      autoCorrect="off"
      spellCheck={false}
      inputMode="text"
      className="absolute inset-0 z-10 size-full cursor-text opacity-0"
      style={{ fontSize: 16 }}
    />
  );
}

function Caret() {
  return <span aria-hidden="true" className="plate-caret absolute inset-y-[12%] left-0 w-[0.08em] rounded-full bg-flag" />;
}

function RuPlate(p: FieldProps) {
  const chars = PLATE_GHOST.split('').map((ghost, i) => ({ ch: p.value[i] ?? ghost, filled: i < p.value.length, caret: p.focused && i === p.value.length, i }));
  const main = chars.slice(0, 6);
  const region = p.value.length > 8 ? chars.slice(6, 9) : chars.slice(6, 9).filter((c) => c.i < 8 || c.filled || c.caret);
  const ring = p.error ? 'ring-4 ring-flag/40' : p.focused ? 'ring-4 ring-flag/25' : '';

  const slot = (c: (typeof chars)[number], small: boolean) => (
    <span key={c.i} className={`relative inline-block text-center ${small ? 'w-[0.62em] text-[0.8em]' : 'w-[0.62em]'} ${c.filled ? 'text-ink' : 'text-[#CDD1D7]'}`}>
      {c.ch}
      {c.caret && <Caret />}
    </span>
  );

  return (
    <div className="relative [container-type:inline-size]">
      <HiddenInput {...p} label="Госномер, например А123ВС777" maxLength={9} />
      <div className={`rounded-[2.8cqw] bg-white p-[0.6cqw] shadow-sm transition-shadow ${ring}`}>
      <div className="plate-font flex aspect-[520/112] w-full select-none overflow-hidden rounded-[2.2cqw] border-[0.75cqw] border-ink bg-white text-ink">
        <div className="flex flex-1 items-center justify-center gap-[0.04em] text-[14.5cqw] leading-none">
          {slot(main[0], true)}
          <span className="w-[0.12em]" />
          {main.slice(1, 4).map((c) => slot(c, false))}
          <span className="w-[0.12em]" />
          {main.slice(4, 6).map((c) => slot(c, true))}
        </div>
        <div className="flex w-[25%] flex-col items-center justify-center border-l-[0.6cqw] border-ink">
          <div className="flex text-[9.6cqw] leading-none">{region.map((c) => slot(c, false))}</div>
          <div className="mt-[0.6cqw] flex items-center gap-[0.8cqw] font-sans text-[3.4cqw] font-bold leading-none">
            RUS
            <span aria-hidden="true" className="flex h-[2.6cqw] w-[4cqw] flex-col overflow-hidden rounded-[0.3cqw] ring-[0.15cqw] ring-ink/30">
              <span className="flex-1 bg-white" />
              <span className="flex-1 bg-[#0039A6]" />
              <span className="flex-1 bg-[#D52B1E]" />
            </span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function VinPlate(p: FieldProps) {
  const ring = p.error ? 'ring-4 ring-flag/40' : p.focused ? 'ring-4 ring-flag/25' : '';
  const groups = [
    { from: 0, to: 3, label: 'производитель' },
    { from: 3, to: 9, label: 'модель и оснащение' },
    { from: 9, to: 17, label: 'год, завод, серийный №' },
  ];
  return (
    <div className="relative [container-type:inline-size]">
      <HiddenInput {...p} label="VIN, 17 символов" maxLength={17} />
      <div className={`relative select-none rounded-[2cqw] border border-[#AEB4BD] bg-[#E3E6EA] px-[3.2cqw] pb-[2.4cqw] pt-[2.2cqw] shadow-sm transition-shadow ${ring}`}>
        {[['left-[1.2cqw] top-[1.2cqw]'], ['right-[1.2cqw] top-[1.2cqw]'], ['left-[1.2cqw] bottom-[1.2cqw]'], ['right-[1.2cqw] bottom-[1.2cqw]']].map(([pos]) => (
          <span key={pos} aria-hidden="true" className={`absolute ${pos} size-[1.3cqw] rounded-full bg-[#A3AAB4] ring-1 ring-[#8D95A0]`} />
        ))}
        <div className="flex items-baseline justify-between text-[2.5cqw] font-bold uppercase leading-none text-[#5B6370]">
          <span>VIN · идентификационный номер</span>
          <span className="tabular-nums">{p.value.length}/17</span>
        </div>
        <div className="mt-[1.8cqw] flex gap-[1.6cqw]">
          {groups.map((g) => (
            <div key={g.from} className="flex flex-col" style={{ flex: g.to - g.from }}>
              <div className="flex gap-[0.5cqw]">
                {Array.from({ length: g.to - g.from }, (_, k) => {
                  const i = g.from + k;
                  const ch = p.value[i];
                  return (
                    <span
                      key={i}
                      className="relative flex aspect-[3/4] flex-1 items-center justify-center rounded-[0.5cqw] bg-[#F4F5F7] font-mono text-[3.4cqw] font-bold leading-none text-ink ring-1 ring-inset ring-[#C3C8CF]"
                    >
                      {ch ?? ''}
                      {p.focused && i === p.value.length && <Caret />}
                    </span>
                  );
                })}
              </div>
              <span className="mt-[1cqw] truncate text-[2cqw] leading-none text-[#6B7380]">{g.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BodyPlate(p: FieldProps) {
  const ring = p.error ? 'ring-4 ring-flag/40' : p.focused ? 'ring-4 ring-flag/25' : '';
  return (
    <div className="relative [container-type:inline-size]">
      <HiddenInput {...p} label="Номер кузова, например NHP10-1234567" maxLength={20} />
      <div className={`flex aspect-[520/112] select-none items-center gap-[3cqw] rounded-[2cqw] bg-[#2A2E35] px-[4cqw] shadow-sm transition-shadow ${ring}`}>
        <span className="shrink-0 text-[2.6cqw] font-bold uppercase leading-tight text-[#9AA2AE]">
          Frame
          <br />
          No.
        </span>
        <span className={`relative font-mono text-[6.6cqw] font-bold leading-none tracking-[0.06em] ${p.value ? 'text-[#E9ECEF]' : 'text-[#5E6672]'}`}>
          {p.value || 'NHP10-1234567'}
          {p.focused && <span aria-hidden="true" className="plate-caret ml-[0.05em] inline-block h-[0.9em] w-[0.08em] translate-y-[0.1em] rounded-full bg-flag" />}
        </span>
      </div>
    </div>
  );
}
