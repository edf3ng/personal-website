import type { Metadata } from "next";

import { WindowFrame } from "@/components/desktop/WindowFrame";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <WindowFrame title="Read Me" icon="/desktop/icons/document.svg" width={440}>
        <p className="os-kicker">Late night · Austin</p>
        <h1>Edwin Feng</h1>
        <p>
          Rain on the city, a lamp on the desk. The folders on the right are
          the whole site.
        </p>
        <p>
          Open <strong>Projects</strong> for models and tools I have shipped,{" "}
          <strong>Notes</strong> for writing, <strong>About Me</strong> for
          who is at this window, and <strong>Resume</strong> if you want the
          formal version.
        </p>
        <p className="hint">Drag a window from its title bar. Close it to come back here.</p>
      </WindowFrame>
      <aside className="sticky no-print">
        <p>rain’s on — click a folder.</p>
      </aside>
    </>
  );
}
