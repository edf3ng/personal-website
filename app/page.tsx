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
        <p className="os-kicker">Late night - Austin</p>
        <h1>Edwin Feng</h1>
        <p>
          Freshman at UT Austin studying Computer Science and Business.
        </p>
        <p className="hint">Drag a window from its title bar. Close it to come back here.</p>
      </WindowFrame>
      <aside className="sticky no-print">
        <p>hey - click a folder!</p>
      </aside>
    </>
  );
}
