import "./globals.css";
import type { Metadata, Viewport } from "next";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

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
  themeColor: "#EFEADF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem("jagacuan-theme");
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const html = document.documentElement;
                  if (savedTheme) {
                    html.setAttribute("data-theme", savedTheme);
                  } else if (prefersDark) {
                    html.setAttribute("data-theme", "dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body data-theme="light">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}