// Распознаём, что ввёл пользователь: VIN, российский госномер или номер кузова (японские авто).

export type IdentifierType = 'vin' | 'plate' | 'body' | 'unknown';

// Кириллица, допустимая в российских номерах, и её латинские двойники
const CYR_TO_LAT: Record<string, string> = {
  А: 'A', В: 'B', Е: 'E', К: 'K', М: 'M', Н: 'H', О: 'O', Р: 'P', С: 'C', Т: 'T', У: 'Y', Х: 'X',
};
const LAT_TO_CYR: Record<string, string> = Object.fromEntries(
  Object.entries(CYR_TO_LAT).map(([c, l]) => [l, c]),
);

export function normalize(raw: string): string {
  return raw.trim().toUpperCase().replace(/[\s\-_.]/g, '').replace(/Ё/g, 'Е');
}

/** Номер в латинице: так храним и ищем, чтобы "А123ВС777" и "A123BC777" совпадали. */
export function plateToLatin(plate: string): string {
  return plate
    .split('')
    .map((ch) => CYR_TO_LAT[ch] ?? ch)
    .join('');
}

/** Номер в кириллице для показа пользователю. */
export function plateToCyrillic(plate: string): string {
  return plate
    .split('')
    .map((ch) => LAT_TO_CYR[ch] ?? ch)
    .join('');
}

const PLATE_RE = /^[ABEKMHOPCTYX]\d{3}[ABEKMHOPCTYX]{2}\d{2,3}$/;
const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;
const BODY_RE = /^[A-Z0-9]{2,8}\d{5,8}$/;

export function identify(raw: string): { type: IdentifierType; value: string } {
  const value = normalize(raw);
  const latin = plateToLatin(value);
  if (PLATE_RE.test(latin)) return { type: 'plate', value: latin };
  if (VIN_RE.test(latin)) return { type: 'vin', value: latin };
  if (BODY_RE.test(latin) && latin.length < 17) return { type: 'body', value: latin };
  return { type: 'unknown', value: latin };
}

export function maskVin(vin: string): string {
  return vin.slice(0, 4) + '*'.repeat(Math.max(0, vin.length - 4));
}

/** Форматирует номер с пробелом перед регионом: А123ВС 777 */
export function prettyPlate(latin: string): string {
  const cyr = plateToCyrillic(latin);
  const m = cyr.match(/^(.\d{3}..)(\d{2,3})$/);
  return m ? `${m[1]} ${m[2]}` : cyr;
}
