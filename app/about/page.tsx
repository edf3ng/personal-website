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
      <p>
        Hi, I'm Edwin! I'm a freshman at UT Austin studying Computer Science and Business.
        I'm interested in the intersection of technology and business, and I'm always looking for new
        opportunities to learn and grow.
      </p>

      <h2>Background</h2>
      <p>
        I was born and raised in Austin, graduating from the Liberal Arts and Science Academy.
        I love the outdoors, and I'm a big fan of the Texas Longhorns. I also love watching
        Valorant esports!
      </p>

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
