/**
 * حساب مواقيت الصلاة فلكياً — TypeScript
 * مبني على الخوارزمية الفلكية القياسية المعروفة (PrayTimes.org)
 * الطريقة: زاوية الفجر 18° / العشاء 17° (المطابقة للتقويم السوري)
 * التوقيت: سوريا UTC+3 (توقيت ثابت منذ 2022)
 */

const DEG = Math.PI / 180;
const dsin = (d: number) => Math.sin(d * DEG);
const dcos = (d: number) => Math.cos(d * DEG);
const dtan = (d: number) => Math.tan(d * DEG);
const darcsin = (x: number) => Math.asin(x) / DEG;
const darccos = (x: number) => Math.acos(x) / DEG;
const darctan2 = (y: number, x: number) => Math.atan2(y, x) / DEG;
const darccot = (x: number) => Math.atan2(1, x) / DEG;

function fix(a: number, b: number): number {
  const r = a - b * Math.floor(a / b);
  return r < 0 ? r + b : r;
}
const fixAngle = (a: number) => fix(a, 360);
const fixHour = (a: number) => fix(a, 24);

/** التاريخ اليولياني */
function julian(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5
  );
}

/** موقع الشمس: الميل ومعادلة الزمن */
function sunPosition(jd: number): { declination: number; equation: number } {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * dsin(g) + 0.02 * dsin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const RA = darctan2(dcos(e) * dsin(L), dcos(L)) / 15;
  const eqt = q / 15 - fixHour(RA);
  const decl = darcsin(dsin(e) * dsin(L));
  return { declination: decl, equation: eqt };
}

export interface PrayerParams {
  lat: number;
  lng: number;
  /** زاوية الفجر (درجات تحت الأفق) */
  fajrAngle: number;
  /** زاوية العشاء (درجات تحت الأفق) */
  ishaAngle: number;
  /** معامل العصر: 1 = الشافعي/الجمهور، 2 = الحنفي */
  asrFactor: number;
  /** فرق التوقيت عن UTC بالساعات */
  timeZone: number;
}

export const SYRIA_PARAMS: Omit<PrayerParams, "lat" | "lng"> = {
  fajrAngle: 18,
  ishaAngle: 17,
  asrFactor: 1,
  timeZone: 3, // توقيت سوريا الدائم UTC+3
};

export interface PrayerTimes {
  imsak: number;
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  sunset: number;
  maghrib: number;
  isha: number;
}

/** حساب مواقيت يوم محدد (ساعات عشرية بالتوقيت المحلي) */
export function computePrayerTimes(
  year: number,
  month: number, // 1-12
  day: number,
  params: PrayerParams
): PrayerTimes {
  const { lat, lng } = params;
  const jDate = julian(year, month, day) - lng / (15 * 24);

  const midDay = (time: number): number => {
    const eqt = sunPosition(jDate + time).equation;
    return fixHour(12 - eqt);
  };

  const sunAngleTime = (
    angle: number,
    time: number,
    direction?: "ccw"
  ): number => {
    const decl = sunPosition(jDate + time).declination;
    const noon = midDay(time);
    const t =
      (1 / 15) *
      darccos(
        (-dsin(angle) - dsin(decl) * dsin(lat)) / (dcos(decl) * dcos(lat))
      );
    return noon + (direction === "ccw" ? -t : t);
  };

  const asrTime = (factor: number, time: number): number => {
    const decl = sunPosition(jDate + time).declination;
    const angle = -darccot(factor + dtan(Math.abs(lat - decl)));
    return sunAngleTime(angle, time);
  };

  // قيم أولية ثم تحسين تكراري
  let t: PrayerTimes = {
    imsak: 5,
    fajr: 5,
    sunrise: 6,
    dhuhr: 12,
    asr: 13,
    sunset: 18,
    maghrib: 18,
    isha: 18,
  };

  for (let iter = 0; iter < 3; iter++) {
    const p = { ...t };
    const imsak = sunAngleTime(params.fajrAngle + 1.5, p.imsak / 24, "ccw");
    const fajr = sunAngleTime(params.fajrAngle, p.fajr / 24, "ccw");
    const sunrise = sunAngleTime(0.833, p.sunrise / 24, "ccw");
    const dhuhr = midDay(p.dhuhr / 24);
    const asr = asrTime(params.asrFactor, p.asr / 24);
    const sunset = sunAngleTime(0.833, p.sunset / 24);
    const maghrib = sunset + 3 / 60; // بعد الغروب 3 دقائق (هامش أمان التقويم السوري)
    const isha = sunAngleTime(params.ishaAngle, p.isha / 24);
    t = { imsak, fajr, sunrise, dhuhr, asr, sunset, maghrib, isha };
  }

  // تعديل خط الطول والمنطقة الزمنية
  const adj = params.timeZone - lng / 15;
  const out = {} as PrayerTimes;
  (Object.keys(t) as (keyof PrayerTimes)[]).forEach((k) => {
    out[k] = t[k] + adj;
  });
  return out;
}

/** تحويل ساعات عشرية إلى صيغة hh:mm */
export function formatHours(h: number): string {
  if (!isFinite(h)) return "--:--";
  let hours = Math.floor(fixHour(h + 0.5 / 60));
  const minutes = Math.floor(fix(h + 0.5 / 60, 24) * 60) % 60;
  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const hh = hours < 10 ? `0${hours}` : `${hours}`;
  return `${hh}:${mm}`;
}

export const PRAYER_NAMES: Record<
  keyof Pick<PrayerTimes, "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha">,
  string
> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

/** الوقت الحالي بالتوقيت السوري (UTC+3) كساعات عشرية من منتصف الليل */
export function nowSyriaHours(): number {
  const now = new Date();
  const utcHours =
    now.getUTCHours() +
    now.getUTCMinutes() / 60 +
    now.getUTCSeconds() / 3600 +
    now.getUTCMilliseconds() / 3600000;
  return fix(utcHours + 3, 24);
}

/** تاريخ اليوم بالتوقيت السوري */
export function syriaDate(): { year: number; month: number; day: number } {
  const now = new Date();
  const d = new Date(now.getTime() + 3 * 3600 * 1000);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** التاريخ الهجري بالعربية (تقويم أم القرى التقريبي عبر Intl) */
export function hijriDateAr(): string {
  try {
    return new Intl.DateTimeFormat("ar-SY-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Damascus",
    }).format(new Date());
  } catch {
    return "";
  }
}

/** التاريخ الميلادي بالعربية */
export function gregorianDateAr(): string {
  try {
    return new Intl.DateTimeFormat("ar-SY-u-ca-gregory", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Damascus",
    }).format(new Date());
  } catch {
    return "";
  }
}

export interface NextPrayerInfo {
  key: keyof typeof PRAYER_NAMES;
  name: string;
  /** الوقت المتبقي بالثواني */
  remainingSeconds: number;
  isTomorrow: boolean;
}

/** الصلاة القادمة اعتماداً على الوقت الحالي */
export function getNextPrayer(times: PrayerTimes): NextPrayerInfo {
  const now = nowSyriaHours();
  const order: (keyof typeof PRAYER_NAMES)[] = [
    "fajr",
    "sunrise",
    "dhuhr",
    "asr",
    "maghrib",
    "isha",
  ];
  for (const k of order) {
    if (times[k] > now) {
      return {
        key: k,
        name: PRAYER_NAMES[k],
        remainingSeconds: Math.round((times[k] - now) * 3600),
        isTomorrow: false,
      };
    }
  }
  // بعد العشاء → فجر الغد
  return {
    key: "fajr",
    name: PRAYER_NAMES.fajr,
    remainingSeconds: Math.round((24 - now + times.fajr) * 3600),
    isTomorrow: true,
  };
}

export function formatCountdown(totalSeconds: number): {
  h: string;
  m: string;
  s: string;
} {
  const s = Math.max(0, Math.floor(totalSeconds));
  return {
    h: String(Math.floor(s / 3600)).padStart(2, "0"),
    m: String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
    s: String(s % 60).padStart(2, "0"),
  };
}
