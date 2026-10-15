# AutoRedFlag

Сервис проверки авто по VIN номерам.

Прототип сервиса проверки авто по госномеру, VIN и номеру кузова с упором на машины из-за рубежа (Китай, Корея, Япония, США). Домен: autoredflag.com.

Сейчас данные **демо**: отчёты генерируются детерминированно по VIN (один VIN всегда даёт один и тот же отчёт). Оплата - заглушка.

## Стек

Next.js 15 (App Router, SSR/SSG под SEO), TypeScript, Tailwind CSS. Деплой: Vercel.

```bash
npm install
npm run dev     # http://localhost:3000 -> редирект на /ru
npm run build && npm start
```

## Страницы

| URL | Что это |
| --- | --- |
| `/ru` | Главный лендинг: поиск, тизер, якорь потерь, ИИ-вердикт, что проверяем, тарифы, гарантии, источники, FAQ |
| `/ru/world` | Лендинг про авто из Китая, Кореи, Японии, США |
| `/ru/report/{госномер или VIN}` | Бесплатный тизер со статусами разделов, пакеты, после "оплаты" - полный отчёт с вердиктом |
| `/api/check?q=` | Бесплатное превью отчёта (JSON) |
| `POST /api/report` `{id, planId}` | Полный отчёт (сейчас без проверки оплаты) |

## Где что лежит

```
app/[locale]/            страницы, /ru сейчас единственный язык
components/              UI, components/report - страница отчёта
lib/i18n/config.ts       страны: валюта, тарифы, способы оплаты
lib/i18n/dictionaries/   все тексты (ru.ts)
lib/identify.ts          распознавание госномера / VIN / номера кузова
lib/provider/            источник данных (сейчас MockProvider)
lib/provider/vinTable.ts таблица связки VIN <-> госномер
lib/report/types.ts      схема отчёта
lib/report/mock.ts       генератор демо-отчётов и ИИ-вердикта
data/vin_plate.csv       тестовая таблица VIN <-> госномер (40 машин)
```

## Как подключить реальные данные

1. **Таблица VIN и госномеров.** Замените `data/vin_plate.csv`, колонки: `vin,plate,make,model,year,origin_country`. Госномер в латинице без пробелов: `C908KX163`. Код менять не нужно. Для больших объёмов перенесём в базу (Postgres/Supabase) с тем же интерфейсом `findByVin` / `findByPlate`.
2. **API отчётов.** В `lib/provider/index.ts` добавить класс `RealProvider implements CarDataProvider`, который вызывает API и приводит ответ к схеме `Report` из `lib/report/types.ts`. Включается переменной `DATA_PROVIDER=real`, ключи в `CAR_API_URL` и `CAR_API_KEY`.
3. **Оплата.** В `app/api/report/route.ts` заменить заглушку на проверку платежа (ЮKassa или Stripe) и учёт отчётов в пакете.

## Новая страна

1. Добавить локаль в `LOCALES` и конфиг в `COUNTRIES` (`lib/i18n/config.ts`).
2. Скопировать `lib/i18n/dictionaries/ru.ts`, перевести, подключить в `lib/i18n/index.ts`.
3. Добавить формат номера страны в `lib/identify.ts`.

## Переменные окружения

| Переменная | По умолчанию | Зачем |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://autoredflag.com` | canonical, sitemap |
| `NEXT_PUBLIC_DEMO_MODE` | `true` | плашка "демо-версия" в шапке |
| `DATA_PROVIDER` | `mock` | источник данных |
