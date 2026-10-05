import type { Metadata } from "next";

import { OverlayShell } from "@/components/overlay/OverlayShell";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things I have built and shipped, with write-ups on how they went.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <OverlayShell
      station="projects"
      title="Projects"
      intro={
        <p>
          A rack of cartridges. Each one has a write-up covering what it does,
          what it cost to build, and what I would change.
        </p>
      }
    >
      {projects.length === 0 ? (
        <p className="text-sm text-phosphor-dim">
          The rack is empty. Drop an <code>.mdx</code> file in{" "}
          <code>content/projects/</code> to load a cartridge.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug} className="h-full">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </OverlayShell>
  );
}
