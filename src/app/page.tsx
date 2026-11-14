import { Navbar } from "@/components/falcon/navbar";
import { Hero } from "@/components/falcon/hero";
import { Marquee } from "@/components/falcon/marquee";
import { Showcase } from "@/components/falcon/showcase";
import { Products } from "@/components/falcon/products";
import { PrayerSection } from "@/components/falcon/prayer-section";
import { TechSection } from "@/components/falcon/tech-section";
import { AboutSection } from "@/components/falcon/about-section";
import { OrderSection } from "@/components/falcon/order-section";
import { Footer } from "@/components/falcon/footer";
import { getSiteData } from "@/lib/content";

// المحتوى يأتي من قاعدة البيانات — يُعاد جلبه مع كل طلب ليعكس تعديلات لوحة الإدارة فوراً
export const dynamic = "force-dynamic";

export default async function Home() {
  const { content, products } = await getSiteData();

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-white">
      <Navbar city={content.contact.city} />
      <main className="flex-1">
        <Hero content={content.hero} />
        <Marquee content={content.marquee} />
        <Products products={products} content={content.products} />
        <Showcase content={content.showcase} />
        <PrayerSection content={content.prayer} />
        <TechSection content={content.tech} />
        <AboutSection content={content.about} trust={content.trust} />
        <OrderSection products={products} />
      </main>
      <Footer contact={content.contact} content={content.footer} />
    </div>
  );
}
