import type { BrandPhoto } from './brands/ru';
import { BRAND_PHOTOS, commons } from './brands/photos';

// Каталог моделей: фото и типовые характеристики по марке и модели.
// Марку и модель мы знаем по VIN (или по связке госномер-VIN), поэтому в отчёте показываем фото этой модели.

type Spec = { engine: string; power: number; body: string };

const key = (make: string, model: string) => `${make}|${model}`.toLowerCase().replace(/\s+/g, ' ');

// Синонимы марок из разных источников данных
const MAKE_ALIASES: Record<string, string> = { lixiang: 'Li Auto', 'li xiang': 'Li Auto', li: 'Li Auto', gwm: 'Great Wall', 'great wall tank': 'Tank', 'mercedes': 'Mercedes-Benz' };

// Марка -> страница марки (для фото марки, если модели нет в каталоге)
const MAKE_TO_BRAND: Record<string, string> = {
  haval: 'haval', chery: 'chery', geely: 'geely', changan: 'changan', exeed: 'exeed', omoda: 'omoda-jaecoo', jaecoo: 'omoda-jaecoo', tank: 'tank',
  'li auto': 'lixiang', zeekr: 'zeekr', voyah: 'voyah', byd: 'byd', hongqi: 'hongqi', gac: 'gac', toyota: 'toyota', lexus: 'lexus', honda: 'honda',
  nissan: 'nissan', mazda: 'mazda', subaru: 'subaru', mitsubishi: 'mitsubishi', suzuki: 'suzuki', hyundai: 'hyundai', kia: 'kia', genesis: 'genesis',
};

// Фото конкретных моделей. Где фото марки и есть эта модель, берём его.
const MODEL_PHOTOS: Record<string, BrandPhoto> = {
  [key('Haval', 'Jolion')]: BRAND_PHOTOS.haval,
  [key('Haval', 'F7')]: commons('6/64/Haval_F7.jpg/960px-Haval_F7.jpg', 'Milhouse35', 'CC BY-SA 4.0'),
  [key('Haval', 'Dargo')]: commons('c/cb/Haval_Big_Dog_II_003.jpg/960px-Haval_Big_Dog_II_003.jpg', 'JustAnotherCarDesigner', 'CC BY-SA 4.0'),
  [key('Chery', 'Tiggo 7 Pro')]: BRAND_PHOTOS.chery,
  [key('Chery', 'Tiggo 8 Pro Max')]: commons('f/f1/2023_Chery_Tiggo8_Pro_Max_%28LV%D0%A2%29_silver_front.jpg/960px-2023_Chery_Tiggo8_Pro_Max_%28LV%D0%A2%29_silver_front.jpg', 'Throwawayacc222', 'CC0'),
  [key('Geely', 'Monjaro')]: BRAND_PHOTOS.geely,
  [key('Geely', 'Coolray')]: commons('c/c1/2018_Geely_Binyue.jpg/960px-2018_Geely_Binyue.jpg', 'User3204', 'CC BY-SA 4.0'),
  [key('Geely', 'Atlas')]: commons('6/6d/2023_Geely_Boyue_L_%282%29%2C_front_8.3.23.jpg/960px-2023_Geely_Boyue_L_%282%29%2C_front_8.3.23.jpg', 'Kevauto', 'CC BY-SA 4.0'),
  [key('Geely', 'Tugella')]: commons('f/f1/Geely_Xingyue_001.jpg/960px-Geely_Xingyue_001.jpg', 'Jengtingchen', 'CC BY-SA 4.0'),
  [key('Changan', 'UNI-K')]: commons('8/84/Changan_UNI-K_001.jpg/960px-Changan_UNI-K_001.jpg', 'Jengtingchen', 'CC BY-SA 4.0'),
  [key('Changan', 'Alsvin')]: commons('5/5e/Changan_Alsvin_II_003.jpg/960px-Changan_Alsvin_II_003.jpg', 'Jengtingchen', 'CC BY-SA 4.0'),
  [key('Exeed', 'TXL')]: BRAND_PHOTOS.exeed,
  [key('Exeed', 'LX')]: commons('d/da/Exeed_LX_003.jpg/960px-Exeed_LX_003.jpg', 'Jengtingchen', 'CC BY-SA 4.0'),
  [key('Omoda', 'C5')]: BRAND_PHOTOS['omoda-jaecoo'],
  [key('Jaecoo', 'J7')]: commons('d/d2/2024_Jaecoo_J7.jpg/960px-2024_Jaecoo_J7.jpg', 'Calreyn88', 'CC BY-SA 4.0'),
  [key('Tank', '300')]: BRAND_PHOTOS.tank,
  [key('Li Auto', 'L7')]: commons('e/ed/Li_Auto_L7_008.jpg/960px-Li_Auto_L7_008.jpg', 'Quzhouliulian', 'CC0'),
  [key('Li Auto', 'L9')]: BRAND_PHOTOS.lixiang,
  [key('Zeekr', '001')]: BRAND_PHOTOS.zeekr,
  [key('Voyah', 'Free')]: BRAND_PHOTOS.voyah,
  [key('BYD', 'Song Plus')]: commons('f/f4/BYD_SONG_PLUS_DM-I_FRONT.jpg/960px-BYD_SONG_PLUS_DM-I_FRONT.jpg', 'Mateusmatsuda', 'CC BY 4.0'),
  [key('Hongqi', 'HS5')]: BRAND_PHOTOS.hongqi,
  [key('GAC', 'GS8')]: BRAND_PHOTOS.gac,
  [key('Toyota', 'RAV4')]: BRAND_PHOTOS.toyota,
  [key('Toyota', 'Camry')]: commons('e/ef/Toyota_Camry_%28XV70%29_IMG_9081.jpg/960px-Toyota_Camry_%28XV70%29_IMG_9081.jpg', 'Alexander-93', 'CC BY-SA 4.0'),
  [key('Toyota', 'Aqua')]: commons('6/69/Toyota_Prius_c_NHP10_Super_Red_02.jpg/960px-Toyota_Prius_c_NHP10_Super_Red_02.jpg', 'Ethan Llamas', 'CC BY-SA 4.0'),
  [key('Lexus', 'RX')]: BRAND_PHOTOS.lexus,
  [key('Honda', 'Vezel')]: BRAND_PHOTOS.honda,
  [key('Nissan', 'X-Trail')]: BRAND_PHOTOS.nissan,
  [key('Mazda', 'CX-5')]: BRAND_PHOTOS.mazda,
  [key('Subaru', 'Forester')]: BRAND_PHOTOS.subaru,
  [key('Mitsubishi', 'Outlander')]: commons('0/0d/Mitsubishi_Outlander_%28third_generation%2C_2012%29_03.jpg/960px-Mitsubishi_Outlander_%28third_generation%2C_2012%29_03.jpg', 'Alekc2m', 'CC BY-SA 4.0'),
  [key('Suzuki', 'Jimny')]: BRAND_PHOTOS.suzuki,
  [key('Hyundai', 'Tucson')]: BRAND_PHOTOS.hyundai,
  [key('Hyundai', 'Palisade')]: commons('4/4f/Hyundai_Palisade_IMG_7301.jpg/960px-Hyundai_Palisade_IMG_7301.jpg', 'Alexander-93', 'CC BY-SA 4.0'),
  [key('Hyundai', 'Solaris')]: commons('8/8b/2014-2017_Hyundai_Solaris_Sedan_%28front%29.jpg/960px-2014-2017_Hyundai_Solaris_Sedan_%28front%29.jpg', 'Self-Proclaimed-Car-Enthusiast', 'CC BY-SA 4.0'),
  [key('Kia', 'Sportage')]: BRAND_PHOTOS.kia,
  [key('Kia', 'K5')]: commons('1/1d/Kia_K5_DL3_1.6_T-GDi.jpg/960px-Kia_K5_DL3_1.6_T-GDi.jpg', 'Avante2025', 'CC BY 4.0'),
  [key('Kia', 'Rio')]: commons('e/ef/Kia_Rio_QB_Sedan_%28front%29.jpg/960px-Kia_Rio_QB_Sedan_%28front%29.jpg', 'Self-Proclaimed-Car-Enthusiast', 'CC BY-SA 4.0'),
  [key('Kia', 'Sorento')]: commons('0/05/2020_Kia_Sorento_4_HEV_AWD_Automatic_1.6_Front.jpg/960px-2020_Kia_Sorento_4_HEV_AWD_Automatic_1.6_Front.jpg', 'Vauxford', 'CC BY-SA 4.0'),
  [key('Genesis', 'GV80')]: BRAND_PHOTOS.genesis,
  [key('BMW', 'X5')]: commons('9/96/BMW_X5_%28G05%29_China.jpg/960px-BMW_X5_%28G05%29_China.jpg', 'Dinkun Chen', 'CC BY-SA 4.0'),
  [key('Ford', 'Explorer')]: commons('b/b5/2020_Ford_Explorer_%28sixth_generation%29_3.jpg/960px-2020_Ford_Explorer_%28sixth_generation%29_3.jpg', 'Benespit', 'CC BY-SA 4.0'),
  [key('Lada', 'Vesta')]: commons('0/05/Lada_Vesta_Sport_%28Lada_Sport%29.jpg/960px-Lada_Vesta_Sport_%28Lada_Sport%29.jpg', 'Dmitry Racer', 'CC BY-SA 4.0'),
  [key('Mercedes-Benz', 'E-Class')]: commons('0/06/MERCEDES-BENZ_E-CLASS_%28W213%29_China.jpg/960px-MERCEDES-BENZ_E-CLASS_%28W213%29_China.jpg', 'Dinkun Chen', 'CC BY-SA 4.0'),
  [key('Skoda', 'Octavia')]: commons('8/8b/2020_Skoda_Octavia_vRS_Challenge_TSI_-_1984cc_2.0_%28245PS%29_Petrol_-_White_-_05-2024%2C_Side.jpg/960px-2020_Skoda_Octavia_vRS_Challenge_TSI_-_1984cc_2.0_%28245PS%29_Petrol_-_White_-_05-2024%2C_Side.jpg', 'Harvey Bold', 'CC BY 4.0'),
  [key('Tesla', 'Model Y')]: commons('5/5c/Tesla_Model_Y_1X7A6211.jpg/960px-Tesla_Model_Y_1X7A6211.jpg', 'Alexander Migl', 'CC BY-SA 4.0'),
  [key('Volkswagen', 'Tiguan')]: commons('6/68/16_Volkswagen_Tiguan_%282016-2021%29_1.jpg/960px-16_Volkswagen_Tiguan_%282016-2021%29_1.jpg', 'Benespit', 'CC BY-SA 4.0'),
};

// Типовые характеристики для демо-отчётов. Реальные придут из API.
const SPECS: Record<string, Spec> = {
  [key('Haval', 'Jolion')]: { engine: '1.5 л, бензин, турбо', power: 143, body: 'Кроссовер' },
  [key('Haval', 'F7')]: { engine: '2.0 л, бензин, турбо', power: 190, body: 'Кроссовер' },
  [key('Haval', 'Dargo')]: { engine: '2.0 л, бензин, турбо', power: 192, body: 'Кроссовер' },
  [key('Chery', 'Tiggo 7 Pro')]: { engine: '1.5 л, бензин, турбо', power: 147, body: 'Кроссовер' },
  [key('Chery', 'Tiggo 8 Pro Max')]: { engine: '2.0 л, бензин, турбо', power: 197, body: 'Кроссовер' },
  [key('Geely', 'Monjaro')]: { engine: '2.0 л, бензин, турбо', power: 238, body: 'Кроссовер' },
  [key('Geely', 'Coolray')]: { engine: '1.5 л, бензин, турбо', power: 150, body: 'Кроссовер' },
  [key('Geely', 'Atlas')]: { engine: '2.0 л, бензин, турбо', power: 200, body: 'Кроссовер' },
  [key('Geely', 'Tugella')]: { engine: '2.0 л, бензин, турбо', power: 238, body: 'Кроссовер' },
  [key('Changan', 'UNI-K')]: { engine: '2.0 л, бензин, турбо', power: 226, body: 'Кроссовер' },
  [key('Changan', 'CS55 Plus')]: { engine: '1.5 л, бензин, турбо', power: 181, body: 'Кроссовер' },
  [key('Changan', 'Alsvin')]: { engine: '1.5 л, бензин', power: 107, body: 'Седан' },
  [key('Exeed', 'TXL')]: { engine: '1.6 л, бензин, турбо', power: 186, body: 'Кроссовер' },
  [key('Omoda', 'C5')]: { engine: '1.5 л, бензин, турбо', power: 147, body: 'Кроссовер' },
  [key('Jaecoo', 'J7')]: { engine: '1.6 л, бензин, турбо', power: 186, body: 'Кроссовер' },
  [key('Tank', '300')]: { engine: '2.0 л, бензин, турбо', power: 220, body: 'Внедорожник' },
  [key('Li Auto', 'L7')]: { engine: 'Гибрид с мотором-расширителем 1.5 л', power: 449, body: 'Кроссовер' },
  [key('Zeekr', '001')]: { engine: 'Электро', power: 544, body: 'Лифтбек' },
  [key('Voyah', 'Free')]: { engine: 'Гибрид с мотором-расширителем 1.5 л', power: 490, body: 'Кроссовер' },
  [key('BYD', 'Song Plus')]: { engine: 'Гибрид, 1.5 л', power: 197, body: 'Кроссовер' },
  [key('Toyota', 'RAV4')]: { engine: '2.0 л, бензин', power: 149, body: 'Кроссовер' },
  [key('Toyota', 'Camry')]: { engine: '2.5 л, бензин', power: 200, body: 'Седан' },
  [key('Lexus', 'RX')]: { engine: '3.5 л, бензин', power: 300, body: 'Кроссовер' },
  [key('Honda', 'Vezel')]: { engine: 'Гибрид, 1.5 л', power: 132, body: 'Кроссовер' },
  [key('Nissan', 'X-Trail')]: { engine: '2.5 л, бензин', power: 171, body: 'Кроссовер' },
  [key('Mazda', 'CX-5')]: { engine: '2.0 л, бензин', power: 150, body: 'Кроссовер' },
  [key('Hyundai', 'Tucson')]: { engine: '2.0 л, бензин', power: 150, body: 'Кроссовер' },
  [key('Hyundai', 'Palisade')]: { engine: '3.5 л, бензин', power: 249, body: 'Внедорожник' },
  [key('Hyundai', 'Solaris')]: { engine: '1.6 л, бензин', power: 123, body: 'Седан' },
  [key('Kia', 'K5')]: { engine: '2.5 л, бензин', power: 194, body: 'Седан' },
  [key('Kia', 'Rio')]: { engine: '1.6 л, бензин', power: 123, body: 'Седан' },
  [key('Kia', 'Sorento')]: { engine: '2.5 л, бензин', power: 180, body: 'Кроссовер' },
  [key('Genesis', 'GV80')]: { engine: '2.5 л, бензин, турбо', power: 304, body: 'Внедорожник' },
  [key('BMW', 'X5')]: { engine: '3.0 л, бензин, турбо', power: 340, body: 'Внедорожник' },
  [key('Ford', 'Explorer')]: { engine: '3.5 л, бензин', power: 249, body: 'Внедорожник' },
  [key('Lada', 'Vesta')]: { engine: '1.6 л, бензин', power: 106, body: 'Седан' },
  [key('Mercedes-Benz', 'E-Class')]: { engine: '2.0 л, бензин, турбо', power: 197, body: 'Седан' },
  [key('Skoda', 'Octavia')]: { engine: '1.4 л, бензин, турбо', power: 150, body: 'Лифтбек' },
  [key('Tesla', 'Model Y')]: { engine: 'Электро', power: 351, body: 'Кроссовер' },
  [key('Volkswagen', 'Tiguan')]: { engine: '2.0 л, бензин, турбо', power: 180, body: 'Кроссовер' },
};

function normMake(make: string) {
  const m = make.trim().toLowerCase();
  return (MAKE_ALIASES[m] ?? make).trim();
}

export function getSpec(make: string, model: string): Spec | undefined {
  return SPECS[key(normMake(make), model)];
}

/** Фото модели, если есть, иначе фото марки. exact=false значит, что на фото другая модель этой марки. */
export function getCarPhoto(make: string, model: string): { photo: BrandPhoto; exact: boolean } | null {
  const mk = normMake(make);
  const exact = MODEL_PHOTOS[key(mk, model)];
  if (exact) return { photo: exact, exact: true };
  const brand = MAKE_TO_BRAND[mk.toLowerCase()];
  if (brand && BRAND_PHOTOS[brand]) return { photo: BRAND_PHOTOS[brand], exact: false };
  return null;
}
