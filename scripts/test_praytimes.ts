// Quick sanity check of prayer times for Damascus vs Aladhan API reference
import { computePrayerTimes, formatHours, SYRIA_PARAMS } from "../src/lib/praytimes";

const cities = [
  { name: "Damascus", lat: 33.5138, lng: 36.2765 },
  { name: "Aleppo", lat: 36.2021, lng: 37.1343 },
];

for (const c of cities) {
  const t = computePrayerTimes(2026, 11, 14, { ...c, ...SYRIA_PARAMS });
  console.log(`--- ${c.name} 2026-11-14`);
  console.log(
    ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]
      .map((k) => `${k}: ${formatHours(t[k as keyof typeof t])}`)
      .join("  ")
  );
}
