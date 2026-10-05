import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WindowFrame } from "@/components/desktop/WindowFrame";
import { Mdx } from "@/components/mdx/Mdx";
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
  const og = `/api/og?title=${encodeURIComponent(project.title)}&eyebrow=Project`;

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
    <WindowFrame
      title={project.title}
      icon="/desktop/icons/document.svg"
      width={600}
      actions={
        <>
          {project.demo ? (
            <a href={project.demo} target="_blank" rel="noreferrer noopener">
              Demo
            </a>
          ) : null}
          {project.repo ? (
            <a href={project.repo} target="_blank" rel="noreferrer noopener">
              Source
            </a>
          ) : null}
        </>
      }
    >
      <p className="os-kicker">Project</p>
      <h1>{project.title}</h1>
      <p>{project.summary}</p>
      <p className="hint">
        <time dateTime={project.date.toISOString()}>
          {formatDate(project.date)}
        </time>{" "}
        · {project.status} · {project.readingMinutes} min
        {project.tags.length ? ` · ${project.tags.join(", ")}` : ""}
      </p>
      <Mdx source={project.body} />
    </WindowFrame>
  );
}
