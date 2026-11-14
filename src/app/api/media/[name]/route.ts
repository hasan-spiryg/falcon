import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * عرض صورة من مكتبة الوسائط المخزنة في قاعدة البيانات.
 * مسار عام (بدون مصادقة) لأن الصور تظهر في الموقع للزوار.
 * الروابط القديمة /uploads/<name> تُعاد كتابتها إلى هنا من next.config.ts
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const safe = decodeURIComponent(name ?? "");
  if (!safe || safe.includes("/") || safe.includes("..") || safe.startsWith(".")) {
    return new NextResponse("غير موجود", { status: 404 });
  }

  const item = await db.media.findUnique({ where: { name: safe } });
  if (!item) {
    return new NextResponse("غير موجود", { status: 404 });
  }

  const buffer = Buffer.from(item.data, "base64");
  const headers: Record<string, string> = {
    "Content-Type": item.mime,
    "Content-Length": String(buffer.length),
    // الأسماء فريدة بطابعها الزمني — يمكن التخزين المؤقت للأبد
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  };
  // منع تنفيذ أي سكربت داخل ملفات SVG
  if (item.mime === "image/svg+xml") {
    headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'";
  }

  return new NextResponse(new Uint8Array(buffer), { headers });
}
