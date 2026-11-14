"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Send } from "lucide-react";
import type { ContactContent, FooterContent } from "@/lib/site-defaults";

const NAV = [
  { href: "#home", label: "الرئيسية" },
  { href: "#collection", label: "المجموعة" },
  { href: "#prayer", label: "مواقيت الصلاة" },
  { href: "#tech", label: "التقنية" },
  { href: "#story", label: "قصتنا" },
];

export function Footer({
  contact,
  content,
}: {
  contact: ContactContent;
  content: FooterContent;
}) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({ title: "تعذّر الاشتراك", description: data.error, variant: "destructive" });
      } else {
        toast({
          title: "أهلاً بك في عائلة فالكون",
          description: "ستصلك أخبار الإصدارات الجديدة أولاً بأول",
        });
        setEmail("");
      }
    } catch {
      toast({ title: "تعذّر الاتصال", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#060607] border-t border-white/10 mt-auto">
      {/* شريط النشرة */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="text-center lg:text-right">
              <h3 className="text-2xl lg:text-3xl font-black">{content.newsletterTitle}</h3>
              <p className="mt-2 text-zinc-500 text-sm lg:text-base">{content.newsletterText}</p>
            </div>
            <form onSubmit={subscribe} className="flex gap-3 max-w-md w-full mx-auto lg:mx-0">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
                aria-label="البريد الإلكتروني للاشتراك"
                className="h-12 flex-1 bg-[#111113] border-white/15 focus-visible:ring-white/30"
              />
              <Button
                type="submit"
                disabled={loading}
                className="clip-corner-sm bg-white text-[#0A0A0B] hover:bg-zinc-200 font-bold h-12 px-6 gap-2 shrink-0"
              >
                <Send className="w-4 h-4" aria-hidden />
                اشترك
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* الأعمدة */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* الهوية */}
          <div className="lg:col-span-2 max-w-sm">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 bg-white flex items-center justify-center clip-corner-sm">
                <img src="/brand/icon_falcon_light.png" alt="شعار فالكون" className="w-8 h-8 object-contain" />
              </span>
              <div>
                <img
                  src="/brand/wordmark_arabic_dark.png"
                  alt="فالكون"
                  className="h-6 w-auto object-contain"
                />
                <span className="block text-[10px] tracking-[0.35em] text-zinc-600 mt-1">
                  {contact.city} · {contact.since}
                </span>
              </div>
            </div>
            <p className="mt-5 text-sm text-zinc-500 leading-relaxed">{content.description}</p>
            <div className="mt-6 flex items-center gap-3" aria-label="حسابات التواصل">
              {[
                { icon: Instagram, label: "إنستغرام فالكون" },
                { icon: Facebook, label: "فيسبوك فالكون" },
                { icon: Youtube, label: "يوتيوب فالكون" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-10 h-10 border border-white/15 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors clip-corner-sm"
                >
                  <s.icon className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* روابط */}
          <nav aria-label="روابط الموقع">
            <h4 className="font-black mb-4 text-sm tracking-wide">الموقع</h4>
            <ul className="space-y-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* تواصل */}
          <div>
            <h4 className="font-black mb-4 text-sm tracking-wide">تواصل معنا</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-zinc-600" aria-hidden />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-zinc-600" aria-hidden />
                <span dir="ltr">{contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 text-zinc-600" aria-hidden />
                <span dir="ltr">{contact.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* الحقوق */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {content.rights}
          </p>
          <div className="flex items-center gap-5">
            <a
              href="/admin"
              className="text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors"
            >
              لوحة التحكم
            </a>
            <p className="text-[10px] tracking-[0.3em] text-zinc-700 font-sans" dir="ltr">
              {content.latinLine}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
