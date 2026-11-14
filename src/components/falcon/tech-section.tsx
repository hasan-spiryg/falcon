"use client";

import { motion } from "framer-motion";
import { getIcon } from "@/lib/icons";
import type { TechContent } from "@/lib/site-defaults";
import { Timer } from "lucide-react";

export function TechSection({ content }: { content: TechContent }) {
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
                src={content.image}
                alt={content.imageAlt}
                loading="lazy"
                className="w-full object-cover aspect-[4/3]"
              />
            </div>
            <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-white text-[#0A0A0B] clip-corner-sm px-5 py-3.5">
              <p className="text-2xl font-black tabular-nums" dir="ltr">
                {content.badgeValue}
              </p>
              <p className="text-[11px] text-zinc-600 font-medium">{content.badgeLabel}</p>
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
              {content.kicker}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
            >
              {content.title1}
              <br />
              <span className="text-zinc-500">{content.title2}</span>
            </motion.h2>

            <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-7">
              {content.items.map((t, i) => {
                const TechIcon = getIcon(t.icon);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="border-r-2 border-white/10 pr-4"
                  >
                    <TechIcon className="w-6 h-6 text-white mb-2.5" aria-hidden />
                    <h3 className="font-bold">{t.title}</h3>
                    <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">{t.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
