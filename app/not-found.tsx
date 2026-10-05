import Link from "next/link";

import { WindowFrame } from "@/components/desktop/WindowFrame";

export default function NotFound() {
  return (
    <WindowFrame title="File not found" icon="/desktop/icons/trash.svg" width={420}>
      <h1>Nothing here</h1>
      <p>That address is not on this disk.</p>
      <p>
        <Link href="/">Back to the desktop</Link>
      </p>
    </WindowFrame>
  );
}
