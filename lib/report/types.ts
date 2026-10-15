// Схема отчёта. Её же должен возвращать реальный провайдер данных (lib/provider).

export type Severity = 'red' | 'yellow' | 'green' | 'info';

export type SectionId =
  | 'accidents'
  | 'mileage'
  | 'owners'
  | 'legal'
  | 'import'
  | 'abroad'
  | 'taxi'
  | 'insurance'
  | 'service'
  | 'recalls'
  | 'fines'
  | 'listings';

export type Finding = {
  title: string;
  detail?: string;
  date?: string; // ISO
  severity: Severity;
  amount?: number; // ₽, если про деньги
};

export type ReportSection = {
  id: SectionId;
  title: string;
  severity: Severity; // худшая находка в разделе
  summary: string; // одна строка для тизера и шапки раздела
  findings: Finding[];
};

export type MileagePoint = { date: string; km: number; source: string; suspicious?: boolean };

export type Verdict = {
  decision: 'buy' | 'negotiate' | 'walk';
  headline: string;
  reasons: string[];
  questions: string[]; // что спросить у продавца
  discountRub: number | null; // аргумент для торга
};

export type Vehicle = {
  vin: string;
  plate: string | null;
  make: string;
  model: string;
  year: number;
  originCountry: string; // CN, KR, JP, US, DE, RU
  engine: string;
  power: number;
  color: string;
  bodyType: string;
  marketPrice: number;
};

export type Report = {
  id: string; // идентификатор, по которому открыт отчёт
  generatedAt: string;
  demo: boolean;
  vehicle: Vehicle;
  sections: ReportSection[];
  mileage: MileagePoint[];
  redFlags: number;
  warnings: number;
  verdict: Verdict;
};

/** Бесплатная часть: то, что видно до оплаты. */
export type ReportPreview = Pick<Report, 'id' | 'demo' | 'redFlags' | 'warnings'> & {
  vehicle: Pick<Vehicle, 'make' | 'model' | 'year' | 'originCountry' | 'engine' | 'power' | 'bodyType' | 'color'> & {
    vinMasked: string;
    plate: string | null;
  };
  sections: Pick<ReportSection, 'id' | 'title' | 'severity'>[];
  ownersCount: number;
};
