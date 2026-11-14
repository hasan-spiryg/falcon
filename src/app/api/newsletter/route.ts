import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "بريد إلكتروني غير صالح" }, { status: 400 });
    }
    await db.newsletterSub.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("newsletter error", e);
    return NextResponse.json({ ok: false, error: "حدث خطأ، حاول لاحقاً" }, { status: 500 });
  }
}
