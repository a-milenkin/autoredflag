// Таблица связки VIN и госномера. Сейчас это data/vin_plate.csv с тестовыми машинами.
// Чтобы подключить свою таблицу, замените файл, сохранив колонки:
// vin,plate,make,model,year,origin_country (plate в латинице: A123BC777).

import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

export type VinRow = {
  vin: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  originCountry: string;
};

let cache: { byVin: Map<string, VinRow>; byPlate: Map<string, VinRow> } | null = null;

function load() {
  if (cache) return cache;
  const file = path.join(process.cwd(), 'data', 'vin_plate.csv');
  const text = fs.readFileSync(file, 'utf8');
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const cols = header.split(',');
  const byVin = new Map<string, VinRow>();
  const byPlate = new Map<string, VinRow>();
  for (const line of lines) {
    const v = line.split(',');
    const rec = Object.fromEntries(cols.map((c, i) => [c, v[i]]));
    const row: VinRow = {
      vin: rec.vin.toUpperCase(),
      plate: rec.plate.toUpperCase(),
      make: rec.make,
      model: rec.model,
      year: Number(rec.year),
      originCountry: rec.origin_country,
    };
    byVin.set(row.vin, row);
    byPlate.set(row.plate, row);
  }
  cache = { byVin, byPlate };
  return cache;
}

export function findByVin(vin: string): VinRow | undefined {
  return load().byVin.get(vin);
}

export function findByPlate(plateLatin: string): VinRow | undefined {
  return load().byPlate.get(plateLatin);
}

export function allRows(): VinRow[] {
  return [...load().byVin.values()];
}
