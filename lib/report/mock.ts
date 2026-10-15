// Генератор демо-отчётов. Детерминированный: один и тот же VIN всегда даёт один и тот же отчёт.
// Когда подключим реальный API, этот файл останется только для демо и тестов.

import type { Finding, MileagePoint, Report, ReportSection, Severity, Vehicle, Verdict } from './types';

// ---------- случайность с зерном ----------
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = ReturnType<typeof mulberry32>;
const pick = <T,>(rng: Rng, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const between = (rng: Rng, min: number, max: number) => Math.round(min + rng() * (max - min));
const chance = (rng: Rng, p: number) => rng() < p;

function isoDate(year: number, rng: Rng, minMonth = 1, maxMonth = 12): string {
  const m = between(rng, minMonth, maxMonth);
  const d = between(rng, 1, 28);
  const iso = `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  // Не даём датам уйти в будущее
  const today = new Date().toISOString().slice(0, 10);
  return iso > today ? today : iso;
}

const SEDANS = ['Camry', 'K5', 'Vesta', 'Solaris', 'Rio', 'Octavia', 'E-Class', 'Alsvin'];

// ---------- справочники ----------
const COUNTRY_NAMES: Record<string, string> = {
  CN: 'Китай',
  KR: 'Корея',
  JP: 'Япония',
  US: 'США',
  DE: 'Германия',
  AE: 'ОАЭ',
  RU: 'Россия',
};

export function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}

const FALLBACK_CARS: { make: string; model: string; origin: string }[] = [
  { make: 'Haval', model: 'Jolion', origin: 'CN' },
  { make: 'Chery', model: 'Tiggo 7 Pro', origin: 'CN' },
  { make: 'Geely', model: 'Monjaro', origin: 'CN' },
  { make: 'Changan', model: 'CS55 Plus', origin: 'CN' },
  { make: 'Li Auto', model: 'L7', origin: 'CN' },
  { make: 'Hyundai', model: 'Tucson', origin: 'KR' },
  { make: 'Kia', model: 'Sorento', origin: 'KR' },
  { make: 'Toyota', model: 'Camry', origin: 'JP' },
  { make: 'Lada', model: 'Vesta', origin: 'RU' },
];

const ENGINES = [
  { engine: '1.5 л, бензин, турбо', power: 150 },
  { engine: '2.0 л, бензин, турбо', power: 200 },
  { engine: '1.6 л, бензин', power: 123 },
  { engine: '2.5 л, бензин', power: 181 },
  { engine: 'Гибрид, 1.5 л', power: 330 },
  { engine: 'Электро', power: 272 },
];

const COLORS = ['Серый', 'Белый', 'Чёрный', 'Синий', 'Серебристый', 'Зелёный'];
const BODIES = ['Кроссовер', 'Седан', 'Внедорожник', 'Лифтбек'];
const REGIONS = ['Москва', 'Московская область', 'Санкт-Петербург', 'Краснодарский край', 'Татарстан', 'Свердловская область', 'Приморский край'];

// Год модели по 10-му символу VIN
const VIN_YEAR: Record<string, number> = {
  L: 2020, M: 2021, N: 2022, P: 2023, R: 2024, S: 2025, T: 2026, G: 2016, H: 2017, J: 2018, K: 2019,
};

export type CarSeed = {
  vin?: string;
  plate?: string | null;
  make?: string;
  model?: string;
  year?: number;
  originCountry?: string;
};

function synthVin(rng: Rng, origin: string): string {
  const wmi: Record<string, string> = { CN: 'LGW', KR: 'KMH', JP: 'JTD', US: '1FM', DE: 'WVW', RU: 'XTA', AE: 'JTD' };
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let rest = '';
  for (let i = 0; i < 14; i++) rest += chars[Math.floor(rng() * chars.length)];
  return (wmi[origin] ?? 'LGW') + rest;
}

const fmtRub = (n: number) => `${new Intl.NumberFormat('ru-RU').format(Math.round(n / 1000) * 1000)} ₽`;
const fmtKm = (n: number) => `${new Intl.NumberFormat('ru-RU').format(n)} км`;

function worst(findings: Finding[]): Severity {
  if (findings.some((f) => f.severity === 'red')) return 'red';
  if (findings.some((f) => f.severity === 'yellow')) return 'yellow';
  if (findings.some((f) => f.severity === 'green')) return 'green';
  return 'info';
}

// ---------- генерация ----------
export function generateReport(identifier: string, seed: CarSeed): Report {
  const key = seed.vin ?? seed.plate ?? identifier;
  const rng = mulberry32(hashString(key));
  const now = new Date();
  const thisYear = now.getUTCFullYear();

  const fb = pick(rng, FALLBACK_CARS);
  const origin = seed.originCountry ?? fb.origin;
  const make = seed.make ?? fb.make;
  const model = seed.model ?? fb.model;
  const vin = seed.vin ?? synthVin(rng, origin);
  const year = Math.min(thisYear, seed.year ?? VIN_YEAR[vin[9]] ?? between(rng, 2019, thisYear));
  const eng = make === 'Tesla' || make === 'Zeekr' ? ENGINES[5] : pick(rng, ENGINES);
  const age = Math.max(0, thisYear - year);
  const basePrice = origin === 'CN' ? 2_600_000 : origin === 'DE' || origin === 'US' ? 4_200_000 : origin === 'RU' ? 1_400_000 : 3_000_000;
  const marketPrice = Math.round((basePrice * Math.pow(0.88, age) * (0.9 + rng() * 0.25)) / 10000) * 10000;

  const vehicle: Vehicle = {
    vin,
    plate: seed.plate ?? null,
    make,
    model,
    year,
    originCountry: origin,
    engine: eng.engine,
    power: eng.power,
    color: pick(rng, COLORS),
    bodyType: SEDANS.includes(model) ? 'Седан' : model === 'Model Y' || origin === 'CN' || origin === 'KR' ? 'Кроссовер' : pick(rng, BODIES),
    marketPrice,
  };

  // Профиль риска: чистая / с нюансами / проблемная
  const r = rng();
  const profile: 'clean' | 'minor' | 'bad' = r < 0.35 ? 'clean' : r < 0.7 ? 'minor' : 'bad';
  const isImport = origin !== 'RU';
  const regYear = isImport ? Math.min(thisYear, year + (chance(rng, 0.5) ? 1 : 0)) : year;
  const sections: ReportSection[] = [];

  // --- Пробег ---
  const yearlyKm = between(rng, 12000, 24000);
  const mileage: MileagePoint[] = [];
  let km = isImport ? between(rng, 3000, 25000) : between(rng, 5, 50);
  const firstSource = isImport ? `Экспортная декларация, ${countryName(origin)}` : 'Продажа у дилера';
  mileage.push({ date: isoDate(regYear, rng, 1, 4), km, source: firstSource });
  for (let y = regYear + 1; y <= thisYear; y++) {
    km += Math.round(yearlyKm * (0.8 + rng() * 0.4));
    mileage.push({ date: isoDate(y, rng, 2, 10), km, source: pick(rng, ['Техосмотр', 'Сервис у дилера', 'Объявление о продаже', 'Страховой полис']) });
  }
  const mileageFindings: Finding[] = [];
  if (profile === 'bad' && mileage.length >= 3) {
    const last = mileage[mileage.length - 1];
    const prevMax = Math.max(...mileage.slice(0, -1).map((p) => p.km));
    const rolled = Math.max(5000, Math.round(prevMax * (0.45 + rng() * 0.2)));
    last.km = rolled;
    last.suspicious = true;
    last.source = 'Объявление о продаже';
    mileageFindings.push({
      title: `Пробег уменьшился на ${fmtKm(prevMax - rolled)}`,
      detail: `Раньше фиксировали ${fmtKm(prevMax)}, в последнем объявлении ${fmtKm(rolled)}. Похоже на скрутку.`,
      date: last.date,
      severity: 'red',
    });
  } else {
    mileageFindings.push({ title: 'Пробег растёт равномерно', detail: `${mileage.length} записей, последняя: ${fmtKm(mileage[mileage.length - 1].km)}`, severity: 'green' });
  }
  sections.push({ id: 'mileage', title: 'История пробега', severity: worst(mileageFindings), summary: mileageFindings[0].title, findings: mileageFindings });

  // --- ДТП ---
  const accFindings: Finding[] = [];
  const accCount = profile === 'clean' ? 0 : profile === 'minor' ? between(rng, 0, 1) : between(rng, 1, 3);
  for (let i = 0; i < accCount; i++) {
    const heavy = profile === 'bad' && chance(rng, 0.6);
    const cost = heavy ? between(rng, 250_000, 900_000) : between(rng, 25_000, 120_000);
    accFindings.push({
      title: heavy ? 'Серьёзное ДТП, повреждения передней части' : 'Мелкое ДТП, царапины и бампер',
      detail: `Расчёт ремонта: ${fmtRub(cost)}. ${heavy ? 'Возможна замена элементов кузова и подушек безопасности.' : 'Кузовной ремонт без силовых элементов.'}`,
      date: isoDate(between(rng, regYear, thisYear), rng),
      severity: heavy ? 'red' : 'yellow',
      amount: cost,
    });
  }
  if (!accFindings.length) accFindings.push({ title: 'Записей о ДТП не найдено', severity: 'green' });
  sections.push({ id: 'accidents', title: 'ДТП и повреждения', severity: worst(accFindings), summary: accCount ? `Найдено ДТП: ${accCount}` : 'Записей о ДТП нет', findings: accFindings });

  // --- Юридическая чистота ---
  const legal: Finding[] = [];
  if (profile === 'bad' && chance(rng, 0.55)) {
    legal.push({ title: 'Машина в залоге у банка', detail: 'Запись в реестре уведомлений о залоге. При покупке банк может забрать автомобиль.', date: isoDate(Math.max(regYear, thisYear - 2), rng), severity: 'red' });
  }
  if (profile !== 'clean' && chance(rng, 0.25)) {
    legal.push({ title: 'Ограничение на регистрационные действия', detail: 'Наложено судебными приставами. Поставить на учёт не получится, пока ограничение не снимут.', date: isoDate(thisYear, rng, 1, Math.max(1, now.getUTCMonth())), severity: 'red' });
  }
  if (!legal.length) {
    legal.push({ title: 'Залогов не найдено', severity: 'green' }, { title: 'Ограничений и розыска нет', severity: 'green' });
  }
  sections.push({ id: 'legal', title: 'Юридическая чистота', severity: worst(legal), summary: worst(legal) === 'red' ? 'Есть залог или ограничения' : 'Залогов и ограничений нет', findings: legal });

  // --- Ввоз (для иномарок не российской сборки) ---
  if (isImport) {
    const imp: Finding[] = [];
    const parallel = chance(rng, 0.6);
    imp.push({
      title: parallel ? `Параллельный импорт из страны: ${countryName(origin)}` : 'Официальная поставка через дилера',
      detail: parallel ? 'Заводская гарантия в России может не действовать, уточните у продавца документы на сервис.' : 'Машина ввезена дистрибьютором, гарантия действует по условиям бренда.',
      date: mileage[0].date,
      severity: parallel ? 'yellow' : 'green',
    });
    imp.push({ title: 'Таможенное оформление пройдено', detail: 'Выпуск в свободное обращение, электронный ПТС оформлен.', date: mileage[0].date, severity: 'green' });
    const declaredYear = VIN_YEAR[vin[9]];
    if (profile === 'bad' && chance(rng, 0.4)) {
      imp.push({ title: 'Утильсбор не подтверждён', detail: 'Нет отметки об уплате утильсбора в ЭПТС. Возможны проблемы с регистрацией.', severity: 'red' });
    } else {
      imp.push({ title: 'Утильсбор уплачен', severity: 'green' });
    }
    if (declaredYear && declaredYear !== year && Math.abs(declaredYear - year) <= 2) {
      imp.push({ title: 'Год выпуска по VIN отличается от заявленного', detail: `По VIN модельный год ${declaredYear}, в документах ${year}.`, severity: 'yellow' });
    }
    sections.push({ id: 'import', title: 'Ввоз и растаможка', severity: worst(imp), summary: imp[0].title, findings: imp });

    // История за рубежом
    const abroad: Finding[] = [];
    if (origin === 'JP' || origin === 'KR' || origin === 'US') {
      const grade = profile === 'bad' ? pick(rng, ['R', '2', '3']) : pick(rng, ['3.5', '4', '4.5']);
      const bad = grade === 'R' || grade === '2';
      abroad.push({
        title: `Продана на аукционе, оценка ${grade}`,
        detail: bad ? 'Низкая оценка: после ремонта или с серьёзными повреждениями.' : 'Нормальная аукционная оценка для своего возраста.',
        date: mileage[0].date,
        severity: bad ? 'red' : 'green',
      });
      if (origin === 'US' && profile === 'bad') {
        abroad.push({ title: 'Статус Salvage в США', detail: 'Машину признали тоталом и восстановили перед продажей.', severity: 'red' });
      }
    } else if (origin === 'CN') {
      const usedInChina = profile !== 'clean' && chance(rng, 0.5);
      abroad.push({
        title: usedInChina ? 'Машина была в эксплуатации в Китае' : 'Новая машина, вывезена без эксплуатации',
        detail: usedInChina
          ? `До вывоза пробег около ${fmtKm(mileage[0].km)}, это б/у с внутреннего рынка Китая.`
          : 'Пробег на момент экспорта небольшой, похож на перегон и логистику.',
        date: mileage[0].date,
        severity: usedInChina ? 'yellow' : 'green',
      });
      if (profile === 'bad' && chance(rng, 0.4)) {
        abroad.push({ title: 'Страховой случай в Китае', detail: 'Выплата по повреждению кузова до экспорта.', severity: 'red' });
      }
    } else {
      abroad.push({ title: `История в стране ${countryName(origin)} без происшествий`, severity: 'green' });
    }
    sections.push({ id: 'abroad', title: `История до ввоза (${countryName(origin)})`, severity: worst(abroad), summary: abroad[0].title, findings: abroad });
  }

  // --- Владельцы ---
  const owners = profile === 'clean' ? between(rng, 1, 2) : between(rng, 1, 4);
  const ownersF: Finding[] = [];
  const quick = owners >= 3 && age <= 3;
  ownersF.push({
    title: `Владельцев по ПТС: ${owners}`,
    detail: quick ? 'Много владельцев за короткий срок: так часто продают проблемные машины или перекупы.' : `Регистрация: ${pick(rng, REGIONS)}.`,
    severity: quick ? 'yellow' : 'green',
  });
  sections.push({ id: 'owners', title: 'Владельцы', severity: worst(ownersF), summary: ownersF[0].title, findings: ownersF });

  // --- Такси и каршеринг ---
  const taxi: Finding[] = [];
  if (profile !== 'clean' && chance(rng, 0.3)) {
    taxi.push({ title: 'Была лицензия такси', detail: 'Разрешение на перевозку пассажиров, высокий износ подвески и салона.', date: isoDate(Math.max(regYear, thisYear - 2), rng), severity: 'red' });
  } else {
    taxi.push({ title: 'В такси и каршеринге не работала', severity: 'green' });
  }
  sections.push({ id: 'taxi', title: 'Такси и каршеринг', severity: worst(taxi), summary: taxi[0].title, findings: taxi });

  // --- Страховые выплаты ---
  const ins: Finding[] = [];
  const payouts = accFindings.filter((f) => f.amount);
  for (const p of payouts) {
    ins.push({ title: `Выплата по ОСАГО/КАСКО: ${fmtRub((p.amount ?? 0) * 0.85)}`, date: p.date, severity: p.severity === 'red' ? 'red' : 'yellow', amount: Math.round((p.amount ?? 0) * 0.85) });
  }
  if (!ins.length) ins.push({ title: 'Страховых выплат не найдено', severity: 'green' });
  sections.push({ id: 'insurance', title: 'Страховые выплаты', severity: worst(ins), summary: payouts.length ? `Выплат: ${payouts.length}` : 'Выплат нет', findings: ins });

  // --- Обслуживание ---
  const service: Finding[] = [];
  const visits = between(rng, isImport && profile === 'bad' ? 0 : 1, 4);
  for (let i = 0; i < visits; i++) {
    service.push({ title: pick(rng, ['Плановое ТО', 'Замена масла и фильтров', 'Диагностика подвески', 'Замена тормозных колодок']), date: isoDate(Math.min(thisYear, regYear + i), rng), severity: 'info' });
  }
  if (!visits) service.push({ title: 'Нет записей о сервисе у дилеров', detail: 'Спросите у продавца сервисную книжку и чеки.', severity: 'yellow' });
  sections.push({ id: 'service', title: 'Обслуживание', severity: worst(service), summary: visits ? `Записей о сервисе: ${visits}` : 'Записей о сервисе нет', findings: service });

  // --- Отзывные кампании ---
  const recalls: Finding[] = chance(rng, 0.3)
    ? [{ title: 'Открытая отзывная кампания', detail: 'Производитель отзывал машины этой партии для замены ПО блока управления. Бесплатно у дилера.', severity: 'yellow' }]
    : [{ title: 'Открытых отзывных кампаний нет', severity: 'green' }];
  sections.push({ id: 'recalls', title: 'Отзывные кампании', severity: worst(recalls), summary: recalls[0].title, findings: recalls });

  // --- Штрафы ---
  const fineSum = profile === 'clean' ? 0 : between(rng, 0, 4) * 500;
  const fines: Finding[] = fineSum
    ? [{ title: `Неоплаченные штрафы: ${new Intl.NumberFormat('ru-RU').format(fineSum)} ₽`, detail: 'Не мешают сделке, но попросите продавца оплатить их до переоформления.', severity: 'yellow', amount: fineSum }]
    : [{ title: 'Неоплаченных штрафов нет', severity: 'green' }];
  sections.push({ id: 'fines', title: 'Штрафы', severity: worst(fines), summary: fines[0].title, findings: fines });

  // --- Объявления о продаже ---
  const listings: Finding[] = [];
  // Объявления привязаны к разным точкам пробега, без повторов
  const listCount = Math.min(between(rng, 0, 3), mileage.length - 1);
  for (let i = 0; i < listCount; i++) {
    const p = mileage[i + 1];
    listings.push({ title: `Объявление: ${fmtRub(marketPrice * (1 + 0.08 * (listCount - i)))}, пробег ${fmtKm(p.km)}`, date: p.date, severity: 'info' });
  }
  if (!listings.length) listings.push({ title: 'Раньше машину не продавали через объявления', severity: 'info' });
  sections.push({ id: 'listings', title: 'История продаж', severity: worst(listings), summary: listCount ? `Объявлений: ${listCount}` : 'Объявлений не было', findings: listings });

  // --- Итоги ---
  const allFindings = sections.flatMap((s) => s.findings);
  const redFlags = allFindings.filter((f) => f.severity === 'red').length;
  const warnings = allFindings.filter((f) => f.severity === 'yellow').length;

  const verdict = buildVerdict(sections, vehicle, redFlags, warnings);

  return {
    id: identifier,
    generatedAt: now.toISOString(),
    demo: true,
    vehicle,
    sections,
    mileage,
    redFlags,
    warnings,
    verdict,
  };
}

function buildVerdict(sections: ReportSection[], v: Vehicle, red: number, yellow: number): Verdict {
  const sec = (id: string) => sections.find((s) => s.id === id);
  const legalRed = sec('legal')?.severity === 'red';
  const reasons: string[] = [];
  const questions: string[] = [];
  let discountPct = 0;

  for (const s of sections) {
    for (const f of s.findings) {
      if (f.severity === 'red') reasons.push(f.title);
    }
  }
  if (sec('mileage')?.severity === 'red') {
    discountPct += 0.12;
    questions.push('Покажите сервисную книжку и чеки с пробегом за последние два года.');
  }
  if (sec('accidents')?.severity !== 'green') {
    discountPct += sec('accidents')?.severity === 'red' ? 0.15 : 0.04;
    questions.push('Где ремонтировали машину после ДТП? Есть ли заказ-наряд и фото до ремонта?');
  }
  if (sec('import')?.findings.some((f) => f.title.startsWith('Параллельный'))) {
    questions.push('Какие документы есть на машину из-за рубежа: экспортная декларация, СБКТС, ЭПТС?');
  }
  if (sec('taxi')?.severity === 'red') {
    discountPct += 0.08;
    questions.push('Сколько машина работала в такси и какие узлы меняли?');
  }
  if (sec('owners')?.severity === 'yellow') questions.push('Почему машину продают так быстро после покупки?');
  if (sec('fines')?.severity === 'yellow') questions.push('Оплатите, пожалуйста, штрафы до сделки.');
  if (legalRed) questions.unshift('Готовы ли вы снять залог или ограничение до сделки и показать справку из банка?');
  if (!questions.length) questions.push('Можно ли провести диагностику на независимом сервисе перед покупкой?');

  const discountRub = discountPct > 0 ? Math.round((v.marketPrice * discountPct) / 10000) * 10000 : null;

  if (legalRed || red >= 3) {
    return {
      decision: 'walk',
      headline: legalRed ? 'Не покупайте, пока не снимут залог или ограничения' : 'Слишком много красных флагов, лучше искать дальше',
      reasons: reasons.slice(0, 4),
      questions: questions.slice(0, 4),
      discountRub,
    };
  }
  if (red > 0 || yellow >= 3) {
    return {
      decision: 'negotiate',
      headline: 'Можно брать, но только с торгом и после проверки на сервисе',
      reasons: reasons.length ? reasons.slice(0, 4) : ['Несколько мелких замечаний, которые влияют на цену'],
      questions: questions.slice(0, 4),
      discountRub: discountRub ?? Math.round((v.marketPrice * 0.03) / 10000) * 10000,
    };
  }
  return {
    decision: 'buy',
    headline: 'Серьёзных проблем не нашли, машину можно смотреть',
    reasons: ['Пробег без скачков, залогов и ограничений нет'],
    questions: questions.slice(0, 3),
    discountRub: null,
  };
}
