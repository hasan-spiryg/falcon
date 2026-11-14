import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { MediaManager } from "@/components/admin/media-manager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return <MediaManager />;
}
