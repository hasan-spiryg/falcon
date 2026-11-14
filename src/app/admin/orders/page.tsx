import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { OrdersManager } from "@/components/admin/orders-manager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return <OrdersManager />;
}
