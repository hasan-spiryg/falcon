"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ICON_OPTIONS } from "@/lib/icons";
import type { SiteContent } from "@/lib/site-defaults";
import {
  Loader2,
  Save,
  RotateCcw,
  Plus,
  X,
  Upload,
  ImageIcon,
  ChevronDown,
} from "lucide-react";

/** الحقول الصغيرة المشتركة */
function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-bold">{label}</Label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          rows={3}
          className="w-full bg-[#0A0A0B] border border-white/15 rounded-md px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          className={`h-11 bg-[#0A0A0B] border-white/15 ${dir === "ltr" ? "text-left" : ""}`}
        />
      )}
    </div>
  );
}

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 appearance-none bg-[#0A0A0B] border border-white/15 rounded-md px-3 pr-8 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="اختيار الأيقونة"
      >
        {ICON_OPTIONS.map((o) => (
          <option key={o.key} value={o.key} className="bg-[#141416]">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" aria-hidden />
    </div>
  );
}

/** حقل صورة: رفع + معاينة + رابط */
function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({ title: "تعذّر رفع الصورة", description: data.error, variant: "destructive" });
      } else {
        onChange(data.url);
        toast({ title: "تم رفع الصورة" });
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-bold">{label}</Label>
      <div className="flex items-center gap-3">
        <div className="w-20 h-16 shrink-0 bg-[#0A0A0B] border border-white/15 overflow-hidden flex items-center justify-center">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-zinc-700" aria-hidden />
          )}
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="ltr"
          className="h-10 bg-[#0A0A0B] border-white/15 text-left text-xs flex-1"
        />
        <Button
          type="button"
          variant="outline"
          className="h-10 w-10 p-0 shrink-0 border-white/15 text-zinc-300 hover:bg-white/10 hover:text-white"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          aria-label="رفع صورة"
          title="رفع صورة"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="w-4 h-4" aria-hidden />
          )}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
      </div>
    </div>
  );
}

/** رأس قسم قابل للفتح والإغلاق */
function Section({
  title,
  desc,
  children,
  onSave,
  onReset,
  saving,
  defaultOpen,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <section className="bg-[#111113] border border-white/10">
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div>
          <h2 className="font-black">{title}</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-white/10 space-y-4">
          {children}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 text-zinc-400 hover:bg-white/10 hover:text-white gap-1.5"
              onClick={onReset}
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden />
              إرجاع الافتراضي
            </Button>
            <Button
              size="sm"
              className="bg-white text-[#0A0A0B] hover:bg-zinc-200 font-bold gap-1.5"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              ) : (
                <Save className="w-4 h-4" aria-hidden />
              )}
              حفظ القسم
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

export function ContentManager() {
  const { toast } = useToast();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.ok) setContent(data.content as SiteContent);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /** تحديث قسم كامل */
  const patch = (key: keyof SiteContent, value: unknown) =>
    setContent((c) => (c ? ({ ...c, [key]: value } as SiteContent) : c));

  const saveKey = async (key: keyof SiteContent) => {
    if (!content) return;
    setSavingKey(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: { [key]: content[key] } }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({ title: "تعذّر الحفظ", description: data.error, variant: "destructive" });
      } else {
        toast({ title: "تم الحفظ", description: "التعديلات ظاهرة الآن في الموقع" });
      }
    } catch {
      toast({ title: "تعذّر الاتصال بالخادم", variant: "destructive" });
    } finally {
      setSavingKey(null);
    }
  };

  const resetKey = async (key: keyof SiteContent) => {
    if (!confirm("إرجاع هذا القسم إلى النص الافتراضي؟ سيُفقد أي تعديل محفوظ عليه.")) return;
    const res = await fetch(`/api/admin/settings?key=${key}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
      toast({ title: "أُرجع القسم إلى الافتراضي" });
      load();
    }
  };

  if (loading || !content) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <Loader2 className="w-8 h-8 mx-auto animate-spin" aria-hidden />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">محتوى الموقع</h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          حرّر نصوص وصور كل أقسام الموقع — كل قسم يُحفظ ويُعاين بشكل مستقل
        </p>
      </div>

      {/* القسم الرئيسي */}
      <Section
        title="الواجهة الرئيسية (Hero)"
        desc="الشارة والعنوان والنص التعريفي والإحصاءات"
        saving={savingKey === "hero"}
        onSave={() => saveKey("hero")}
        onReset={() => resetKey("hero")}
        defaultOpen
      >
        <Field label="الشارة العلوية" value={content.hero.badge} onChange={(v) => patch("hero", { ...content.hero, badge: v })} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="العنوان — السطر الأول" value={content.hero.title1} onChange={(v) => patch("hero", { ...content.hero, title1: v })} />
          <Field label="العنوان — السطر الثاني (المميز)" value={content.hero.title2} onChange={(v) => patch("hero", { ...content.hero, title2: v })} />
        </div>
        <Field label="النص التعريفي" value={content.hero.subtitle} onChange={(v) => patch("hero", { ...content.hero, subtitle: v })} textarea />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="زر رئيسي" value={content.hero.ctaPrimary} onChange={(v) => patch("hero", { ...content.hero, ctaPrimary: v })} />
          <Field label="زر ثانوي" value={content.hero.ctaSecondary} onChange={(v) => patch("hero", { ...content.hero, ctaSecondary: v })} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">الإحصاءات الثلاث</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-white/15 text-white hover:bg-white/10 hover:text-white gap-1"
              onClick={() => patch("hero", { ...content.hero, stats: [...content.hero.stats, { icon: "star", value: "", label: "" }] })}
            >
              <Plus className="w-3.5 h-3.5" aria-hidden />
              إضافة
            </Button>
          </div>
          {content.hero.stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                onClick={() => patch("hero", { ...content.hero, stats: content.hero.stats.filter((_, j) => j !== i) })}
                aria-label="حذف"
              >
                <X className="w-4 h-4" aria-hidden />
              </Button>
              <div className="w-40 shrink-0">
                <IconSelect value={s.icon} onChange={(v) => {
                  const stats = [...content.hero.stats];
                  stats[i] = { ...s, icon: v };
                  patch("hero", { ...content.hero, stats });
                }} />
              </div>
              <Input
                value={s.value}
                onChange={(e) => {
                  const stats = [...content.hero.stats];
                  stats[i] = { ...s, value: e.target.value };
                  patch("hero", { ...content.hero, stats });
                }}
                placeholder="القيمة مثل 20 ATM"
                className="h-10 bg-[#0A0A0B] border-white/15 flex-1"
              />
              <Input
                value={s.label}
                onChange={(e) => {
                  const stats = [...content.hero.stats];
                  stats[i] = { ...s, label: e.target.value };
                  patch("hero", { ...content.hero, stats });
                }}
                placeholder="التسمية مثل مقاومة الماء"
                className="h-10 bg-[#0A0A0B] border-white/15 flex-1"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* الشريط المتحرك */}
      <Section
        title="الشريط المتحرك"
        desc="الكلمات المتحركة أسفل الواجهة الرئيسية"
        saving={savingKey === "marquee"}
        onSave={() => saveKey("marquee")}
        onReset={() => resetKey("marquee")}
      >
        <div className="space-y-2">
          {content.marquee.items.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                onClick={() => patch("marquee", { items: content.marquee.items.filter((_, j) => j !== i) })}
                aria-label="حذف"
              >
                <X className="w-4 h-4" aria-hidden />
              </Button>
              <Input
                value={t}
                onChange={(e) => {
                  const items = [...content.marquee.items];
                  items[i] = e.target.value;
                  patch("marquee", { items });
                }}
                className="h-10 bg-[#0A0A0B] border-white/15 flex-1"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/15 text-white hover:bg-white/10 hover:text-white gap-1"
            onClick={() => patch("marquee", { items: [...content.marquee.items, ""] })}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden />
            إضافة كلمة
          </Button>
        </div>
      </Section>

      {/* قسم المنتجات */}
      <Section
        title="عنوان قسم المنتجات"
        desc="نصوص عنوان «مجموعة الساعات»"
        saving={savingKey === "products"}
        onSave={() => saveKey("products")}
        onReset={() => resetKey("products")}
      >
        <Field label="السطر اللاتيني العلوي" value={content.products.kicker} onChange={(v) => patch("products", { ...content.products, kicker: v })} dir="ltr" />
        <Field label="العنوان" value={content.products.title} onChange={(v) => patch("products", { ...content.products, title: v })} />
        <Field label="الوصف" value={content.products.subtitle} onChange={(v) => patch("products", { ...content.products, subtitle: v })} textarea />
        <Field label="ملاحظة أسفل القسم" value={content.products.note} onChange={(v) => patch("products", { ...content.products, note: v })} textarea />
      </Section>

      {/* البانر */}
      <Section
        title="بانر فالكون برو (Showcase)"
        desc="صورة البانر الكبيرة ونصوصها وزر الاقتناء"
        saving={savingKey === "showcase"}
        onSave={() => saveKey("showcase")}
        onReset={() => resetKey("showcase")}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="السطر اللاتيني" value={content.showcase.latin} onChange={(v) => patch("showcase", { ...content.showcase, latin: v })} dir="ltr" />
          <Field label="العنوان" value={content.showcase.title} onChange={(v) => patch("showcase", { ...content.showcase, title: v })} />
          <Field label="العنوان الفرعي" value={content.showcase.subtitle} onChange={(v) => patch("showcase", { ...content.showcase, subtitle: v })} />
          <Field label="نص الزر" value={content.showcase.cta} onChange={(v) => patch("showcase", { ...content.showcase, cta: v })} />
        </div>
        <Field label="النص الوصفي" value={content.showcase.text} onChange={(v) => patch("showcase", { ...content.showcase, text: v })} textarea />
        <ImageField label="صورة البانر" value={content.showcase.image} onChange={(v) => patch("showcase", { ...content.showcase, image: v })} />
        <Field label="النص البديل للصورة (SEO)" value={content.showcase.imageAlt} onChange={(v) => patch("showcase", { ...content.showcase, imageAlt: v })} />
      </Section>

      {/* قسم مواقيت الصلاة */}
      <Section
        title="قسم مواقيت الصلاة"
        desc="نصوص الميزة الرئيسية ومزاياها"
        saving={savingKey === "prayer"}
        onSave={() => saveKey("prayer")}
        onReset={() => resetKey("prayer")}
      >
        <Field label="الشارة" value={content.prayer.badge} onChange={(v) => patch("prayer", { ...content.prayer, badge: v })} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="العنوان — السطر الأول" value={content.prayer.title1} onChange={(v) => patch("prayer", { ...content.prayer, title1: v })} />
          <Field label="العنوان — السطر الثاني" value={content.prayer.title2} onChange={(v) => patch("prayer", { ...content.prayer, title2: v })} />
        </div>
        <Field label="النص التعريفي" value={content.prayer.text} onChange={(v) => patch("prayer", { ...content.prayer, text: v })} textarea />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">المزايا</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-white/15 text-white hover:bg-white/10 hover:text-white gap-1"
              onClick={() => patch("prayer", { ...content.prayer, features: [...content.prayer.features, { icon: "star", title: "", text: "" }] })}
            >
              <Plus className="w-3.5 h-3.5" aria-hidden />
              إضافة ميزة
            </Button>
          </div>
          {content.prayer.features.map((f, i) => (
            <div key={i} className="bg-[#0A0A0B] border border-white/10 p-3.5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                  onClick={() => patch("prayer", { ...content.prayer, features: content.prayer.features.filter((_, j) => j !== i) })}
                  aria-label="حذف"
                >
                  <X className="w-4 h-4" aria-hidden />
                </Button>
                <div className="w-44 shrink-0">
                  <IconSelect
                    value={f.icon}
                    onChange={(v) => {
                      const features = [...content.prayer.features];
                      features[i] = { ...f, icon: v };
                      patch("prayer", { ...content.prayer, features });
                    }}
                  />
                </div>
                <Input
                  value={f.title}
                  onChange={(e) => {
                    const features = [...content.prayer.features];
                    features[i] = { ...f, title: e.target.value };
                    patch("prayer", { ...content.prayer, features });
                  }}
                  placeholder="عنوان الميزة"
                  className="h-10 bg-[#0A0A0B] border-white/15 flex-1"
                />
              </div>
              <Input
                value={f.text}
                onChange={(e) => {
                  const features = [...content.prayer.features];
                  features[i] = { ...f, text: e.target.value };
                  patch("prayer", { ...content.prayer, features });
                }}
                placeholder="وصف الميزة"
                className="h-10 bg-[#0A0A0B] border-white/15"
              />
            </div>
          ))}
        </div>
        <Field label="ملاحظة أسفل الويدجت" value={content.prayer.note} onChange={(v) => patch("prayer", { ...content.prayer, note: v })} textarea />
      </Section>

      {/* قسم التقنية */}
      <Section
        title="قسم التقنية"
        desc="المزايا التقنية للساعة وصورة التفاصيل"
        saving={savingKey === "tech"}
        onSave={() => saveKey("tech")}
        onReset={() => resetKey("tech")}
      >
        <Field label="السطر العلوي" value={content.tech.kicker} onChange={(v) => patch("tech", { ...content.tech, kicker: v })} dir="ltr" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="العنوان — السطر الأول" value={content.tech.title1} onChange={(v) => patch("tech", { ...content.tech, title1: v })} />
          <Field label="العنوان — السطر الثاني" value={content.tech.title2} onChange={(v) => patch("tech", { ...content.tech, title2: v })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="قيمة البطاقة (مثل 316L)" value={content.tech.badgeValue} onChange={(v) => patch("tech", { ...content.tech, badgeValue: v })} dir="ltr" />
          <Field label="تسمية البطاقة" value={content.tech.badgeLabel} onChange={(v) => patch("tech", { ...content.tech, badgeLabel: v })} />
        </div>
        <ImageField label="صورة التفاصيل" value={content.tech.image} onChange={(v) => patch("tech", { ...content.tech, image: v })} />
        <Field label="النص البديل للصورة" value={content.tech.imageAlt} onChange={(v) => patch("tech", { ...content.tech, imageAlt: v })} />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">المزايا التقنية</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-white/15 text-white hover:bg-white/10 hover:text-white gap-1"
              onClick={() => patch("tech", { ...content.tech, items: [...content.tech.items, { icon: "star", title: "", text: "" }] })}
            >
              <Plus className="w-3.5 h-3.5" aria-hidden />
              إضافة ميزة
            </Button>
          </div>
          {content.tech.items.map((t, i) => (
            <div key={i} className="bg-[#0A0A0B] border border-white/10 p-3.5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                  onClick={() => patch("tech", { ...content.tech, items: content.tech.items.filter((_, j) => j !== i) })}
                  aria-label="حذف"
                >
                  <X className="w-4 h-4" aria-hidden />
                </Button>
                <div className="w-44 shrink-0">
                  <IconSelect
                    value={t.icon}
                    onChange={(v) => {
                      const items = [...content.tech.items];
                      items[i] = { ...t, icon: v };
                      patch("tech", { ...content.tech, items });
                    }}
                  />
                </div>
                <Input
                  value={t.title}
                  onChange={(e) => {
                    const items = [...content.tech.items];
                    items[i] = { ...t, title: e.target.value };
                    patch("tech", { ...content.tech, items });
                  }}
                  placeholder="عنوان الميزة"
                  className="h-10 bg-[#0A0A0B] border-white/15 flex-1"
                />
              </div>
              <Input
                value={t.text}
                onChange={(e) => {
                  const items = [...content.tech.items];
                  items[i] = { ...t, text: e.target.value };
                  patch("tech", { ...content.tech, items });
                }}
                placeholder="وصف الميزة"
                className="h-10 bg-[#0A0A0B] border-white/15"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* قصتنا */}
      <Section
        title="قصتنا"
        desc="قصة البراند والاقتباس وصورة نمط الحياة"
        saving={savingKey === "about"}
        onSave={() => saveKey("about")}
        onReset={() => resetKey("about")}
      >
        <Field label="السطر العلوي" value={content.about.kicker} onChange={(v) => patch("about", { ...content.about, kicker: v })} dir="ltr" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="العنوان — السطر الأول" value={content.about.title1} onChange={(v) => patch("about", { ...content.about, title1: v })} />
          <Field label="العنوان — السطر الثاني" value={content.about.title2} onChange={(v) => patch("about", { ...content.about, title2: v })} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">الفقرات</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-white/15 text-white hover:bg-white/10 hover:text-white gap-1"
              onClick={() => patch("about", { ...content.about, paragraphs: [...content.about.paragraphs, ""] })}
            >
              <Plus className="w-3.5 h-3.5" aria-hidden />
              إضافة فقرة
            </Button>
          </div>
          {content.about.paragraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                onClick={() => patch("about", { ...content.about, paragraphs: content.about.paragraphs.filter((_, j) => j !== i) })}
                aria-label="حذف"
              >
                <X className="w-4 h-4" aria-hidden />
              </Button>
              <textarea
                value={p}
                onChange={(e) => {
                  const paragraphs = [...content.about.paragraphs];
                  paragraphs[i] = e.target.value;
                  patch("about", { ...content.about, paragraphs });
                }}
                rows={3}
                className="flex-1 bg-[#0A0A0B] border border-white/15 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          ))}
        </div>
        <Field label="الاقتباس" value={content.about.quote} onChange={(v) => patch("about", { ...content.about, quote: v })} />
        <Field label="صاحب الاقتباس" value={content.about.quoteAuthor} onChange={(v) => patch("about", { ...content.about, quoteAuthor: v })} />
        <ImageField label="صورة نمط الحياة" value={content.about.image} onChange={(v) => patch("about", { ...content.about, image: v })} />
        <Field label="النص البديل للصورة" value={content.about.imageAlt} onChange={(v) => patch("about", { ...content.about, imageAlt: v })} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="عنوان البطاقة البيضاء" value={content.about.cardTitle} onChange={(v) => patch("about", { ...content.about, cardTitle: v })} />
          <Field label="نص البطاقة البيضاء" value={content.about.cardText} onChange={(v) => patch("about", { ...content.about, cardText: v })} />
        </div>
      </Section>

      {/* شريط الثقة */}
      <Section
        title="شريط الثقة"
        desc="الضمان والتوصيل والاستبدال والصيانة"
        saving={savingKey === "trust"}
        onSave={() => saveKey("trust")}
        onReset={() => resetKey("trust")}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">العناصر</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-white/15 text-white hover:bg-white/10 hover:text-white gap-1"
              onClick={() => patch("trust", [...content.trust, { icon: "star", title: "", text: "" }])}
            >
              <Plus className="w-3.5 h-3.5" aria-hidden />
              إضافة عنصر
            </Button>
          </div>
          {content.trust.map((t, i) => (
            <div key={i} className="bg-[#0A0A0B] border border-white/10 p-3.5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                  onClick={() => patch("trust", content.trust.filter((_, j) => j !== i))}
                  aria-label="حذف"
                >
                  <X className="w-4 h-4" aria-hidden />
                </Button>
                <div className="w-44 shrink-0">
                  <IconSelect
                    value={t.icon}
                    onChange={(v) => {
                      const items = [...content.trust];
                      items[i] = { ...t, icon: v };
                      patch("trust", items);
                    }}
                  />
                </div>
                <Input
                  value={t.title}
                  onChange={(e) => {
                    const items = [...content.trust];
                    items[i] = { ...t, title: e.target.value };
                    patch("trust", items);
                  }}
                  placeholder="العنوان"
                  className="h-10 bg-[#0A0A0B] border-white/15 flex-1"
                />
              </div>
              <Input
                value={t.text}
                onChange={(e) => {
                  const items = [...content.trust];
                  items[i] = { ...t, text: e.target.value };
                  patch("trust", items);
                }}
                placeholder="الوصف"
                className="h-10 bg-[#0A0A0B] border-white/15"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* التواصل */}
      <Section
        title="معلومات التواصل والموقع"
        desc="العنوان والهاتف والبريد والمدينة"
        saving={savingKey === "contact"}
        onSave={() => saveKey("contact")}
        onReset={() => resetKey("contact")}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="المدينة (لاتيني — تظهر بجانب الشعار)" value={content.contact.city} onChange={(v) => patch("contact", { ...content.contact, city: v })} dir="ltr" />
          <Field label="سنة التأسيس" value={content.contact.since} onChange={(v) => patch("contact", { ...content.contact, since: v })} dir="ltr" />
        </div>
        <Field label="العنوان" value={content.contact.address} onChange={(v) => patch("contact", { ...content.contact, address: v })} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="رقم الهاتف" value={content.contact.phone} onChange={(v) => patch("contact", { ...content.contact, phone: v })} dir="ltr" />
          <Field label="البريد الإلكتروني" value={content.contact.email} onChange={(v) => patch("contact", { ...content.contact, email: v })} dir="ltr" />
        </div>
      </Section>

      {/* التذييل */}
      <Section
        title="التذييل (Footer)"
        desc="النشرة البريدية ووصف البراند وحقوق النشر"
        saving={savingKey === "footer"}
        onSave={() => saveKey("footer")}
        onReset={() => resetKey("footer")}
      >
        <Field label="عنوان النشرة" value={content.footer.newsletterTitle} onChange={(v) => patch("footer", { ...content.footer, newsletterTitle: v })} />
        <Field label="نص النشرة" value={content.footer.newsletterText} onChange={(v) => patch("footer", { ...content.footer, newsletterText: v })} />
        <Field label="وصف البراند" value={content.footer.description} onChange={(v) => patch("footer", { ...content.footer, description: v })} textarea />
        <Field label="نص الحقوق" value={content.footer.rights} onChange={(v) => patch("footer", { ...content.footer, rights: v })} />
        <Field label="السطر اللاتيني السفلي" value={content.footer.latinLine} onChange={(v) => patch("footer", { ...content.footer, latinLine: v })} dir="ltr" />
      </Section>
    </div>
  );
}
