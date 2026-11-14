"use client";

import { useEffect, useMemo, useState } from "react";
import {
  computePrayerTimes,
  formatCountdown,
  formatHours,
  getNextPrayer,
  syriaDate,
  SYRIA_PARAMS,
  type NextPrayerInfo,
} from "@/lib/praytimes";
import { DAMASCUS } from "@/lib/cities";

interface TimeState {
  h: number;
  m: number;
  s: number;
}

/** تقريب لمنزلتين — لثبات القيم بين الخادم والمتصفح (منع hydration mismatch) */
const r2 = (v: number) => Math.round(v * 100) / 100;

/**
 * مينا ساعة فالكون — SVG حيوية تعرض الوقت الفعلي
 * مع نافذة رقمية للصلاة القادمة وعلامات مواقيت الصلاة على القرص
 */
export function WatchFace({ size = 400 }: { size?: number }) {
  const [time, setTime] = useState<TimeState | null>(null);
  const [next, setNext] = useState<NextPrayerInfo | null>(null);
  const [countdown, setCountdown] = useState<{ h: string; m: string; s: string } | null>(null);

  const times = useMemo(() => {
    const { year, month, day } = syriaDate();
    return computePrayerTimes(year, month, day, { ...DAMASCUS, ...SYRIA_PARAMS });
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      // التوقيت السوري UTC+3 لعرض الوقت على المينا
      const sy = new Date(d.getTime() + 3 * 3600 * 1000);
      setTime({ h: sy.getUTCHours(), m: sy.getUTCMinutes(), s: sy.getUTCSeconds() });
      const np = getNextPrayer(times);
      setNext(np);
      setCountdown(formatCountdown(np.remainingSeconds));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [times]);

  // زوايا العقارب (12 ساعة)
  const secAngle = time ? time.s * 6 : 0;
  const minAngle = time ? (time.m + time.s / 60) * 6 : 0;
  const hourAngle = time ? ((time.h % 12) + time.m / 60) * 30 : 0;

  // علامات مواقيت الصلاة على القرص (خريطة 12 ساعة)
  const prayerKeys = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;
  const prayerDots = prayerKeys.map((k) => {
    const ang = ((times[k] % 12) / 12) * 360;
    return { k, ang, isNext: next?.key === k && !next.isTomorrow };
  });

  return (
    <div className="relative w-full" style={{ maxWidth: size }}>
      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        className="w-full h-auto"
        role="img"
        aria-label="ساعة فالكون الرياضية — عرض حي"
      >
        <defs>
          <radialGradient id="dialGrad" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#232326" />
            <stop offset="55%" stopColor="#121214" />
            <stop offset="100%" stopColor="#08080a" />
          </radialGradient>
          <linearGradient id="caseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a3a3f" />
            <stop offset="30%" stopColor="#141416" />
            <stop offset="60%" stopColor="#2c2c30" />
            <stop offset="100%" stopColor="#0c0c0e" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="glowW" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* حلقة خارجية — هالة */}
        <circle cx="200" cy="200" r="196" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />
        <circle cx="200" cy="200" r="191" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.5" />

        {/* علبة الساعة */}
        <circle cx="200" cy="200" r="188" fill="url(#caseGrad)" />
        <circle cx="200" cy="200" r="188" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1" />

        {/* إطار مسنن */}
        <g opacity="0.9">
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i * 6 * Math.PI) / 180;
            const isFive = i % 5 === 0;
            const r1 = 184;
            const r2d = isFive ? 172 : 178;
            return (
              <line
                key={i}
                x1={r2(200 + r1 * Math.sin(a))}
                y1={r2(200 - r1 * Math.cos(a))}
                x2={r2(200 + r2d * Math.sin(a))}
                y2={r2(200 - r2d * Math.cos(a))}
                stroke={isFive ? "#f5f5f5" : "#8a8a90"}
                strokeWidth={isFive ? 3 : 1.4}
              />
            );
          })}
        </g>

        {/* المينا */}
        <circle cx="200" cy="200" r="168" fill="url(#dialGrad)" />
        <circle cx="200" cy="200" r="168" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />

        {/* علامات الساعات */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const cx = 200 + 138 * Math.sin(a);
          const cy = 200 - 138 * Math.cos(a);
          return (
            <rect
              key={i}
              x={r2(cx - 4)}
              y={r2(cy - 12)}
              width={8}
              height={24}
              rx={1}
              fill={i === 0 ? "#ffffff" : "#e8e8ea"}
              transform={`rotate(${i * 30} ${r2(cx)} ${r2(cy)})`}
              opacity={i === 0 ? 1 : 0.92}
            />
          );
        })}

        {/* نقاط مواقيت الصلاة على القرص */}
        {prayerDots.map(({ k, ang, isNext }) => {
          const a = (ang * Math.PI) / 180;
          const cx = r2(200 + 152 * Math.sin(a));
          const cy = r2(200 - 152 * Math.cos(a));
          return (
            <g key={k}>
              {isNext && (
                <circle cx={cx} cy={cy} r="7" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.5">
                  <animate attributeName="r" values="4;9" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={cx} cy={cy} r={isNext ? 3.4 : 2.2} fill={isNext ? "#ffffff" : "#9a9aa0"} filter={isNext ? "url(#glowW)" : undefined} />
            </g>
          );
        })}

        {/* شعار فالكون على المينا */}
        <text x="200" y="112" textAnchor="middle" fill="#f2f2f2" fontSize="13" fontWeight="800" fontFamily="Cairo, sans-serif" letterSpacing="4">
          FALCON
        </text>
        <image href="/brand/icon_falcon_dark.png" x="178" y="124" width="44" height="32" opacity="0.1" preserveAspectRatio="xMidYMid meet" />
        <text x="200" y="182" textAnchor="middle" fill="#9a9aa0" fontSize="8" fontFamily="Tajawal, sans-serif" letterSpacing="2.5">
          DAMASCUS · SAQR-24
        </text>

        {/* نافذة الصلاة القادمة الرقمية */}
        <g>
          <rect x="128" y="238" width="144" height="52" rx="4" fill="#050506" stroke="#ffffff" strokeOpacity="0.16" />
          <rect x="128" y="238" width="144" height="2" fill="#ffffff" opacity="0.1" />
          <text x="200" y="256" textAnchor="middle" fill="#b8b8bd" fontSize="9" fontFamily="Tajawal, sans-serif">
            الصلاة القادمة
          </text>
          <text x="200" y="273" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily="Tajawal, sans-serif">
            {next ? `${next.name}${next.isTomorrow ? " (غداً)" : ""}  ·  ${formatHours(times[next.key])}` : "—"}
          </text>
          <text x="200" y="286" textAnchor="middle" fill="#e8e8ea" fontSize="9.5" fontFamily="Cairo, sans-serif" letterSpacing="1.5">
            {countdown ? `${countdown.h}:${countdown.m}:${countdown.s}` : "--:--:--"}
          </text>
        </g>

        {/* عقارب */}
        <g className="hand-shadow">
          {/* عقرب الساعات — مع ثقل مضاد رشيق */}
          <g transform={`rotate(${hourAngle} 200 200)`}>
            <rect x="196" y="124" width="8" height="84" rx="3" fill="#f5f5f7" />
            <rect x="197.5" y="132" width="5" height="62" rx="2" fill="#111113" opacity="0.25" />
            <rect x="195.5" y="205" width="9" height="14" rx="3" fill="#f5f5f7" />
          </g>
          {/* عقرب الدقائق — مع ثقل مضاد رشيق */}
          <g transform={`rotate(${minAngle} 200 200)`}>
            <rect x="197" y="80" width="6" height="130" rx="3" fill="#f5f5f7" />
            <rect x="196" y="207" width="8" height="11" rx="3" fill="#f5f5f7" />
          </g>
          {/* عقرب الثواني — ذيل وثقل */}
          <g transform={`rotate(${secAngle} 200 200)`}>
            <rect x="198.7" y="76" width="2.6" height="136" rx="1.3" fill="#ffffff" />
            <circle cx="200" cy="76" r="3.2" fill="#ffffff" />
            <circle cx="200" cy="212" r="3.4" fill="#ffffff" />
          </g>
        </g>
        <circle cx="200" cy="200" r="7" fill="#1a1a1d" stroke="#ffffff" strokeWidth="2" />

        {/* زجاج منعكس */}
        <path d="M 60 130 A 150 150 0 0 1 260 52 L 200 200 Z" fill="url(#glassGrad)" opacity="0.5" />
        <circle cx="200" cy="200" r="168" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="2" />
      </svg>
    </div>
  );
}
