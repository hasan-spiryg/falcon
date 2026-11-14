import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "فالكون | ساعات رياضية سورية — FALCON",
  description:
    "فالكون — براند سوري للساعات الرياضية عالية الجودة. ساعات صُنعت بمعايير عالمية مع منبه لمواقيت الصلاة. FALCON Idlib sports watches with prayer time alarm.",
  keywords: [
    "فالكون",
    "ساعات رياضية",
    "ساعات سورية",
    "منبه مواقيت الصلاة",
    "FALCON",
    "Syrian watches",
    "Idlib",
    "sports watch",
  ],
  authors: [{ name: "FALCON - فالكون" }],
  icons: {
    icon: "/brand/icon_falcon_light.png",
  },
  openGraph: {
    title: "فالكون | ساعات رياضية سورية",
    description: "ساعات رياضية عالية الجودة مع منبه لمواقيت الصلاة — صناعة سورية",
    siteName: "FALCON",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
