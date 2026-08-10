import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Espace privé et routes techniques : rien à indexer.
      disallow: ["/admin", "/api/"],
    },
    sitemap: "https://premicia.dev/sitemap.xml",
    host: "https://premicia.dev",
  };
}
