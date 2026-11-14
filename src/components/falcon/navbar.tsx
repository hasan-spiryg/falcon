"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#home", label: "الرئيسية" },
  { href: "#collection", label: "المجموعة" },
  { href: "#prayer", label: "مواقيت الصلاة" },
  { href: "#tech", label: "التقنية" },
  { href: "#story", label: "قصتنا" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A0B]/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="التنقل الرئيسي">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* الشعار */}
          <a href="#home" className="flex items-center gap-3 group" aria-label="فالكون — الرئيسية">
            <span className="relative w-9 h-9 lg:w-10 lg:h-10 bg-white flex items-center justify-center clip-corner-sm">
              <img
                src="/brand/icon_falcon_light.png"
                alt="شعار الصقر — فالكون"
                className="w-7 h-7 lg:w-8 lg:h-8 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </span>
            <span className="leading-none">
              <img
                src="/brand/wordmark_arabic_dark.png"
                alt="فالكون"
                className="h-5 lg:h-6 w-auto object-contain"
              />
              <span className="block text-[9px] lg:text-[10px] tracking-[0.35em] text-zinc-500 mt-1 font-sans">
                DAMASCUS
              </span>
            </span>
          </a>

          {/* روابط سطح المكتب */}
          <ul className="hidden lg:flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors relative after:absolute after:-bottom-1.5 after:right-0 after:h-px after:w-0 after:bg-white after:transition-all hover:after:w-full"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href="#order" className="hidden sm:inline-flex">
              <Button
                variant="secondary"
                className="clip-corner-sm bg-white text-[#0A0A0B] hover:bg-zinc-200 font-bold h-10 px-6"
              >
                اطلب ساعتك
              </Button>
            </a>
            {/* زر القائمة للجوال */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setOpen(!open)}
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* قائمة الجوال */}
        {open && (
          <div className="lg:hidden border-t border-white/10 bg-[#0A0A0B]/95 backdrop-blur-md">
            <ul className="py-4 space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-zinc-200 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="px-4 pt-3">
                <a href="#order" onClick={() => setOpen(false)} className="block">
                  <Button className="w-full clip-corner-sm bg-white text-[#0A0A0B] hover:bg-zinc-200 font-bold h-11">
                    اطلب ساعتك
                  </Button>
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
