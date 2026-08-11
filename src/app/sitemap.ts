import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/projets", priority: 0.9 },
    { path: "/parcours", priority: 0.8 },
    { path: "/a-propos", priority: 0.8 },
    { path: "/cv", priority: 0.7 },
  ];

  // Les fiches projet sont prérendues : elles ont leur place ici, sinon Google
  // ne les découvre que par le maillage interne.
  const projects = getAllProjects().map((p) => ({
    path: `/projets/${p.slug}`,
    priority: 0.6,
  }));

  return [...pages, ...projects].map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
