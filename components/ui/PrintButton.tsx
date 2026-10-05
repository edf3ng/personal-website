"use client";

/**
 * The print stylesheet strips the arcade chrome, so "Save as PDF" from the
 * browser dialog produces the document version. No separate PDF to keep in
 * sync with `content/resume.ts`.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md border border-white/15 px-3 py-2 text-sm text-ink transition-colors hover:bg-white/5"
    >
      Print / Save PDF
    </button>
  );
}
