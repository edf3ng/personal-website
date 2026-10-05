import type { Metadata } from "next";
import Link from "next/link";

import { WindowFrame } from "@/components/desktop/WindowFrame";
import { formatDate, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I have built and shipped, with write-ups on how they went.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <WindowFrame title="Projects" icon="/desktop/icons/folder.svg" width={560}>
      <p className="os-kicker">Folder</p>
      <h1>Projects</h1>
      <p>Files on this desk. Open one and it comes up in a window.</p>
      {projects.length === 0 ? (
        <p>This folder is empty.</p>
      ) : (
        <ul className="file-list">
          {projects.map((project) => (
            <li key={project.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/desktop/icons/document.svg" alt="" />
              <div>
                <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                <p className="file-meta">
                  {project.status} · {formatDate(project.date)}
                </p>
                <p className="file-summary">{project.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </WindowFrame>
  );
}
