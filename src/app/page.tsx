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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Products />
        <Showcase />
        <PrayerSection />
        <TechSection />
        <AboutSection />
        <OrderSection />
      </main>
      <Footer />
    </div>
  );
}
