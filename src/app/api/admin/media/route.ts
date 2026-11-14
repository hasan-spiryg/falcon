import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { db } from "@/lib/db";

/**
 * مكتبة الوسائط — الصور تُخزَّن في قاعدة البيانات (جدول media)
 * بدل نظام الملفات، لأن قرص Render مؤقت ويُمحى عند كل نشر جديد.
 */

function unauthorized() {
  return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
}

const MAX_SIZE = 5 * 1024 * 1024; // 5 ميغابايت
const ALLOWED_EXT = ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"] as const;
const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
};

/** قائمة الصور المرفوعة */
export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const items = await db.media.findMany({
      orderBy: { createdAt: "desc" },
      select: { name: true, size: true, mime: true, createdAt: true },
    });
    return NextResponse.json({
      ok: true,
      items: items.map((m) => ({
        name: m.name,
        size: m.size,
        url: `/api/media/${m.name}`,
      })),
    });
  } catch (e) {
    console.error("media list", e);
    return NextResponse.json({ ok: false, error: "تعذّر قراءة المكتبة" }, { status: 500 });
  }
}

/** رفع صورة جديدة إلى قاعدة البيانات */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "لم يتم اختيار ملف" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { ok: false, error: "حجم الصورة يتجاوز 5 ميغابايت" },
        { status: 400 }
      );
    }
    const ext = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!(ALLOWED_EXT as readonly string[]).includes(ext)) {
      return NextResponse.json(
        { ok: false, error: `صيغة غير مدعومة — المسموح: ${ALLOWED_EXT.join(", ")}` },
        { status: 400 }
      );
    }

    // اسم آمن: طابع زمني + اسم منقّح + جزء عشوائي لتفادي التكرار
    const base =
      file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[^\p{L}\p{N}_-]+/gu, "-")
        .slice(0, 40) || "image";
    let filename = `${Date.now()}-${base}.${ext}`;
    if (await db.media.findUnique({ where: { name: filename } })) {
      filename = `${Date.now()}-${base}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await db.media.create({
      data: {
        name: filename,
        mime: MIME_BY_EXT[ext] ?? file.type || "application/octet-stream",
        size: buffer.length,
        data: buffer.toString("base64"),
      },
    });

    return NextResponse.json({ ok: true, url: `/api/media/${filename}`, name: filename });
  } catch (e) {
    console.error("media upload", e);
    return NextResponse.json({ ok: false, error: "تعذّر رفع الصورة" }, { status: 500 });
  }
}

/** حذف صورة من قاعدة البيانات */
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const name = req.nextUrl.searchParams.get("name");
    if (!name || name.includes("/") || name.includes("..") || name.startsWith(".")) {
      return NextResponse.json({ ok: false, error: "اسم ملف غير صالح" }, { status: 400 });
    }
    try {
      await db.media.delete({ where: { name } });
    } catch {
      // الملف غير موجود — لا مشكلة
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("media delete", e);
    return NextResponse.json({ ok: false, error: "تعذّر حذف الصورة" }, { status: 500 });
  }
}
