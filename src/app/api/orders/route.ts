import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface OrderBody {
  name?: string;
  phone?: string;
  city?: string;
  model?: string;
}

const MODELS = new Set(["saqr", "shaheen", "hurr"]);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderBody;
    const name = body.name?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const city = body.city?.trim() ?? "";
    const model = body.model?.trim() ?? "";

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "الاسم قصير جداً" }, { status: 400 });
    }
    if (!/^[0-9+\s-]{9,15}$/.test(phone)) {
      return NextResponse.json({ ok: false, error: "رقم الهاتف غير صالح" }, { status: 400 });
    }
    if (!city) {
      return NextResponse.json({ ok: false, error: "الرجاء اختيار المدينة" }, { status: 400 });
    }
    if (!MODELS.has(model)) {
      return NextResponse.json({ ok: false, error: "الرجاء اختيار الموديل" }, { status: 400 });
    }

    const order = await db.order.create({
      data: { name, phone, city, model },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id.slice(-6).toUpperCase(),
    });
  } catch (e) {
    console.error("order error", e);
    return NextResponse.json({ ok: false, error: "حدث خطأ، حاول لاحقاً" }, { status: 500 });
  }
}
