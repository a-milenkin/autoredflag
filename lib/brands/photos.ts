import type { BrandPhoto } from './ru';

export const commons = (file: string, author: string, license: string): BrandPhoto => ({
  kind: 'commons',
  src: `https://upload.wikimedia.org/wikipedia/commons/thumb/${file}`,
  author,
  license,
  page: `https://commons.wikimedia.org/wiki/File:${decodeURIComponent(file.split('/').pop()!.replace(/^\d+px-/, ''))}`,
});

// Фото марок. Лежат отдельно от текстов, чтобы отчёт не тянул в браузер весь контент страниц марок.
export const BRAND_PHOTOS: Record<string, BrandPhoto> = {
  'haval': { kind: 'unsplash', id: 'photo-1628711956301-9e6768d8331b', author: 'Michail Dementiev' },
  'chery': commons('2/21/2023_Chery_Tiggo7_Pro_Max_grey_front.jpg/960px-2023_Chery_Tiggo7_Pro_Max_grey_front.jpg', 'Throwawayacc222', 'CC0'),
  'geely': { kind: 'unsplash', id: 'photo-1757922589165-39921febd050', author: 'Michail Dementiev' },
  'changan': { kind: 'unsplash', id: 'photo-1733512341143-bac915ac7dff', author: 'Mushvig Niftaliyev' },
  'exeed': commons('3/3b/Exeed_TXL_facelift_001.jpg/960px-Exeed_TXL_facelift_001.jpg', 'Jengtingchen', 'CC BY-SA 4.0'),
  'omoda-jaecoo': commons('5/52/Chery_Omoda_5_012.jpg/960px-Chery_Omoda_5_012.jpg', 'JustAnotherCarDesigner', 'CC0'),
  'tank': { kind: 'unsplash', id: 'photo-1786992892916-91d6a4475a1a', author: 'Azimbek Assarov' },
  'lixiang': commons('b/bc/Li_Auto_L9_2022102501.jpg/960px-Li_Auto_L9_2022102501.jpg', 'Evnerd', 'CC BY-SA 4.0'),
  'zeekr': commons('c/c5/Zeekr_001_facelift_001.jpg/960px-Zeekr_001_facelift_001.jpg', 'JustAnotherCarDesigner', 'CC0'),
  'voyah': commons('9/9c/Voyah_Free_facelift_002.jpg/960px-Voyah_Free_facelift_002.jpg', 'JustAnotherCarDesigner', 'CC0'),
  'byd': { kind: 'unsplash', id: 'photo-1780690165069-32978b08e556', author: 'Ido l' },
  'hongqi': commons('3/32/Hongqi_HS5_facelift_011.jpg/960px-Hongqi_HS5_facelift_011.jpg', 'JustAnotherCarDesigner', 'CC0'),
  'gac': commons('4/46/2021_GAC_Trumpchi_GS8_%28front%29.jpg/960px-2021_GAC_Trumpchi_GS8_%28front%29.jpg', 'User3204', 'CC BY-SA 4.0'),
  'toyota': { kind: 'unsplash', id: 'photo-1617469767053-d3b523a0b982', author: 'Krish Parmar' },
  'lexus': { kind: 'unsplash', id: 'photo-1664427356346-c31b46248e71', author: 'NAM CZ' },
  'honda': { kind: 'unsplash', id: 'photo-1627395427294-d01af2f943ac', author: 'Mufid Majnun' },
  'nissan': { kind: 'unsplash', id: 'photo-1593912123154-f4c8072e9a02', author: 'Padraig Treanor' },
  'mazda': { kind: 'unsplash', id: 'photo-1743114713466-f12a85992a75', author: 'Ryan Collins' },
  'subaru': { kind: 'unsplash', id: 'photo-1722542517938-aa6a98d25235', author: 'Andrew Van Hofwegen' },
  'mitsubishi': { kind: 'unsplash', id: 'photo-1651446404130-104e68e2f39a', author: 'Russian Supreme' },
  'suzuki': { kind: 'unsplash', id: 'photo-1624464823981-ae6ef2c9a469', author: 'Eugene Chystiakov' },
  'hyundai': { kind: 'unsplash', id: 'photo-1575090536203-2a6193126514', author: 'Duncan Winslow' },
  'kia': { kind: 'unsplash', id: 'photo-1688893287874-ac7fbd686c24', author: 'Michail Dementiev' },
  'genesis': { kind: 'unsplash', id: 'photo-1739950075618-f9ae2f90b0c0', author: 'Hyundai Motor Group' },
};

export function brandPhotoUrl(p: BrandPhoto, w = 1200, h = 800) {
  return p.kind === 'unsplash' ? `https://images.unsplash.com/${p.id}?auto=format&fit=crop&q=75&w=${w}&h=${h}` : p.src;
}

export function brandPhotoCredit(p: BrandPhoto) {
  return p.kind === 'unsplash'
    ? { author: p.author, where: 'Unsplash', href: 'https://unsplash.com', license: 'Unsplash License' }
    : { author: p.author, where: 'Wikimedia Commons', href: p.page, license: p.license };
}
