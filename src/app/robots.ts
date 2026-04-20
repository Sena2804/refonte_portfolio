import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://premicia.dev/sitemap.xml",
    host: "https://premicia.dev",
  };
}
