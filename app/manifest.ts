import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JagaCuan — Pencatat Tabungan Digital",
    short_name: "JagaCuan",
    description: "Aplikasi pencatat tabungan bertarget dan celengan digital.",
    start_url: "/",
    display: "standalone",
    background_color: "#080B18",
    theme_color: "#030637",
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