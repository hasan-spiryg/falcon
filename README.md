<div dir="rtl" align="right">

<img src="public/brand/icon_falcon_light.png" width="90" alt="فالكون" />

# فالكون — FALCON

موقع براند **فالكون** السوري للساعات الرياضية عالية الجودة، مع ميزة مميزة: **منبه مواقيت الصلاة** مدمج في الساعة (ساعة تقليدية رياضية — غير ذكية). المركز الرئيسي في **إدلب، سوريا**.

## ماذا يتضمن المشروع؟

- **الموقع التعريفي** — صفحة واحدة RTL بالعربية: البطل، مجموعة الساعات، مواصفات فالكون برو، قسم منبه مواقيت الصلاة مع حساب أوقات الصلاة لأكثر من 20 مدينة سورية، نموذج طلب اقتناء، تذييل التواصل.
- **لوحة إدارة شاملة** (`/admin`) — تعديل كل نصوص وأقسام الموقع، إدارة المنتجات والأسعار، مكتبة صور (الرفع والتخزين داخل قاعدة البيانات)، متابعة الطلبات والمشتركين.

## التقنيات

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS 4 + مكوّنات shadcn/ui
- Prisma ORM + PostgreSQL (Neon) — يعمل محلياً بـ SQLite
- خطوط Cairo وTajawal مستضافة ذاتياً

## التشغيل محلياً

```bash
npm install
cp .env.example .env   # عدّل القيم
npx prisma db push     # إنشاء الجداول
npm run dev            # http://localhost:3000
```

لوحة الإدارة: `http://localhost:3000/admin` — كلمة المرور من `ADMIN_PASSWORD`.

## النشر (Neon + Render)

دليل كامل خطوة بخطوة في ملف **[DEPLOY.md](./DEPLOY.md)**، وملف `render.yaml` جاهز كمخطط نشر (Blueprint).

## بنية المشروع

```
├── render.yaml            # مخطط النشر على Render
├── deploy/render-build.sh # سكربت البناء (يحوّل Prisma إلى PostgreSQL)
├── prisma/schema.prisma   # مخطط قاعدة البيانات
├── src/app/               # صفحات الموقع ولوحة الإدارة و API
├── src/components/falcon/ # مكوّنات صفحة الموقع
├── src/components/admin/  # مكوّنات لوحة الإدارة
├── public/brand/          # صور الهوية والساعات
└── public/fonts/          # الخطوط المستضافة ذاتياً
```

</div>
