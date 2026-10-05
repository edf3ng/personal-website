import type { MetadataRoute } from "next";

import { getNotes, getProjects } from "@/lib/content";
import { DESKTOP_ITEMS } from "@/lib/desktop";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    ...DESKTOP_ITEMS.map((item) => ({ path: item.href, priority: 0.8 })),
  ].map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page.priority,
  }));

  const notes = getNotes().map((note) => ({
    url: absoluteUrl(`/notes/${note.slug}`),
    lastModified: note.date,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const projects = getProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: project.date,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...pages, ...projects, ...notes];
}
