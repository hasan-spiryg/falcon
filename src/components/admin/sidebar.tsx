"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Watch,
  FileText,
  ShoppingCart,
  Mail,
  Image,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "المنتجات", icon: Watch },
  { href: "/admin/content", label: "محتوى الموقع", icon: FileText },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/subscribers", label: "المشتركون", icon: Mail },
  { href: "/admin/media", label: "مكتبة الصور", icon: Image },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const nav = (
    <>
      {/* الهوية */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <span className="w-10 h-10 bg-white flex items-center justify-center clip-corner-sm shrink-0">
          <img src="/brand/icon_falcon_light.png" alt="" className="w-8 h-8 object-contain" />
        </span>
        <div className="leading-tight">
          <p className="font-black">لوحة تحكم فالكون</p>
          <p className="text-[10px] tracking-[0.25em] text-zinc-500 mt-1">ADMIN PANEL</p>
        </div>
      </div>

      {/* الروابط */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold rounded-none transition-colors ${
              isActive(l.href, l.exact)
                ? "bg-white text-[#0A0A0B]"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <l.icon className="w-4.5 h-4.5 shrink-0" aria-hidden />
            {l.label}
          </Link>
        ))}
      </nav>

      {/* أسفل */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-zinc-500 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4.5 h-4.5 shrink-0" aria-hidden />
          عرض الموقع
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" aria-hidden />
          تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* شريط الجوال */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-16 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 bg-white flex items-center justify-center clip-corner-sm">
            <img src="/brand/icon_falcon_light.png" alt="" className="w-6 h-6 object-contain" />
          </span>
          <span className="font-black text-sm">لوحة تحكم فالكون</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2" aria-label="فتح القائمة">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-30 pt-16 bg-[#0A0A0B]" onClick={() => setOpen(false)}>
          <div className="h-full flex flex-col" onClick={(e) => e.stopPropagation()}>{nav}</div>
        </div>
      )}

      {/* الشريط الجانبي — سطح المكتب */}
      <aside className="hidden lg:flex fixed inset-y-0 right-0 w-64 bg-[#0E0E10] border-l border-white/10 flex-col z-40">
        {nav}
      </aside>
    </>
  );
}
