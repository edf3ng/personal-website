import type { Metadata } from "next";

import { OverlayShell } from "@/components/overlay/OverlayShell";
import { PrintButton } from "@/components/ui/PrintButton";
import { resume, type ResumeEntry } from "@/content/resume";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume for ${site.name} — ${resume.headline}.`,
  alternates: { canonical: "/resume" },
};

function EntryList({ entries }: { entries: readonly ResumeEntry[] }) {
  return (
    <ol className="space-y-9">
      {entries.map((entry) => (
        <li key={`${entry.org}-${entry.role}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-lg font-medium tracking-tight text-ink">
              {entry.role}
            </h3>
            <p className="arcade-label text-[0.5rem] text-phosphor-dim">
              {entry.start} &ndash; {entry.end}
            </p>
          </div>
          <p className="mt-1.5 text-sm text-[var(--accent)]">
            {entry.url ? (
              <a
                href={entry.url}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-4"
              >
                {entry.org}
              </a>
            ) : (
              entry.org
            )}
            {entry.location ? (
              <span className="text-phosphor-dim"> &middot; {entry.location}</span>
            ) : null}
          </p>
          <ul className="mt-3.5 space-y-2">
            {entry.points.map((point) => (
              <li
                key={point}
                className="relative pl-5 text-sm leading-relaxed text-phosphor/85 before:absolute before:left-0 before:text-[var(--accent)] before:content-['\25B8']"
              >
                {point}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-14 first:mt-0">
      <h2
        id={id}
        className="arcade-label mb-6 border-b border-[rgb(var(--accent-rgb)/0.25)] pb-2.5 text-[0.6rem] text-[var(--accent)]"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  return (
    <OverlayShell
      station="resume"
      title={`${site.name} — ${resume.headline}`}
      intro={
        <div className="space-y-5">
          <p>{resume.summary}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {resume.contact.map((item) => (
              <li key={item.label}>
                <span className="arcade-label mr-2 text-[0.45rem] text-phosphor-dim">
                  {item.label}
                </span>
                <a
                  href={item.href}
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  {item.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      }
      actions={<PrintButton />}
    >
      <div className="print-plain">
        <Section id="experience" title="Experience">
          <EntryList entries={resume.experience} />
        </Section>

        <Section id="education" title="Education">
          <EntryList entries={resume.education} />
        </Section>

        <Section id="skills" title="Skills">
          <dl className="grid gap-5 sm:grid-cols-2">
            {resume.skills.map((group) => (
              <div key={group.group}>
                <dt className="arcade-label text-[0.5rem] text-phosphor-dim">
                  {group.group}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-phosphor/85">
                  {group.items.join(" \u00B7 ")}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </OverlayShell>
  );
}
