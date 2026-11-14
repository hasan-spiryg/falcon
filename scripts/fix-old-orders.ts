// إصلاح الطلبات القديمة التي تشير لمعرّفات منتجات لم تعد موجودة
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const products = await db.product.findMany({ orderBy: { sortOrder: "asc" } });
  if (products.length === 0) {
    console.log("لا توجد منتجات");
    return;
  }
  const ids = new Set(products.map((p) => p.id));
  const orders = await db.order.findMany();
  let fixed = 0;
  for (const o of orders) {
    if (!ids.has(o.model)) {
      await db.order.update({
        where: { id: o.id },
        data: { model: products[0].id },
      });
      fixed++;
      console.log(`تم إصلاح الطلب ${o.id.slice(-6).toUpperCase()} → ${products[0].name}`);
    }
  }
  console.log(`تم إصلاح ${fixed} طلب من أصل ${orders.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
