import type { Metadata } from "next";

import { OverlayShell } from "@/components/overlay/OverlayShell";
import { resume } from "@/content/resume";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}.`,
  alternates: { canonical: "/about" },
};

const TIMELINE = [
  {
    year: "Now",
    text: "Building interactive front-ends and graphics tooling, and writing about it in the notes cabinet.",
  },
  {
    year: "2024",
    text: "Moved deeper into rendering work: WebGL pipelines, shader debugging, and performance budgets that hold up in CI.",
  },
  {
    year: "2022",
    text: "Started shipping production front-ends full-time and got serious about accessibility and design systems.",
  },
  {
    year: "2018",
    text: "First real program: a terrible, wonderful 2D game engine that taught me what a game loop actually is.",
  },
];

const NOW = [
  { label: "Reading", value: "Real-Time Rendering, 4th ed." },
  { label: "Playing", value: "Anything with a good movement system" },
  { label: "Building", value: "This arcade, and a shader playground" },
  { label: "Learning", value: "Compute shaders and WebGPU" },
];

export default function AboutPage() {
  return (
    <OverlayShell
      station="about"
      title={`About ${site.name}`}
      intro={<p>{resume.summary}</p>}
    >
      <section aria-labelledby="highlights">
        <h2
          id="highlights"
          className="mb-5 text-sm font-medium text-ink-dim"
        >
          Highlights
        </h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {resume.highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center"
            >
              <dt className="arcade-label text-[0.45rem] text-phosphor-dim">
                {item.label}
              </dt>
              <dd className="mt-2.5 text-2xl font-medium tracking-tight text-ink">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="story" className="mt-14">
        <h2
          id="story"
          className="mb-5 text-sm font-medium text-ink-dim"
        >
          Background
        </h2>
        <div className="space-y-5 text-base leading-[1.85] text-phosphor/85">
          <p>
            I build things people touch. Most of my work sits where interface
            meets systems: editors, canvases, visualisations, and the tooling
            that keeps them fast. The interesting constraints usually show up at
            that seam, where a design decision turns into a frame budget.
          </p>
          <p>
            Before any of that, I spent a lot of quarters in arcades. The thing
            I took from them is that good software telegraphs what it wants from
            you. A cabinet shows you the controls and starts a demo loop. No
            onboarding modal, no tour. That is the bar I aim for.
          </p>
          <p>
            Outside work I write up what I learn, mostly in the notes cabinet,
            and keep a running list of small tools I want to exist.
          </p>
        </div>
      </section>

      <section aria-labelledby="timeline" className="mt-14">
        <h2
          id="timeline"
          className="mb-5 text-sm font-medium text-ink-dim"
        >
          Timeline
        </h2>
        <ol className="space-y-0">
          {TIMELINE.map((entry) => (
            <li
              key={entry.year}
              className="flex gap-5 border-l border-white/10 pb-7 pl-5 last:pb-0"
            >
              <span className="arcade-label w-12 shrink-0 pt-0.5 text-[0.55rem] text-[var(--accent)]">
                {entry.year}
              </span>
              <p className="text-sm leading-relaxed text-phosphor-dim">
                {entry.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="now" className="mt-14">
        <h2
          id="now"
          className="mb-5 text-sm font-medium text-ink-dim"
        >
          Currently
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          {NOW.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-4"
            >
              <dt className="arcade-label text-[0.45rem] text-phosphor-dim">
                {item.label}
              </dt>
              <dd className="mt-2 text-sm text-phosphor/85">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="contact" className="mt-14">
        <h2
          id="contact"
          className="mb-5 text-sm font-medium text-ink-dim"
        >
          Contact
        </h2>
        <p className="text-sm leading-relaxed text-phosphor-dim">
          The fastest way to reach me is{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-[var(--accent)] underline underline-offset-4"
          >
            {site.email}
          </a>
          . I am also on{" "}
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            GitHub
          </a>{" "}
          and{" "}
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            LinkedIn
          </a>
          .
        </p>
      </section>
    </OverlayShell>
  );
}
