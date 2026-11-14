"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Mail, Copy } from "lucide-react";

interface SubRow {
  id: string;
  email: string;
  createdAt: string;
}

export function SubscribersManager() {
  const { toast } = useToast();
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers");
      const data = await res.json();
      if (data.ok) setSubs(data.subs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("حذف هذا المشترك؟")) return;
    const res = await fetch(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
      setSubs((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "تم حذف المشترك" });
    }
  };

  const copyAll = async () => {
    if (subs.length === 0) return;
    const text = subs.map((s) => s.email).join(", ");
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "تم نسخ البريد", description: `${subs.length} بريداً في الحافظة` });
    } catch {
      toast({ title: "تعذّر النسخ", variant: "destructive" });
    }
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ar-SY", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">المشتركون بالنشرة</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            {subs.length > 0 ? `${subs.length} مشتركاً` : "لا يوجد مشتركون بعد"}
          </p>
        </div>
        {subs.length > 0 && (
          <Button
            variant="outline"
            className="border-white/15 text-white hover:bg-white/10 hover:text-white gap-2"
            onClick={copyAll}
          >
            <Copy className="w-4 h-4" aria-hidden />
            نسخ كل البريد
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" aria-hidden />
        </div>
      ) : subs.length === 0 ? (
        <div className="bg-[#111113] border border-white/10 py-16 text-center text-zinc-500">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-50" aria-hidden />
          ستظهر عناوين البريد هنا فور اشتراك أول زائر
        </div>
      ) : (
        <div className="bg-[#111113] border border-white/10 divide-y divide-white/[0.06]">
          {subs.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <span className="text-sm font-medium" dir="ltr">{s.email}</span>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-zinc-600">{fmtDate(s.createdAt)}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                  onClick={() => remove(s.id)}
                  aria-label="حذف المشترك"
                  title="حذف المشترك"
                >
                  <Trash2 className="w-4 h-4" aria-hidden />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
