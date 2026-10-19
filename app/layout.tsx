import "./globals.css";
import type { Metadata, Viewport } from "next";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import AppDeepLinkRedirect from "@/components/AppDeepLinkRedirect";

export const metadata: Metadata = {
  title: "Jagacuan — Pencatat Tabungan Digital",
  description: "Aplikasi pencatat tabungan bertarget dan celengan digital.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jagacuan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0C10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head />
      <body className="bg-[#0B0C10] text-[#FFFFFF]" data-theme="dark">
        <AppDeepLinkRedirect />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}