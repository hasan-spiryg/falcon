import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // في بيئة التطوير المحلية نبني بنمط standalone كما تقتضي المنصة،
  // أما على Render (NEXT_OUTPUT_STANDALONE=0) فنبني بالوضع العادي
  // ليعمل أمر next start مع Prisma دون أي مشاكل تتبع.
  output: process.env.NEXT_OUTPUT_STANDALONE === "0" ? undefined : "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai"],
  async rewrites() {
    return [
      // توافق خلفي: الروابط القديمة /uploads/<اسم> تُقدَّم من مكتبة قاعدة البيانات
      { source: "/uploads/:name", destination: "/api/media/:name" },
    ];
  },
};

export default nextConfig;
