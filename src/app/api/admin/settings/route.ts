import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSettingsRaw } from "@/lib/content";
import { DEFAULT_CONTENT } from "@/lib/site-defaults";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
}

/** جلب كل إعدادات المحتوى (مدموجة مع الافتراضيات لعرضها في النماذج) */
export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const saved = await getSettingsRaw();
  // دمج بسيط سطحياً يكفي هنا لأن كل قسم يُحرَّر كاملاً من النموذج
  const merged: Record<string, unknown> = {};
  for (const key of Object.keys(DEFAULT_CONTENT)) {
    const def = (DEFAULT_CONTENT as unknown as Record<string, unknown>)[key];
    merged[key] =
      key in saved && saved[key] !== undefined && saved[key] !== null ? saved[key] : def;
  }
  return NextResponse.json({ ok: true, content: merged });
}

/** حفظ قسم محتوى واحد أو أكثر */
export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const body = (await req.json()) as { content?: Record<string, unknown> };
    const content = body.content ?? {};
    const validKeys = Object.keys(DEFAULT_CONTENT);
    for (const [key, value] of Object.entries(content)) {
      if (!validKeys.includes(key)) continue;
      await db.setting.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: { key, value: JSON.stringify(value) },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin settings save", e);
    return NextResponse.json({ ok: false, error: "تعذّر حفظ المحتوى" }, { status: 500 });
  }
}

/** إرجاع قسم إلى الافتراضي */
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const key = req.nextUrl.searchParams.get("key");
    if (!key) {
      return NextResponse.json({ ok: false, error: "المفتاح مفقود" }, { status: 400 });
    }
    await db.setting.deleteMany({ where: { key } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin settings reset", e);
    return NextResponse.json({ ok: false, error: "تعذّر إرجاع الافتراضي" }, { status: 500 });
  }
}
