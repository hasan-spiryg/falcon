/** المدن السورية مع إحداثياتها */
export interface SyrianCity {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
}

export const SYRIAN_CITIES: SyrianCity[] = [
  { id: "damascus", name: "دمشق", nameEn: "Damascus", lat: 33.5138, lng: 36.2765 },
  { id: "aleppo", name: "حلب", nameEn: "Aleppo", lat: 36.2021, lng: 37.1343 },
  { id: "homs", name: "حمص", nameEn: "Homs", lat: 34.7324, lng: 36.7137 },
  { id: "latakia", name: "اللاذقية", nameEn: "Latakia", lat: 35.5184, lng: 35.7807 },
  { id: "hama", name: "حماه", nameEn: "Hama", lat: 35.1318, lng: 36.7578 },
  { id: "tartus", name: "طرطوس", nameEn: "Tartus", lat: 34.889, lng: 35.8866 },
  { id: "deirezzor", name: "دير الزور", nameEn: "Deir ez-Zor", lat: 35.336, lng: 40.145 },
  { id: "hasakah", name: "الحسكة", nameEn: "Al-Hasakah", lat: 36.5069, lng: 40.7476 },
  { id: "raqqa", name: "الرقة", nameEn: "Ar-Raqqah", lat: 35.9505, lng: 38.9982 },
  { id: "idlib", name: "إدلب", nameEn: "Idlib", lat: 35.931, lng: 36.6326 },
  { id: "suwayda", name: "السويداء", nameEn: "As-Suwayda", lat: 32.7058, lng: 36.5662 },
  { id: "daraa", name: "درعا", nameEn: "Daraa", lat: 32.6253, lng: 36.1032 },
  { id: "quneitra", name: "القنيطرة", nameEn: "Quneitra", lat: 33.126, lng: 35.82 },
  { id: "palmyra", name: "تدمر", nameEn: "Palmyra", lat: 34.5526, lng: 38.2791 },
];

/** دمشق — عاصمة المواقيت */
export const DAMASCUS = SYRIAN_CITIES[0];

/** إدلب — المركز الرئيسي للبراند والمدينة الافتراضية */
export const IDLIB = SYRIAN_CITIES.find((c) => c.id === "idlib") ?? DAMASCUS;
