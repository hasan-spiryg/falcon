import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { SubscribersManager } from "@/components/admin/subscribers-manager";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return <SubscribersManager />;
}
