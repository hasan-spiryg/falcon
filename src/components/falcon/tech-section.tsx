"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Gem,
  BatteryFull,
  SunMoon,
  Bluetooth,
  Hammer,
  Timer,
} from "lucide-react";

const TECH = [
  {
    icon: Gem,
    title: "زجاج سافاير",
    text: "زجاج يقاوم الخدوش اليومية — من مفاتيح الجيب إلى صخور الجبل.",
  },
  {
    icon: Droplets,
    title: "مقاومة ماء 20 ATM",
    text: "من الغطس في بحر اللاذقية إلى غسيل اليدين — لا تقلق أبداً.",
  },
  {
    icon: BatteryFull,
    title: "بطارية 24 شهراً",
    text: "حركة كوارتز يابانية عالية الكفاءة، استبدال مجاني في مراكزنا.",
  },
  {
    icon: SunMoon,
    title: "إضاءة ليلية",
    text: "طبقة مضيئة على العقارب والأرقام — وضوح تام في عتمة الخيمة.",
  },
  {
    icon: Bluetooth,
    title: "تطبيق فالكون",
    text: "مزامنة المواقيت والمدينة عبر البلوتوث، وتحديثات مباشرة للتقويم.",
  },
  {
    icon: Hammer,
    title: "فولاذ 316L",
    text: "نفس فولاذ الساعات الفاخرة — مقاوم للصدأ والعرق والرطوبة.",
  },
];

export function TechSection() {
  return (
    <section id="tech" className="relative py-20 lg:py-28 bg-[#0A0A0B] overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* صورة الماكرو */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="clip-corner overflow-hidden border border-white/10">
              <img
                src="/brand/watch-macro.png"
                alt="تفاصيل صناعة ساعة فالكون — الإطار المسنن والزجاج"
                loading="lazy"
                className="w-full object-cover aspect-[4/3]"
              />
            </div>
            <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-white text-[#0A0A0B] clip-corner-sm px-5 py-3.5">
              <p className="text-2xl font-black tabular-nums" dir="ltr">
                316L
              </p>
              <p className="text-[11px] text-zinc-600 font-medium">فولاذ جراحي أصلي</p>
            </div>
          </motion.div>

          {/* الشبكة */}
          <div className="order-1 lg:order-2">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.4em] text-zinc-500"
            >
              <Timer className="w-4 h-4" aria-hidden />
              ENGINEERED TO LAST
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
            >
              تقنية لا تعرف
              <br />
              <span className="text-zinc-500">كلمة «يكفي»</span>
            </motion.h2>

            <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-7">
              {TECH.map((t, i) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="border-r-2 border-white/10 pr-4"
                >
                  <t.icon className="w-6 h-6 text-white mb-2.5" aria-hidden />
                  <h3 className="font-bold">{t.title}</h3>
                  <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">{t.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
