import type { MetadataRoute } from "next";

const base = "https://premicia.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/projets", priority: 0.9 },
    { path: "/parcours", priority: 0.8 },
    { path: "/a-propos", priority: 0.8 },
    { path: "/cv", priority: 0.7 },
  ];

  const lastModified = new Date();

  return routes.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
