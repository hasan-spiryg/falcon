"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Upload, ImageIcon, Copy } from "lucide-react";

interface MediaItem {
  name: string;
  url: string;
}

export function MediaManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.ok) setItems(data.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    let okCount = 0;
    let lastError = "";
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/media", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok && data.ok) okCount++;
        else lastError = data.error ?? "خطأ غير معروف";
      }
      if (okCount > 0) {
        toast({ title: `تم رفع ${okCount} صورة` });
        load();
      } else {
        toast({ title: "تعذّر رفع الصور", description: lastError, variant: "destructive" });
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (name: string) => {
    if (!confirm("حذف هذه الصورة من المكتبة؟")) return;
    const res = await fetch(`/api/admin/media?name=${encodeURIComponent(name)}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
      setItems((prev) => prev.filter((i) => i.name !== name));
      toast({ title: "تم حذف الصورة" });
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "تم نسخ الرابط", description: url });
    } catch {
      toast({ title: "تعذّر النسخ", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">مكتبة الصور</h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          ارفع صور المنتجات والبانرات — ثم استخدمها في المنتجات ومحتوى الموقع
        </p>
      </div>

      {/* منطقة الرفع */}
      <div
        className={`border-2 border-dashed p-10 text-center transition-colors cursor-pointer ${
          dragOver ? "border-white bg-white/5" : "border-white/20 hover:border-white/40"
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
        }}
        role="button"
        aria-label="رفع صور"
      >
        {uploading ? (
          <Loader2 className="w-10 h-10 mx-auto animate-spin text-zinc-500" aria-hidden />
        ) : (
          <Upload className="w-10 h-10 mx-auto text-zinc-600" aria-hidden />
        )}
        <p className="mt-4 font-black">اسحب الصور هنا أو انقر للاختيار</p>
        <p className="mt-1.5 text-xs text-zinc-600">
          PNG · JPG · WEBP · SVG — حتى 5 ميغابايت للصورة
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) uploadFiles(e.target.files);
          }}
        />
      </div>

      {/* الشبكة */}
      {loading ? (
        <div className="py-20 text-center text-zinc-500">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" aria-hidden />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#111113] border border-white/10 py-16 text-center text-zinc-500">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-50" aria-hidden />
          المكتبة فارغة — ارفع أول صورة من الأعلى
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m) => (
            <figure key={m.name} className="bg-[#111113] border border-white/10 overflow-hidden group">
              <div className="aspect-square bg-[#0A0A0B] overflow-hidden">
                <img
                  src={m.url}
                  alt={m.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <figcaption className="p-3">
                <p className="text-[11px] text-zinc-500 truncate" dir="ltr" title={m.name}>
                  {m.name}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs border-white/15 text-zinc-300 hover:bg-white/10 hover:text-white gap-1.5"
                    onClick={() => copyUrl(m.url)}
                  >
                    <Copy className="w-3.5 h-3.5" aria-hidden />
                    نسخ الرابط
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                    onClick={() => remove(m.name)}
                    aria-label="حذف الصورة"
                    title="حذف الصورة"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </Button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
