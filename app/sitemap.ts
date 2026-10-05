import type { MetadataRoute } from "next";

import { getNotes, getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { STATION_LIST } from "@/lib/stations";

export default function sitemap(): MetadataRoute.Sitemap {
  const stations = STATION_LIST.map((station) => ({
    url: absoluteUrl(station.path),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: station.path === "/" ? 1 : 0.8,
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

  return [...stations, ...projects, ...notes];
}
