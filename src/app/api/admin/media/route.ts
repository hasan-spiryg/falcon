import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { mkdir, readdir, unlink, writeFile } from "fs/promises";
import path from "path";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5 ميغابايت
const ALLOWED_EXT = ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"];

/** قائمة الصور المرفوعة */
export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const files = (await readdir(UPLOAD_DIR)).filter((f) => !f.startsWith("."));
    const items = await Promise.all(
      files.map(async (f) => ({
        name: f,
        url: `/uploads/${f}`,
      }))
    );
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("media list", e);
    return NextResponse.json({ ok: false, error: "تعذّر قراءة الملفات" }, { status: 500 });
  }
}

/** رفع صورة جديدة */
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
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json(
        { ok: false, error: `صيغة غير مدعومة — المسموح: ${ALLOWED_EXT.join(", ")}` },
        { status: 400 }
      );
    }

    // اسم آمن: طابع زمني + اسم منقّح
    const base = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^\p{L}\p{N}_-]+/gu, "-")
      .slice(0, 40) || "image";
    const filename = `${Date.now()}-${base}.${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return NextResponse.json({ ok: true, url: `/uploads/${filename}`, name: filename });
  } catch (e) {
    console.error("media upload", e);
    return NextResponse.json({ ok: false, error: "تعذّر رفع الصورة" }, { status: 500 });
  }
}

/** حذف صورة مرفوعة */
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const name = req.nextUrl.searchParams.get("name");
    if (!name || name.includes("/") || name.includes("..") || name.startsWith(".")) {
      return NextResponse.json({ ok: false, error: "اسم ملف غير صالح" }, { status: 400 });
    }
    const filePath = path.join(UPLOAD_DIR, path.basename(name));
    await unlink(filePath).catch(() => undefined);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("media delete", e);
    return NextResponse.json({ ok: false, error: "تعذّر حذف الصورة" }, { status: 500 });
  }
}
