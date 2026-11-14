import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { ContentManager } from "@/components/admin/content-manager";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return <ContentManager />;
}
