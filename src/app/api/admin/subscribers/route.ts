import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
}

/** قائمة المشتركين بالنشرة */
export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const subs = await db.newsletterSub.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, subs });
}

/** حذف مشترك */
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "المعرّف مفقود" }, { status: 400 });
    }
    await db.newsletterSub.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin sub delete", e);
    return NextResponse.json({ ok: false, error: "تعذّر حذف المشترك" }, { status: 500 });
  }
}
