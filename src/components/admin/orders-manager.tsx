"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { STATUS_OPTIONS } from "./status";
import { StatusBadge } from "./status";
import {
  Loader2,
  Trash2,
  ShoppingCart,
  Phone,
  MapPin,
  Watch,
  Search,
} from "lucide-react";

interface OrderRow {
  id: string;
  name: string;
  phone: string;
  city: string;
  model: string;
  status: string;
  createdAt: string;
}

export function OrdersManager() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/products"),
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      if (ordersData.ok) setOrders(ordersData.orders);
      if (productsData.ok)
        setProducts(productsData.products.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const productNames = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p.name])),
    [products]
  );

  const setStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } else {
      toast({ title: "تعذّر تحديث الحالة", description: data.error, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذا الطلب نهائياً؟")) return;
    const res = await fetch(`/api/admin/orders?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast({ title: "تم حذف الطلب" });
    }
  };

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (query.trim()) {
      const q = query.trim();
      return (
        o.name.includes(q) ||
        o.phone.includes(q) ||
        o.city.includes(q) ||
        (productNames[o.model] ?? o.model).includes(q)
      );
    }
    return true;
  });

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ar-SY", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">الطلبات</h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          طلبات الشراء الواردة من الموقع — حدّث حالتها أثناء المعالجة والتوصيل
        </p>
      </div>

      {/* الفلاتر */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو المدينة..."
            className="w-full h-10 bg-[#111113] border border-white/15 rounded-md pr-10 pl-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`h-10 px-4 text-sm font-bold transition-colors ${
              filter === "all" ? "bg-white text-[#0A0A0B]" : "bg-[#111113] border border-white/15 text-zinc-400 hover:text-white"
            }`}
          >
            الكل ({counts.all ?? 0})
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`h-10 px-4 text-sm font-bold transition-colors ${
                filter === s.value ? "bg-white text-[#0A0A0B]" : "bg-[#111113] border border-white/15 text-zinc-400 hover:text-white"
              }`}
            >
              {s.label} ({counts[s.value] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" aria-hidden />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111113] border border-white/10 py-16 text-center text-zinc-500">
          <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-50" aria-hidden />
          {orders.length === 0 ? "لا توجد طلبات بعد" : "لا توجد طلبات مطابقة للفلتر"}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <article key={o.id} className="bg-[#111113] border border-white/10 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-black">{o.name}</h3>
                    <StatusBadge status={o.status} />
                    <span className="text-[10px] text-zinc-600 font-mono" dir="ltr">
                      FL-{o.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" aria-hidden />
                      <span dir="ltr">{o.phone}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" aria-hidden />
                      {o.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Watch className="w-3 h-3" aria-hidden />
                      {productNames[o.model] ?? o.model}
                    </span>
                    <span>{fmtDate(o.createdAt)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                      className="h-9 appearance-none bg-[#0A0A0B] border border-white/15 rounded-md pl-3 pr-8 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                      aria-label="تغيير حالة الطلب"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value} className="bg-[#141416]">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-white/15 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                    onClick={() => remove(o.id)}
                    aria-label="حذف الطلب"
                    title="حذف الطلب"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
