"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Watch,
  Mail,
  BellRing,
  ArrowLeft,
  PackageOpen,
} from "lucide-react";
import { STATUS_BADGE } from "./status";

interface OrderRow {
  id: string;
  name: string;
  phone: string;
  city: string;
  model: string;
  status: string;
  createdAt: string;
}

interface SubRow {
  id: string;
  email: string;
  createdAt: string;
}

export function AdminDashboard({
  stats,
  recentOrders,
  recentSubs,
}: {
  stats: { orders: number; newOrders: number; products: number; subscribers: number };
  recentOrders: OrderRow[];
  recentSubs: SubRow[];
}) {
  const cards = [
    {
      icon: ShoppingCart,
      value: stats.orders,
      label: "إجمالي الطلبات",
      href: "/admin/orders",
    },
    {
      icon: BellRing,
      value: stats.newOrders,
      label: "طلبات جديدة",
      href: "/admin/orders",
    },
    {
      icon: Watch,
      value: stats.products,
      label: "المنتجات",
      href: "/admin/products",
    },
    {
      icon: Mail,
      value: stats.subscribers,
      label: "مشتركو النشرة",
      href: "/admin/subscribers",
    },
  ];

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ar-SY", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">نظرة عامة</h1>
        <p className="mt-1.5 text-sm text-zinc-500">ملخص نشاط متجر فالكون</p>
      </div>

      {/* بطاقات الإحصاء */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-[#111113] border border-white/10 p-5 hover:border-white/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <c.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" aria-hidden />
              <ArrowLeft className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" aria-hidden />
            </div>
            <p className="mt-4 text-3xl font-black tabular-nums">{c.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* أحدث الطلبات */}
      <section className="bg-[#111113] border border-white/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-black">أحدث الطلبات</h2>
          <Link href="/admin/orders" className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
            كل الطلبات
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-5 py-12 text-center text-zinc-600 text-sm">
            <PackageOpen className="w-10 h-10 mx-auto mb-3 opacity-50" aria-hidden />
            لا توجد طلبات بعد — ستظهر هنا فور وصول أول طلب
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-xs border-b border-white/10">
                  <th className="text-right font-medium px-5 py-3">الاسم</th>
                  <th className="text-right font-medium px-5 py-3">المدينة</th>
                  <th className="text-right font-medium px-5 py-3">الموديل</th>
                  <th className="text-right font-medium px-5 py-3">الحالة</th>
                  <th className="text-right font-medium px-5 py-3 hidden sm:table-cell">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3.5">
                      <p className="font-bold">{o.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5" dir="ltr">{o.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400">{o.city}</td>
                    <td className="px-5 py-3.5 text-zinc-400">{o.model}</td>
                    <td className="px-5 py-3.5">{STATUS_BADGE[o.status] ?? o.status}</td>
                    <td className="px-5 py-3.5 text-zinc-500 text-xs hidden sm:table-cell">{fmtDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* أحدث المشتركين */}
      <section className="bg-[#111113] border border-white/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-black">آخر المشتركين بالنشرة</h2>
          <Link href="/admin/subscribers" className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
            كل المشتركين
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </div>
        {recentSubs.length === 0 ? (
          <div className="px-5 py-10 text-center text-zinc-600 text-sm">لا يوجد مشتركون بعد</div>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {recentSubs.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm" dir="ltr">{s.email}</span>
                <span className="text-xs text-zinc-600">{fmtDate(s.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
