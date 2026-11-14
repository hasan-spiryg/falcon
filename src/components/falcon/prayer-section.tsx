"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  computePrayerTimes,
  formatCountdown,
  formatHours,
  getNextPrayer,
  gregorianDateAr,
  hijriDateAr,
  nowSyriaHours,
  syriaDate,
  SYRIA_PARAMS,
  type PrayerTimes,
} from "@/lib/praytimes";
import { SYRIAN_CITIES, IDLIB } from "@/lib/cities";
import { getIcon } from "@/lib/icons";
import type { PrayerContent } from "@/lib/site-defaults";
import {
  BellRing,
  MapPin,
  Vibrate,
  CalendarDays,
} from "lucide-react";

type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
const ORDER: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
const LABELS: Record<PrayerKey, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

export function PrayerSection({ content }: { content: PrayerContent }) {
  const [cityId, setCityId] = useState<string>(IDLIB.id);
  const [now, setNow] = useState<number | null>(null);
  const [alarms, setAlarms] = useState<Record<PrayerKey, boolean>>({
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });

  const city = SYRIAN_CITIES.find((c) => c.id === cityId) ?? IDLIB;

  const times: PrayerTimes = useMemo(() => {
    const { year, month, day } = syriaDate();
    return computePrayerTimes(year, month, day, { ...city, ...SYRIA_PARAMS });
  }, [city]);

  const mounted = now !== null;

  useEffect(() => {
    const tick = () => setNow(nowSyriaHours());
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  const next = getNextPrayer(times);
  const cd = formatCountdown(next.remainingSeconds);

  return (
    <section id="prayer" className="relative py-20 lg:py-28 bg-[#0E0E10] border-y border-white/10 overflow-hidden">
      <div aria-hidden className="absolute top-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-white/[0.03] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* النص التعريفي */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-1.5 text-xs sm:text-sm text-zinc-300 font-medium"
            >
              <BellRing className="w-3.5 h-3.5" aria-hidden />
              {content.badge}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
            >
              {content.title1}
              <br />
              <span className="text-zinc-500">{content.title2}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 text-zinc-400 text-base lg:text-lg leading-relaxed"
            >
              {content.text}
            </motion.p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-4" aria-label="مزايا منبه الصلاة">
              {content.features.map((f, i) => {
                const FeatureIcon = getIcon(f.icon);
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    className="flex gap-3.5"
                  >
                    <span className="shrink-0 w-10 h-10 border border-white/15 bg-white/5 flex items-center justify-center clip-corner-sm">
                      <FeatureIcon className="w-5 h-5 text-white" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-bold text-sm">{f.title}</h3>
                      <p className="mt-1 text-xs sm:text-[13px] text-zinc-500 leading-relaxed">{f.text}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* ويدجت المواقيت */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-[#111113] border border-white/15 clip-corner p-5 sm:p-7">
              {/* رأس الويدجت */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img src="/brand/icon_falcon_dark.png" alt="" className="w-8 h-8 object-contain" />
                  <div>
                    <p className="font-black text-lg leading-none">مواقيت الصلاة</p>
                    <p className="text-[11px] text-zinc-500 mt-1.5">توقيت سوريا — محسوبة فلكياً</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-500" aria-hidden />
                  <Select value={cityId} onValueChange={setCityId}>
                    <SelectTrigger
                      className="w-[130px] h-10 border-white/20 bg-[#0A0A0B] text-sm font-bold focus:ring-white/30"
                      aria-label="اختر المدينة"
                    >
                      <SelectValue placeholder="المدينة" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141416] border-white/15 max-h-72">
                      {SYRIAN_CITIES.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="focus:bg-white/10 focus:text-white">
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* التاريخ والعد التنازلي */}
              <div className="py-5 border-b border-white/10">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" aria-hidden />
                      {mounted ? gregorianDateAr() : "—"}
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-zinc-300">
                      {mounted ? hijriDateAr() : "—"}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-zinc-500">
                      الصلاة القادمة: <span className="text-white font-bold">{next.name}</span>
                      {next.isTomorrow && <span className="text-zinc-600"> (الغد)</span>}
                    </p>
                    <p
                      className="font-black text-3xl tracking-wider tabular-nums mt-1"
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                      dir="ltr"
                      aria-live="polite"
                    >
                      {mounted ? `${cd.h}:${cd.m}:${cd.s}` : "--:--:--"}
                    </p>
                  </div>
                </div>
                {/* شريط تقدم اليوم */}
                <div className="mt-4 h-1 bg-white/10 overflow-hidden" dir="ltr">
                  <div
                    className="h-full bg-white transition-[width] duration-1000"
                    style={{ width: mounted ? `${Math.min(100, (now / 24) * 100)}%` : "0%" }}
                  />
                </div>
              </div>

              {/* المواقيت */}
              <ul className="divide-y divide-white/[0.07]">
                {ORDER.map((k) => {
                  const isNext = next.key === k && !next.isTomorrow;
                  const isPast = mounted && times[k] <= (now ?? 0);
                  return (
                    <li
                      key={k}
                      className={`flex items-center justify-between gap-3 py-3.5 px-1 transition-colors ${
                        isNext ? "bg-white/[0.06] -mx-1 px-2" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isNext && (
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-white" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                          </span>
                        )}
                        <span
                          className={`font-bold ${isNext ? "text-white text-lg" : isPast ? "text-zinc-600" : "text-zinc-200"}`}
                        >
                          {LABELS[k]}
                        </span>
                        {isNext && (
                          <span className="text-[10px] bg-white text-[#0A0A0B] font-black px-1.5 py-0.5 shrink-0">
                            القادمة
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span
                          className={`tabular-nums font-bold text-lg ${
                            isNext ? "text-white" : isPast ? "text-zinc-600" : "text-zinc-300"
                          }`}
                          style={{ fontFamily: "'Cairo', sans-serif" }}
                          dir="ltr"
                        >
                          {formatHours(times[k])}
                        </span>
                        <Switch
                          checked={alarms[k]}
                          onCheckedChange={(v) => setAlarms((a) => ({ ...a, [k]: v }))}
                          aria-label={`تبديل منبه ${LABELS[k]}`}
                          className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/15"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">{content.note}</p>
            </div>

            {/* بطاقة عائمة — وضع المسجد */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="absolute -bottom-6 -left-2 sm:-left-6 bg-white text-[#0A0A0B] clip-corner-sm px-4 py-3 flex items-center gap-3 shadow-2xl"
            >
              <Vibrate className="w-5 h-5" aria-hidden />
              <div className="text-xs leading-tight">
                <p className="font-black">اهتزاز صامت</p>
                <p className="text-zinc-600">تنبيه لطيف لا يزعج من حولك</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
