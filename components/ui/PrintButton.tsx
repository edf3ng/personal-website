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
      className="arcade-label rounded border border-[rgb(var(--accent-rgb)/0.5)] px-3 py-2 text-[0.5rem] text-[var(--accent)] transition-colors hover:bg-[rgb(var(--accent-rgb)/0.12)]"
    >
      Print / Save PDF
    </button>
  );
}
