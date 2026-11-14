import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { ProductsManager } from "@/components/admin/products-manager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return <ProductsManager />;
}
