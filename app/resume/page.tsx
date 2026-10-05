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
          <ul>
            {entry.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
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
      width={620}
      actions={<PrintButton />}
    >
      <div className="print-plain">
        <p className="os-kicker">Resume</p>
        <h1>{resume.headline}</h1>
        <p>{resume.summary}</p>
        <ul className="contact-row">
          {resume.contact.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.value}</a>
            </li>
          ))}
        </ul>

        <h2>Experience</h2>
        <EntryList entries={resume.experience} />

        {resume.education.length > 0 ? (
          <>
            <h2>Education</h2>
            <EntryList entries={resume.education} />
          </>
        ) : null}

        <h2>Honors</h2>
        <ul className="honor-list">
          {resume.honors.map((honor) => (
            <li key={honor.title}>
              <span className="job-dates">{honor.date}</span>
              <span>{honor.title}</span>
            </li>
          ))}
        </ul>

        <h2>Skills</h2>
        {resume.skills.map((group) => (
          <p key={group.group}>
            <strong>{group.group}.</strong> {group.items.join(", ")}
          </p>
        ))}
      </div>
    </WindowFrame>
  );
}
