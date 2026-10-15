// Точка подключения источника данных.
// Сейчас: DATA_PROVIDER=mock (по умолчанию). Реальный API добавляется отдельным классом
// с тем же интерфейсом и включается переменной окружения DATA_PROVIDER.

import 'server-only';
import { identify, maskVin } from '@/lib/identify';
import { generateReport } from '@/lib/report/mock';
import type { Report, ReportPreview } from '@/lib/report/types';
import { findByPlate, findByVin } from './vinTable';

export interface CarDataProvider {
  /** Полный отчёт по VIN, госномеру или номеру кузова. null, если идентификатор не распознан. */
  getReport(identifier: string): Promise<Report | null>;
}

class MockProvider implements CarDataProvider {
  async getReport(identifier: string): Promise<Report | null> {
    const { type, value } = identify(identifier);
    if (type === 'unknown') return null;

    if (type === 'plate') {
      const row = findByPlate(value);
      // Номера нет в таблице связки: всё равно отдаём демо-отчёт, VIN сгенерируется
      return generateReport(value, row ? { ...row } : { plate: value });
    }
    if (type === 'vin') {
      const row = findByVin(value);
      return generateReport(value, row ? { ...row } : { vin: value });
    }
    // Номер кузова (японские авто): VIN нет, генерируем по номеру кузова
    return generateReport(value, { originCountry: 'JP' });
  }
}

// class RealProvider implements CarDataProvider {
//   async getReport(identifier: string) {
//     const res = await fetch(`${process.env.CAR_API_URL}/report?q=${encodeURIComponent(identifier)}`, {
//       headers: { Authorization: `Bearer ${process.env.CAR_API_KEY}` },
//     });
//     return mapToReport(await res.json());
//   }
// }

export function getProvider(): CarDataProvider {
  switch (process.env.DATA_PROVIDER ?? 'mock') {
    default:
      return new MockProvider();
  }
}

export function toPreview(r: Report): ReportPreview {
  return {
    id: r.id,
    demo: r.demo,
    redFlags: r.redFlags,
    warnings: r.warnings,
    ownersCount: Number(r.sections.find((s) => s.id === 'owners')?.findings[0]?.title.match(/\d+/)?.[0] ?? 1),
    vehicle: {
      make: r.vehicle.make,
      model: r.vehicle.model,
      year: r.vehicle.year,
      originCountry: r.vehicle.originCountry,
      engine: r.vehicle.engine,
      power: r.vehicle.power,
      bodyType: r.vehicle.bodyType,
      color: r.vehicle.color,
      vinMasked: maskVin(r.vehicle.vin),
      plate: r.vehicle.plate,
    },
    sections: r.sections.map(({ id, title, severity }) => ({ id, title, severity })),
  };
}
