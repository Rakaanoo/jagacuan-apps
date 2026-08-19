import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jagacuan — Pencatat Tabungan Digital",
    short_name: "Jagacuan",
    description: "Aplikasi pencatat tabungan bertarget dan celengan digital.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#EFEADF",
    lang: "id",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}