import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, createSessionToken } from "@/lib/admin-auth";

/** تسجيل الدخول إلى لوحة الإدارة */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { password?: string };
    if (!checkPassword(body.password ?? "")) {
      return NextResponse.json(
        { ok: false, error: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "حدث خطأ" }, { status: 500 });
  }
}

/** تسجيل الخروج */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
