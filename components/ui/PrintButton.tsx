"use client";

export function PrintButton() {
  return (
    <button type="button" className="os-text-btn" onClick={() => window.print()}>
      Print
    </button>
  );
}
