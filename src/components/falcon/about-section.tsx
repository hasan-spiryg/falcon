"use client";

import { motion } from "framer-motion";
import { getIcon } from "@/lib/icons";
import type { AboutContent, TrustItem } from "@/lib/site-defaults";

export function AboutSection({
  content,
  trust,
}: {
  content: AboutContent;
  trust: TrustItem[];
}) {
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 space-y-4 text-zinc-400 text-base lg:text-lg leading-loose"
              >
                {content.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </motion.div>
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-8 border-r-4 border-white pr-5 py-1"
              >
                <p className="text-xl lg:text-2xl font-black leading-relaxed">{content.quote}</p>
                <footer className="mt-2 text-sm text-zinc-500">{content.quoteAuthor}</footer>
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
                  src={content.image}
                  alt={content.imageAlt}
                  loading="lazy"
                  className="w-full object-cover aspect-[4/3]"
                />
              </div>
              <div className="absolute -bottom-5 -left-3 sm:-left-5 bg-white text-[#0A0A0B] clip-corner-sm px-5 py-3.5 max-w-[240px]">
                <p className="font-black text-sm leading-snug">{content.cardTitle}</p>
                <p className="text-[11px] text-zinc-600 mt-1">{content.cardText}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* شريط الثقة */}
      <section className="bg-white text-[#0A0A0B] py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
            {trust.map((t, i) => {
              const TrustIcon = getIcon(t.icon);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex items-start gap-3.5"
                >
                  <TrustIcon className="w-7 h-7 shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <h3 className="font-black">{t.title}</h3>
                    <p className="mt-1 text-[13px] text-zinc-600 leading-relaxed">{t.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
