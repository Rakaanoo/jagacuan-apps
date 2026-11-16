import "./globals.css";
import type { Metadata, Viewport } from "next";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import AppDeepLinkRedirect from "@/components/AppDeepLinkRedirect";

export const metadata: Metadata = {
  title: "JagaCuan — Unduh Aplikasi Resmi Android",
  description: "Unduh aplikasi JagaCuan untuk pencatatan tabungan pribadi dan nabung bareng.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JagaCuan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030637",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head />
      <body className="bg-[#030637] text-[#FFFFFF]" data-theme="dark">
        <AppDeepLinkRedirect />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}