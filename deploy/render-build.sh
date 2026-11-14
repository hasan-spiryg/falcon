#!/usr/bin/env bash
# ============================================================
# سكربت بناء موقع فالكون على Render مع قاعدة بيانات Neon
# يُنفَّذ تلقائياً من render.yaml عند كل نشر
# ============================================================
set -euo pipefail

echo "==> [1/4] تثبيت الحزم (npm install)"
npm install

echo "==> [2/4] تجهيز مخطط PostgreSQL لقاعدة Neon"
# نحوّل المزوّد من sqlite إلى postgresql دون تغيير المخطط الأصلي
sed 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma > prisma/schema.render.prisma
npx prisma generate --schema=prisma/schema.render.prisma

echo "==> [3/4] إنشاء/تحديث الجداول في قاعدة Neon"
# مزامنة idempotent — لا تحذف بيانات موجودة إلا إذا تغيّر المخطط جذرياً
npx prisma db push --schema=prisma/schema.render.prisma --skip-generate

echo "==> [4/4] بناء الموقع (Next.js)"
# NEXT_OUTPUT_STANDALONE=0 => بناء عادي يعمل مع next start
NEXT_OUTPUT_STANDALONE=0 npx next build

echo "==> اكتمل البناء بنجاح"
