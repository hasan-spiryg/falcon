import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { getAllProductsAdmin } from "@/lib/content";
import { AdminDashboard } from "@/components/admin/dashboard";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const [orders, products, subs] = await Promise.all([
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    getAllProductsAdmin(),
    db.newsletterSub.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  const productNames = Object.fromEntries(products.map((p) => [p.id, p.name]));

  return (
    <AdminDashboard
      stats={{
        orders: orders.length,
        newOrders: orders.filter((o) => o.status === "new").length,
        products: products.length,
        subscribers: subs.length,
      }}
      recentOrders={orders.slice(0, 8).map((o) => ({
        id: o.id,
        name: o.name,
        phone: o.phone,
        city: o.city,
        model: productNames[o.model] ?? o.model,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      }))}
      recentSubs={subs.slice(0, 5).map((s) => ({
        id: s.id,
        email: s.email,
        createdAt: s.createdAt.toISOString(),
      }))}
    />
  );
}
