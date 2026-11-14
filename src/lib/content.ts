import { db } from "@/lib/db";
import {
  DEFAULT_CONTENT,
  DEFAULT_PRODUCTS,
  type ProductDTO,
  type SiteContent,
} from "@/lib/site-defaults";

/** دمج عميق بسيط: قيم قاعدة البيانات تتجاوز الافتراضيات */
function deepMerge<T>(base: T, override: unknown): T {
  if (
    override === null ||
    override === undefined ||
    typeof override !== "object" ||
    Array.isArray(override) ||
    typeof base !== "object" ||
    base === null ||
    Array.isArray(base)
  ) {
    return (override === undefined ? base : override) as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
    out[k] = k in out ? deepMerge((base as Record<string, unknown>)[k], v) : v;
  }
  return out as T;
}

function parseSpecs(raw: string): { icon: string; text: string }[] {
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((s): s is { icon?: string; text?: string } => !!s && typeof s === "object")
      .map((s) => ({ icon: String(s.icon ?? "star"), text: String(s.text ?? "") }))
      .filter((s) => s.text.length > 0);
  } catch {
    return [];
  }
}

/** زرع المنتجات الافتراضية عند أول تشغيل (أو بعد تفريغ الجدول) */
async function ensureProductsSeeded() {
  const count = await db.product.count();
  if (count > 0) return;
  await db.product.createMany({
    data: DEFAULT_PRODUCTS.map((p) => ({
      name: p.name,
      latin: p.latin,
      image: p.image,
      price: p.price,
      tagline: p.tagline,
      specs: JSON.stringify(p.specs),
      badge: p.badge ?? null,
      sortOrder: p.sortOrder,
      active: true,
    })),
  });
}

export interface SiteData {
  content: SiteContent;
  products: ProductDTO[];
}

/** جلب كل محتوى الموقع: المنتجات النشطة + الإعدادات مدموجة مع الافتراضيات */
export async function getSiteData(): Promise<SiteData> {
  await ensureProductsSeeded();

  const [products, settings] = await Promise.all([
    db.product.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    db.setting.findMany(),
  ]);

  const overrides: Record<string, unknown> = {};
  for (const s of settings) {
    try {
      overrides[s.key] = JSON.parse(s.value);
    } catch {
      // تجاهل القيم التالفة
    }
  }

  const content = deepMerge(DEFAULT_CONTENT, overrides);

  return {
    content,
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      latin: p.latin,
      image: p.image,
      price: p.price,
      tagline: p.tagline,
      specs: parseSpecs(p.specs),
      badge: p.badge,
    })),
  };
}

/** جلب كل المنتجات بما فيها غير النشطة — للوحة الإدارة */
export async function getAllProductsAdmin() {
  const products = await db.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    latin: p.latin,
    image: p.image,
    price: p.price,
    tagline: p.tagline,
    specs: parseSpecs(p.specs),
    badge: p.badge,
    active: p.active,
    sortOrder: p.sortOrder,
  }));
}

/** جلب الإعدادات الخام — للوحة الإدارة */
export async function getSettingsRaw(): Promise<Record<string, unknown>> {
  const settings = await db.setting.findMany();
  const out: Record<string, unknown> = {};
  for (const s of settings) {
    try {
      out[s.key] = JSON.parse(s.value);
    } catch {
      // تجاهل
    }
  }
  return out;
}
