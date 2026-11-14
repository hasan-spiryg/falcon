"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ICON_OPTIONS } from "@/lib/icons";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Upload,
  ImageIcon,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";

export interface AdminProduct {
  id: string;
  name: string;
  latin: string;
  image: string;
  price: string;
  tagline: string;
  specs: { icon: string; text: string }[];
  badge?: string | null;
  active: boolean;
  sortOrder: number;
}

interface FormState {
  id?: string;
  name: string;
  latin: string;
  image: string;
  price: string;
  tagline: string;
  badge: string;
  specs: { icon: string; text: string }[];
  active: boolean;
  sortOrder: number;
}

const EMPTY_FORM: FormState = {
  name: "",
  latin: "",
  image: "",
  price: "",
  tagline: "",
  badge: "",
  specs: [{ icon: "droplets", text: "" }],
  active: true,
  sortOrder: 0,
};

export function ProductsManager() {
  const { toast } = useToast();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<{ name: string; url: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.ok) setProducts(data.products);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => setForm({ ...EMPTY_FORM });

  const openEdit = (p: AdminProduct) =>
    setForm({
      id: p.id,
      name: p.name,
      latin: p.latin,
      image: p.image,
      price: p.price,
      tagline: p.tagline,
      badge: p.badge ?? "",
      specs: p.specs.length > 0 ? [...p.specs] : [{ icon: "droplets", text: "" }],
      active: p.active,
      sortOrder: p.sortOrder,
    });

  const save = async () => {
    if (!form) return;
    if (form.name.trim().length < 2) {
      toast({ title: "أدخل اسم المنتج", variant: "destructive" });
      return;
    }
    if (!form.image.trim()) {
      toast({ title: "أضف صورة للمنتج", description: "ارفع صورة أو اختر من المكتبة", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({ title: "تعذّر الحفظ", description: data.error, variant: "destructive" });
      } else {
        toast({ title: form.id ? "تم تحديث المنتج" : "تمت إضافة المنتج" });
        setForm(null);
        load();
      }
    } catch {
      toast({ title: "تعذّر الاتصال بالخادم", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: AdminProduct) => {
    if (!confirm(`حذف «${p.name}» نهائياً؟`)) return;
    const res = await fetch(`/api/admin/products?id=${p.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
      toast({ title: "تم حذف المنتج" });
      load();
    } else {
      toast({ title: "تعذّر الحذف", description: data.error, variant: "destructive" });
    }
  };

  const toggleActive = async (p: AdminProduct) => {
    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, active: !p.active }),
    });
    const data = await res.json();
    if (data.ok) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !p.active } : x)));
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({ title: "تعذّر رفع الصورة", description: data.error, variant: "destructive" });
      } else {
        setForm((f) => (f ? { ...f, image: data.url } : f));
        toast({ title: "تم رفع الصورة" });
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const openMedia = async () => {
    setMediaOpen(true);
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    if (data.ok) setMediaItems(data.items);
  };

  const setSpec = (i: number, patch: Partial<{ icon: string; text: string }>) =>
    setForm((f) => {
      if (!f) return f;
      const specs = [...f.specs];
      specs[i] = { ...specs[i], ...patch };
      return { ...f, specs };
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">المنتجات</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            أضف الساعات وحرّر أسعارها ومواصفاتها وصورها — تظهر فوراً في الموقع
          </p>
        </div>
        <Button onClick={openNew} className="clip-corner-sm bg-white text-[#0A0A0B] hover:bg-zinc-200 font-black h-11 gap-2">
          <Plus className="w-4.5 h-4.5" aria-hidden />
          إضافة منتج
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" aria-hidden />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#111113] border border-white/10 py-16 text-center text-zinc-500">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-50" aria-hidden />
          لا توجد منتجات — ابدأ بإضافة أول ساعة
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((p) => (
            <article
              key={p.id}
              className={`bg-[#111113] border border-white/10 overflow-hidden group ${
                p.active ? "" : "opacity-50"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0B]">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700">
                    <ImageIcon className="w-10 h-10" aria-hidden />
                  </div>
                )}
                {p.badge && (
                  <span className="absolute top-3 right-3 bg-white text-[#0A0A0B] text-[10px] font-black px-2 py-1">
                    {p.badge}
                  </span>
                )}
                <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] text-zinc-500" dir="ltr">
                  {p.latin}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-black truncate">{p.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{p.tagline}</p>
                  </div>
                  <span className="font-black shrink-0" dir="ltr">{p.price}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.specs.map((s, i) => (
                    <span key={i} className="text-[10px] text-zinc-400 bg-white/5 border border-white/10 px-2 py-1">
                      {s.text}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-9 border-white/15 text-white hover:bg-white/10 hover:text-white gap-1.5"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0 border-white/15 text-zinc-400 hover:bg-white/10 hover:text-white"
                    onClick={() => toggleActive(p)}
                    aria-label={p.active ? "إخفاء من الموقع" : "إظهار في الموقع"}
                    title={p.active ? "إخفاء من الموقع" : "إظهار في الموقع"}
                  >
                    {p.active ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                    onClick={() => remove(p)}
                    aria-label="حذف المنتج"
                    title="حذف المنتج"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* نموذج الإضافة / التعديل */}
      <Dialog open={form !== null} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="bg-[#111113] border-white/15 max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{form?.id ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
          </DialogHeader>

          {form && (
            <div className="space-y-5">
              {/* الصورة */}
              <div className="space-y-2.5">
                <Label className="text-sm font-bold">صورة المنتج</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-32 h-32 shrink-0 bg-[#0A0A0B] border border-white/15 overflow-hidden flex items-center justify-center">
                    {form.image ? (
                      <img src={form.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-zinc-700" aria-hidden />
                    )}
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 border-white/15 text-white hover:bg-white/10 hover:text-white gap-2"
                        disabled={uploading}
                        onClick={() => fileRef.current?.click()}
                      >
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                        ) : (
                          <Upload className="w-4 h-4" aria-hidden />
                        )}
                        رفع صورة
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 border-white/15 text-white hover:bg-white/10 hover:text-white gap-2"
                        onClick={openMedia}
                      >
                        <ImageIcon className="w-4 h-4" aria-hidden />
                        مكتبة الصور
                      </Button>
                    </div>
                    <Input
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="أو الصق رابط صورة مثل /brand/watch-black.png"
                      dir="ltr"
                      className="h-10 bg-[#0A0A0B] border-white/15 text-left text-xs"
                    />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadFile(f);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold">اسم المنتج *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="مثال: فالكون برو"
                    className="h-11 bg-[#0A0A0B] border-white/15"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold">الاسم اللاتيني</Label>
                  <Input
                    value={form.latin}
                    onChange={(e) => setForm({ ...form, latin: e.target.value })}
                    placeholder="FALCON PRO"
                    dir="ltr"
                    className="h-11 bg-[#0A0A0B] border-white/15 text-left"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold">السعر</Label>
                  <Input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="$199"
                    dir="ltr"
                    className="h-11 bg-[#0A0A0B] border-white/15 text-left"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold">شارة (اختياري)</Label>
                  <Input
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="مثال: الأكثر طلباً"
                    className="h-11 bg-[#0A0A0B] border-white/15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold">الوصف القصير</Label>
                <Input
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="الأسود التكتيكي — رفيق المغامرات القاسية"
                  className="h-11 bg-[#0A0A0B] border-white/15"
                />
              </div>

              {/* المواصفات */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-bold">المواصفات</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 border-white/15 text-white hover:bg-white/10 hover:text-white gap-1"
                    onClick={() =>
                      setForm({ ...form, specs: [...form.specs, { icon: "star", text: "" }] })
                    }
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden />
                    إضافة مواصفة
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.specs.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-zinc-700 shrink-0" aria-hidden />
                      <Select value={s.icon} onValueChange={(v) => setSpec(i, { icon: v })}>
                        <SelectTrigger
                          className="w-36 h-10 bg-[#0A0A0B] border-white/15 text-xs shrink-0"
                          aria-label="أيقونة المواصفة"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#141416] border-white/15 max-h-64">
                          {ICON_OPTIONS.map((o) => (
                            <SelectItem key={o.key} value={o.key} className="text-xs focus:bg-white/10 focus:text-white">
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={s.text}
                        onChange={(e) => setSpec(i, { text: e.target.value })}
                        placeholder="مثال: 20 ATM"
                        className="h-10 bg-[#0A0A0B] border-white/15 flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 shrink-0 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                        onClick={() =>
                          setForm({ ...form, specs: form.specs.filter((_, j) => j !== i) })
                        }
                        aria-label="حذف المواصفة"
                      >
                        <X className="w-4 h-4" aria-hidden />
                      </Button>
                    </div>
                  ))}
                  {form.specs.length === 0 && (
                    <p className="text-xs text-zinc-600">لا توجد مواصفات — أضف واحدة أو أكثر</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#0A0A0B] border border-white/10 px-4 py-3.5">
                <div>
                  <p className="text-sm font-bold">ظاهر في الموقع</p>
                  <p className="text-xs text-zinc-500 mt-0.5">عند الإيقاف يُخفى المنتج دون حذفه</p>
                </div>
                <Switch
                  checked={form.active}
                  onCheckedChange={(v) => setForm({ ...form, active: v })}
                  aria-label="ظاهر في الموقع"
                  className="data-[state=checked]:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  className="border-white/15 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setForm(null)}
                  disabled={saving}
                >
                  إلغاء
                </Button>
                <Button
                  className="bg-white text-[#0A0A0B] hover:bg-zinc-200 font-bold gap-2"
                  onClick={save}
                  disabled={saving}
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                  {form.id ? "حفظ التعديلات" : "إضافة المنتج"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* اختيار من مكتبة الصور */}
      <Dialog open={mediaOpen} onOpenChange={setMediaOpen}>
        <DialogContent className="bg-[#111113] border-white/15 max-w-xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>اختيار من مكتبة الصور</DialogTitle>
          </DialogHeader>
          {mediaItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              المكتبة فارغة — ارفع صوراً من صفحة «مكتبة الصور» أو من نموذج المنتج
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {mediaItems.map((m) => (
                <button
                  key={m.name}
                  className="aspect-square bg-[#0A0A0B] border border-white/15 overflow-hidden hover:border-white transition-colors"
                  onClick={() => {
                    setForm((f) => (f ? { ...f, image: m.url } : f));
                    setMediaOpen(false);
                  }}
                >
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
