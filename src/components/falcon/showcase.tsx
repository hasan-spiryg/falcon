"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

/** بانر عرض درامي للساعة الأساسية */
export function Showcase() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0B]" aria-label="ساعة صقر برو">
      <div className="relative">
        <img
          src="/brand/watch-hero.png"
          alt="ساعة فالكون صقر برو — الإصدار الأسود المطفي"
          loading="lazy"
          className="w-full object-cover aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-md"
            >
              <p className="text-xs font-bold tracking-[0.4em] text-zinc-400" dir="ltr">
                SAQR-24 · FLAGSHIP
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-6xl font-black leading-tight">
                صقر برو
                <span className="block text-zinc-500 text-2xl sm:text-3xl lg:text-4xl mt-1">
                  طليعة السرب
                </span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-sm">
                إطار فولاذي مطلي بالكربون الأسود، عقارب مضيئة بترتيب سويسري،
                ومنبه مواقيت الصلاة يعمل بصمت وكبرياء.
              </p>
              <a href="#order" className="inline-flex mt-7">
                <Button className="clip-corner bg-white text-[#0A0A0B] hover:bg-zinc-200 font-bold h-12 px-8">
                  اقتنِ طليعة السرب
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
