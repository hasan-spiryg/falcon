import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getAllProductsAdmin } from "@/lib/content";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
}

interface ProductBody {
  id?: string;
  name?: string;
  latin?: string;
  image?: string;
  price?: string;
  tagline?: string;
  specs?: { icon?: string; text?: string }[];
  badge?: string | null;
  active?: boolean;
  sortOrder?: number;
}

function cleanProduct(body: ProductBody) {
  return {
    name: (body.name ?? "").trim(),
    latin: (body.latin ?? "").trim(),
    image: (body.image ?? "").trim(),
    price: (body.price ?? "").trim(),
    tagline: (body.tagline ?? "").trim(),
    specs: JSON.stringify(
      (body.specs ?? [])
        .filter((s) => s && String(s.text ?? "").trim().length > 0)
        .map((s) => ({ icon: String(s.icon ?? "star"), text: String(s.text ?? "").trim() }))
    ),
    badge: body.badge && String(body.badge).trim().length > 0 ? String(body.badge).trim() : null,
    active: body.active !== false,
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
  };
}

/** قائمة المنتجات (للإدارة) */
export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  return NextResponse.json({ ok: true, products: await getAllProductsAdmin() });
}

/** إضافة منتج */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const body = (await req.json()) as ProductBody;
    const data = cleanProduct(body);
    if (data.name.length < 2) {
      return NextResponse.json({ ok: false, error: "اسم المنتج قصير جداً" }, { status: 400 });
    }
    if (!data.image) {
      return NextResponse.json({ ok: false, error: "أضف صورة للمنتج أولاً" }, { status: 400 });
    }
    const product = await db.product.create({ data });
    return NextResponse.json({ ok: true, id: product.id });
  } catch (e) {
    console.error("admin product create", e);
    return NextResponse.json({ ok: false, error: "تعذّر إنشاء المنتج" }, { status: 500 });
  }
}

/** تعديل منتج */
export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const body = (await req.json()) as ProductBody;
    if (!body.id) {
      return NextResponse.json({ ok: false, error: "معرّف المنتج مفقود" }, { status: 400 });
    }
    const data = cleanProduct(body);
    if (data.name.length < 2) {
      return NextResponse.json({ ok: false, error: "اسم المنتج قصير جداً" }, { status: 400 });
    }
    await db.product.update({ where: { id: body.id }, data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin product update", e);
    return NextResponse.json({ ok: false, error: "تعذّر تعديل المنتج" }, { status: 500 });
  }
}

/** حذف منتج */
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "معرّف المنتج مفقود" }, { status: 400 });
    }
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin product delete", e);
    return NextResponse.json({ ok: false, error: "تعذّر حذف المنتج" }, { status: 500 });
  }
}
