// Фото с Unsplash (бесплатная лицензия https://unsplash.com/license).
// Отдаются напрямую с CDN Unsplash, размер задаётся параметрами imgix.

export type Photo = { id: string; alt: string; author: string; crop?: string };

export const PHOTOS = {
  forestSuv: { id: 'photo-1757922589650-136e4e9d877a', alt: 'Тёмно-синий кроссовер на лесной дороге', author: 'Michail Dementiev' },
  offroad: { id: 'photo-1786992689831-051bb93ba423', alt: 'Чёрный рамный внедорожник на лесной дороге', author: 'Azimbek Assarov' },
  chinaRoad: { id: 'photo-1682082435544-3ed4c166cf55', alt: 'Машины на дороге в Китае на фоне пагоды', author: 'Bo Zhang' },
  crash: { id: 'photo-1597328290883-50c5787b7c7e', alt: 'Серебристая машина с разбитой передней частью', author: 'Clark Van Der Beken' },
  keys: { id: 'photo-1761014586544-53fe5e1f1e25', alt: 'Передача ключей от машины', author: 'yahdi yasya' },
  dashboard: { id: 'photo-1585014165903-6d6c6ebad3e9', alt: 'Приборная панель автомобиля с одометром', author: 'Dennis Eusebio' },
} satisfies Record<string, Photo>;

export function photoUrl(p: Photo, w: number, h?: number): string {
  const size = h ? `&w=${w}&h=${h}` : `&w=${w}`;
  const crop = p.crop ? `&crop=${p.crop}` : '';
  return `https://images.unsplash.com/${p.id}?auto=format&fit=crop&q=75${crop}${size}`;
}

export function photoSrcSet(p: Photo, widths: number[], ratio?: number): string {
  return widths.map((w) => `${photoUrl(p, w, ratio ? Math.round(w / ratio) : undefined)} ${w}w`).join(', ');
}

export const PHOTO_AUTHORS = [...new Set(Object.values(PHOTOS).map((p) => p.author))];
