"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WatchFace } from "./watch-face";
import { ChevronDown } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { HeroContent } from "@/lib/site-defaults";

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section id="home" className="relative min-h-screen bg-grid overflow-hidden flex flex-col">
      {/* توهجات خلفية */}
      <div aria-hidden className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-white/[0.04] blur-3xl" />
      <div aria-hidden className="absolute top-1/3 -right-52 w-[40rem] h-[40rem] rounded-full bg-white/[0.03] blur-3xl" />
      {/* خط زخرفي قطري */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 bottom-0 left-[12%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute top-0 bottom-0 right-[8%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      <div className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[60vh]">
          {/* النص */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-1.5 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-white" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="text-xs sm:text-sm text-zinc-300 font-medium tracking-wide">
                {content.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.15]"
            >
              {content.title1}
              <br />
              <span className="text-shine">{content.title2}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              {content.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a href="#collection" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto clip-corner bg-white text-[#0A0A0B] hover:bg-zinc-200 font-bold h-13 px-9 text-base py-3.5">
                  {content.ctaPrimary}
                </Button>
              </a>
              <a href="#prayer" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto clip-corner border-white/25 text-white hover:bg-white/10 hover:text-white font-bold h-13 px-9 text-base py-3.5"
                >
                  {content.ctaSecondary}
                </Button>
              </a>
            </motion.div>

            {/* إحصاءات */}
            <motion.dl
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0"
            >
              {content.stats.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <div key={s.label} className="border-r-2 border-white/15 pr-3 sm:pr-4 text-right">
                    <dd className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-zinc-500 shrink-0" aria-hidden />
                      {s.value}
                    </dd>
                    <dt className="text-[11px] sm:text-xs text-zinc-500 mt-1">{s.label}</dt>
                  </div>
                );
              })}
            </motion.dl>
          </div>

          {/* الساعة */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="flex justify-center order-1 lg:order-2 relative"
          >
            <div aria-hidden className="absolute inset-0 m-auto w-[70%] h-[70%] rounded-full bg-white/[0.05] blur-3xl" />
            <WatchFace size={460} />
            <p className="sr-only">
              ساعة فالكون الرياضية — عرض حي للوقت الحالي مع الصلاة القادمة
            </p>
          </motion.div>
        </div>
      </div>

      {/* مؤشر التمرير */}
      <motion.a
        href="#collection"
        aria-label="مرر للأسفل"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 hover:text-white transition-colors"
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </motion.a>
    </section>
  );
}
