import Link from "next/link";

import { TagRow } from "./Tag";
import { formatDate, type Project } from "@/lib/content";

const STATUS_TONE: Record<Project["status"], string> = {
  shipped: "#39ff14",
  building: "#ffd400",
  archived: "#7fa89c",
};

/** A project as a game cartridge sitting in the rack. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-[rgb(var(--accent-rgb)/0.5)]">
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-white/12 bg-white/5 text-sm font-medium text-ink"
        >
          {project.badge ?? project.title.slice(0, 2).toUpperCase()}
        </span>
        <span
          className="arcade-label text-[0.5rem]"
          style={{ color: STATUS_TONE[project.status] }}
        >
          {project.status}
        </span>
      </div>

      <h2 className="mt-4 text-xl font-medium tracking-tight text-ink">
        <Link
          href={`/projects/${project.slug}`}
          className="before:absolute before:inset-0 before:content-[''] group-hover:text-[var(--accent)]"
        >
          {project.title}
        </Link>
      </h2>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-phosphor-dim">
        {project.summary}
      </p>

      <div className="mt-5 space-y-3">
        <TagRow tags={project.tags} />
        <p className="arcade-label text-[0.5rem] text-phosphor-dim/70">
          <time dateTime={project.date.toISOString()}>
            {formatDate(project.date)}
          </time>
          {project.featured ? " \u00B7 Featured" : ""}
        </p>
      </div>
    </article>
  );
}
