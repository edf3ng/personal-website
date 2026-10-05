import type { Metadata } from "next";

import { WindowFrame } from "@/components/desktop/WindowFrame";
import { resume } from "@/content/resume";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}.`,
  alternates: { canonical: "/about" },
};

const NOW = [
  { label: "School", value: "UT Austin · CS Honors + Canfield Business Honors" },
  { label: "Research", value: "Ocean acoustics, remote sensing, retrieval" },
  { label: "Listening", value: "Lofi, rain on the window" },
  { label: "Building", value: "This desktop" },
];

export default function AboutPage() {
  return (
    <WindowFrame title="About Me" icon="/desktop/icons/user.svg" width={540}>
      <p className="os-kicker">About</p>
      <h1>{site.name}</h1>
      <p>{resume.summary}</p>

      <h2>Background</h2>
      <p>
        I grew up in Austin, finished at Liberal Arts and Science Academy (rank
        3/400), and started at UT in 2026. Most of my work sits where data
        meets a system you can actually run: hydrophone spectra, satellite
        soil maps, RAG chatbots, and the evaluation that keeps them honest.
      </p>
      <p>
        This site is the desk I keep at night. Rain on the glass, folders on
        the right, windows for anything worth opening.
      </p>

      <h2>Currently</h2>
      <ul className="rows">
        {NOW.map((item) => (
          <li key={item.label}>
            <span className="label">{item.label}</span>
            <span>{item.value}</span>
          </li>
        ))}
      </ul>

      <h2>Contact</h2>
      <ul className="contact-row">
        <li>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
        <li>
          <a href={site.links.github} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
        </li>
        <li>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer noopener">
            LinkedIn
          </a>
        </li>
      </ul>
    </WindowFrame>
  );
}
