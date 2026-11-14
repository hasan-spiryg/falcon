import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
}

const STATUSES = ["new", "confirmed", "delivered", "cancelled"];
export const STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  confirmed: "مؤكد",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

/** قائمة الطلبات — الأحدث أولاً */
export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, orders });
}

/** تحديث حالة طلب */
export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const body = (await req.json()) as { id?: string; status?: string };
    if (!body.id || !body.status || !STATUSES.includes(body.status)) {
      return NextResponse.json({ ok: false, error: "بيانات غير صالحة" }, { status: 400 });
    }
    await db.order.update({ where: { id: body.id }, data: { status: body.status } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin order update", e);
    return NextResponse.json({ ok: false, error: "تعذّر تحديث الطلب" }, { status: 500 });
  }
}

/** حذف طلب */
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "المعرّف مفقود" }, { status: 400 });
    }
    await db.order.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin order delete", e);
    return NextResponse.json({ ok: false, error: "تعذّر حذف الطلب" }, { status: 500 });
  }
}
