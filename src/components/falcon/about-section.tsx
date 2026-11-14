"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Truck, RefreshCcw, Wrench } from "lucide-react";

const TRUST = [
  { icon: BadgeCheck, title: "ضمان 5 سنوات", text: "على الحركة والعلبة في كل مركز خدمة" },
  { icon: Truck, title: "توصيل لكل المحافظات", text: "ودفع عند الاستلام داخل سوريا" },
  { icon: RefreshCcw, title: "استبدال 30 يوماً", text: "لم تناسبك؟ استبدلها دون أسئلة" },
  { icon: Wrench, title: "صيانة سورية", text: "مراكز معتمدة في دمشق وحلب وحمص" },
];

export function AboutSection() {
  return (
    <>
      {/* قصتنا */}
      <section id="story" className="relative py-20 lg:py-28 bg-[#0E0E10] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-bold tracking-[0.4em] text-zinc-500"
              >
                OUR STORY
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
              >
                من دمشق،
                <br />
                <span className="text-zinc-500">إلى معصم كل عربي</span>
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 space-y-4 text-zinc-400 text-base lg:text-lg leading-loose"
              >
                <p>
                  وُلدت فالكون من فكرة بسيطة: لماذا يستورد السوري ساعته من الخارج،
                  بينما يد السوري تصنع أجمل الأشياء؟ بدأنا بورشة صغيرة في دمشق
                  وشغف كبير بالتوقيت والدقة — فالصقر لا يخطئ انقضاضته.
                </p>
                <p>
                  اليوم، تجمع كل ساعة فالكون بين الحركة اليابانية الدقيقة واللمسة
                  السورية في التصميم والتجنيد. ساعة رياضية تليق بمن يصحو للفجر
                  ويعمل حتى الليل، بمنبه صلاة يجعل الوقت عبادةً لا روتيناً.
                </p>
              </motion.div>
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-8 border-r-4 border-white pr-5 py-1"
              >
                <p className="text-xl lg:text-2xl font-black leading-relaxed">
                  «نحن لا نبيع ساعات، نحن نصنع رفيقاً للوقت.»
                </p>
                <footer className="mt-2 text-sm text-zinc-500">— فريق فالكون، دمشق</footer>
              </motion.blockquote>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="clip-corner overflow-hidden border border-white/10">
                <img
                  src="/brand/watch-lifestyle.png"
                  alt="رياضي يرتدي ساعة فالكون الرياضية السوداء"
                  loading="lazy"
                  className="w-full object-cover aspect-[4/3]"
                />
              </div>
              <div className="absolute -bottom-5 -left-3 sm:-left-5 bg-white text-[#0A0A0B] clip-corner-sm px-5 py-3.5 max-w-[240px]">
                <p className="font-black text-sm leading-snug">صُنع بفخر في سوريا</p>
                <p className="text-[11px] text-zinc-600 mt-1">تصميم وتجنيد: دمشق · حركة: يابان</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* شريط الثقة */}
      <section className="bg-white text-[#0A0A0B] py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
            {TRUST.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-3.5"
              >
                <t.icon className="w-7 h-7 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <h3 className="font-black">{t.title}</h3>
                  <p className="mt-1 text-[13px] text-zinc-600 leading-relaxed">{t.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
