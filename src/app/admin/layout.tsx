import type { Metadata } from "next";
import { isAdminAuthed } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: "لوحة تحكم فالكون",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthed();

  if (!authed) {
    // غير مسجّل — تُعرض صفحة الدخول فقط (بقية الصفحات تعيد التوجيه بنفسها)
    return <div className="min-h-screen bg-[#0A0A0B] text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col">
      <AdminSidebar />
      <main className="flex-1 lg:mr-64 pt-16 lg:pt-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
