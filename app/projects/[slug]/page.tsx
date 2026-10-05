import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/overlay/Mdx";
import { OverlayShell } from "@/components/overlay/OverlayShell";
import { TagRow } from "@/components/ui/Tag";
import { formatDate, getProject, getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const path = `/projects/${project.slug}`;
  const og = `/api/og?title=${encodeURIComponent(project.title)}&eyebrow=Project&accent=cyan`;

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: absoluteUrl(path),
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [og],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <OverlayShell
      station="projects"
      eyebrow="Project"
      title={project.title}
      width="narrow"
      actions={
        <>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer noopener"
              className="arcade-label rounded border border-[rgb(var(--accent-rgb)/0.5)] px-3 py-2 text-[0.5rem] text-[var(--accent)] transition-colors hover:bg-[rgb(var(--accent-rgb)/0.12)]"
            >
              Play it
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="arcade-label rounded border border-white/15 px-3 py-2 text-[0.5rem] text-phosphor-dim transition-colors hover:text-phosphor"
            >
              Source
            </a>
          )}
        </>
      }
      intro={
        <div className="space-y-4">
          <p>{project.summary}</p>
          <div className="flex flex-wrap items-center gap-3">
            <p className="arcade-label text-[0.5rem] text-phosphor-dim/70">
              <time dateTime={project.date.toISOString()}>
                {formatDate(project.date)}
              </time>{" "}
              &middot; {project.status} &middot; {project.readingMinutes} min
              read
            </p>
            <TagRow tags={project.tags} />
          </div>
        </div>
      }
    >
      <Mdx source={project.body} />
    </OverlayShell>
  );
}
