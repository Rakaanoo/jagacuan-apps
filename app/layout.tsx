import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import AppDeepLinkRedirect from "@/components/AppDeepLinkRedirect";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JagaCuan | Celengan Pintar & Nabung Bareng",
  description:
    "Atur target tabungan pribadi dan nabung bareng teman, keluarga, atau pasangan lebih terarah. Pantau kedisiplinan menabung lewat statistik dan pengingat otomatis.",
  icons: {
    icon: "/icons/jagacuan-brand.png",
    apple: "/icons/jagacuan-brand.png",
  },
  openGraph: {
    title: "JagaCuan | Celengan Pintar & Nabung Bareng",
    description:
      "Aplikasi pencatat tabungan pribadi & nabung bareng untuk Android. Gratis, ringan, dan terarah.",
    images: ["/icons/jagacuan-brand.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JagaCuan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#12141B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} dark`}>
      <head />
      <body className="bg-[#12141B] text-white font-sans antialiased">
        <AppDeepLinkRedirect />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
