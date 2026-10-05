import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");
const isDev = process.env.NODE_ENV === "development";

const baseFrontmatter = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const noteFrontmatter = baseFrontmatter;

const projectFrontmatter = baseFrontmatter.extend({
  /** Shipping state, shown as a badge on the card. */
  status: z.enum(["shipped", "building", "archived"]).default("shipped"),
  repo: z.url().optional(),
  demo: z.url().optional(),
  featured: z.boolean().default(false),
  /** Two-to-four character glyph used as the card's "cartridge" label. */
  badge: z.string().max(4).optional(),
});

export type Note = z.infer<typeof noteFrontmatter> & {
  slug: string;
  body: string;
  readingMinutes: number;
};

export type Project = z.infer<typeof projectFrontmatter> & {
  slug: string;
  body: string;
  readingMinutes: number;
};

type Entry = { date: Date; tags: string[]; draft: boolean };

function readCollection<T extends Entry>(
  folder: string,
  schema: z.ZodType<T>,
): (T & { slug: string; body: string; readingMinutes: number })[] {
  const dir = path.join(CONTENT_DIR, folder);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);

      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        // Fail the build rather than shipping a half-formed entry.
        throw new Error(
          `Invalid frontmatter in content/${folder}/${file}:\n${z.prettifyError(parsed.error)}`,
        );
      }

      return {
        ...parsed.data,
        slug,
        body: content,
        readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
      };
    })
    .filter((entry) => isDev || !entry.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getNotes(): Note[] {
  return readCollection("notes", noteFrontmatter) as Note[];
}

export function getNote(slug: string): Note | undefined {
  return getNotes().find((note) => note.slug === slug);
}

export function getProjects(): Project[] {
  const projects = readCollection("projects", projectFrontmatter) as Project[];
  // Featured work floats to the top, then reverse chronological.
  return projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.date.getTime() - a.date.getTime();
  });
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function collectTags(entries: { tags: string[] }[]): string[] {
  return [...new Set(entries.flatMap((entry) => entry.tags))].sort();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
