import type { Metadata } from "next";

import { WindowFrame } from "@/components/desktop/WindowFrame";
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
    <div>
      {entries.map((entry) => (
        <article key={`${entry.org}-${entry.role}`} className="job">
          <div className="job-head">
            <h3>{entry.role}</h3>
            <p className="job-dates">
              {entry.start ? `${entry.start} – ${entry.end}` : entry.end}
            </p>
          </div>
          <p className="job-org">
            {entry.url ? (
              <a href={entry.url} target="_blank" rel="noreferrer noopener">
                {entry.org}
              </a>
            ) : (
              entry.org
            )}
            {entry.location ? ` · ${entry.location}` : null}
          </p>
          {entry.points.length > 0 ? (
            <ul>
              {entry.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export default function ResumePage() {
  return (
    <WindowFrame
      title="Resume"
      icon="/desktop/icons/resume.svg"
      width={640}
      actions={<PrintButton />}
    >
      <div className="print-plain resume-doc">
        <h1>Resume</h1>
        <p className="resume-bio">{resume.summary}</p>
        <ul className="contact-row">
          {resume.contact.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.value}</a>
            </li>
          ))}
        </ul>

        <section className="resume-section">
          <h2>Experience</h2>
          <EntryList entries={resume.experience} />
        </section>

        {resume.education.length > 0 ? (
          <section className="resume-section">
            <h2>Education</h2>
            <EntryList entries={resume.education} />
          </section>
        ) : null}

        <section className="resume-section">
          <h2>Skills</h2>
          {resume.skills.map((group) => (
            <p key={group.group} className="resume-skill">
              <strong>{group.group}.</strong> {group.items.join(", ")}
            </p>
          ))}
        </section>
      </div>
    </WindowFrame>
  );
}
