"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Droplets, BatteryFull, Gauge, ShieldCheck } from "lucide-react";

interface WatchModel {
  id: string;
  name: string;
  latin: string;
  image: string;
  price: string;
  tagline: string;
  specs: { icon: typeof Droplets; text: string }[];
  badge?: string;
}

const MODELS: WatchModel[] = [
  {
    id: "saqr",
    name: "صقر",
    latin: "SAQR PRO",
    image: "/brand/watch-black.png",
    price: "$199",
    tagline: "الأسود التكتيكي — رفيق المغامرات القاسية",
    specs: [
      { icon: Droplets, text: "20 ATM" },
      { icon: BatteryFull, text: "بطارية سنتان" },
      { icon: Gauge, text: "فولاذ 316L" },
    ],
    badge: "الأكثر طلباً",
  },
  {
    id: "shaheen",
    name: "شاهين",
    latin: "SHAHEEN STEEL",
    image: "/brand/watch-steel.png",
    price: "$229",
    tagline: "الفولاذي الأنيق — حضور يليق بالمناسبات",
    specs: [
      { icon: Droplets, text: "10 ATM" },
      { icon: BatteryFull, text: "بطارية سنتان" },
      { icon: ShieldCheck, text: "سوار فولاذي" },
    ],
  },
  {
    id: "hurr",
    name: "حر",
    latin: "HURR WHITE",
    image: "/brand/watch-white.png",
    price: "$189",
    tagline: "الأبيض الرياضي — خفة وأناقة نهارية",
    specs: [
      { icon: Droplets, text: "10 ATM" },
      { icon: BatteryFull, text: "بطارية سنتان" },
      { icon: Gauge, text: "وزن 52غ" },
    ],
    badge: "جديد",
  },
];

export function Products() {
  return (
    <section id="collection" className="relative py-20 lg:py-28 bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-[0.4em] text-zinc-500"
          >
            THE COLLECTION
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black"
          >
            مجموعة الصقور
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-zinc-400 text-base lg:text-lg leading-relaxed"
          >
            ثلاثة طيور، ثلاث شخصيات — بنفس الروح. كل ساعة تجمع بين المتانة
            الرياضية ومنبه مواقيت الصلاة والتقويم الهجري.
          </motion.p>
        </div>

        {/* البطاقات */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {MODELS.map((m, i) => (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="group relative bg-[#111113] border border-white/10 clip-corner hover:border-white/30 transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* الصورة */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={m.image}
                  alt={`ساعة فالكون ${m.name} — ${m.tagline}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent" />
                {m.badge && (
                  <Badge className="absolute top-4 right-4 bg-white text-[#0A0A0B] font-bold border-0 clip-corner-sm">
                    {m.badge}
                  </Badge>
                )}
                <span className="absolute bottom-4 left-4 text-[10px] tracking-[0.3em] text-zinc-500 font-sans">
                  {m.latin}
                </span>
              </div>

              {/* المحتوى */}
              <div className="p-5 lg:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-black">فالكون {m.name}</h3>
                    <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{m.tagline}</p>
                  </div>
                  <div className="text-left shrink-0" dir="ltr">
                    <span className="text-2xl font-black text-white">{m.price}</span>
                  </div>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2" aria-label="المواصفات">
                  {m.specs.map((s, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-1.5 text-xs text-zinc-300 bg-white/5 border border-white/10 px-2.5 py-1.5"
                    >
                      <s.icon className="w-3.5 h-3.5 text-zinc-500" aria-hidden />
                      {s.text}
                    </li>
                  ))}
                </ul>

                <a href="#order" className="block mt-6">
                  <Button className="w-full clip-corner-sm bg-white text-[#0A0A0B] hover:bg-zinc-200 font-bold h-11 gap-2">
                    <ShoppingCart className="w-4 h-4" aria-hidden />
                    اطلب الآن
                  </Button>
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-zinc-600">
          جميع الأسعار شاملة الضمان والدعم الفني — التوصيل متاح لكل المحافظات السورية
        </p>
      </div>
    </section>
  );
}
