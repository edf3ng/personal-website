"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CrtFrame } from "./CrtFrame";
import { useArcadeStore } from "@/lib/store";
import { STATIONS, type StationId } from "@/lib/stations";

/** Never leave content hidden longer than this, whatever the camera is doing. */
const MAX_WAIT_MS = 1100;

type OverlayShellProps = {
  station: StationId;
  title: string;
  eyebrow?: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  width?: "narrow" | "wide";
  /** Shown top-right inside the frame, e.g. a resume download button. */
  actions?: React.ReactNode;
};

export function OverlayShell({
  station,
  title,
  eyebrow,
  intro,
  children,
  width = "wide",
  actions,
}: OverlayShellProps) {
  const router = useRouter();
  const isTransitioning = useArcadeStore((s) => s.isTransitioning);
  const webglEnabled = useArcadeStore((s) => s.webglEnabled);
  const [timedOut, setTimedOut] = useState(false);

  const meta = STATIONS[station];
  const ready = timedOut || !webglEnabled || !isTransitioning;

  useEffect(() => {
    const id = window.setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div
      className={`mx-auto w-full px-4 pb-28 pt-24 sm:px-6 sm:pt-28 ${
        width === "narrow" ? "max-w-3xl" : "max-w-5xl"
      }`}
      style={{ ["--accent" as string]: meta.accent, ["--accent-rgb" as string]: meta.accentRgb }}
    >
      <div
        aria-busy={!ready}
        className={ready ? "animate-power-on origin-center" : "opacity-0"}
      >
        <CrtFrame>
          <div className="px-5 py-7 sm:px-9 sm:py-10">
            <header className="mb-8 border-b border-[rgb(var(--accent-rgb)/0.25)] pb-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="arcade-label text-[0.6rem] text-[var(--accent)] text-glow">
                    {eyebrow ?? meta.marquee}
                  </p>
                  <h1 className="mt-3 font-display text-xl leading-relaxed text-phosphor text-rgb-split sm:text-2xl">
                    {title}
                  </h1>
                  <p className="mt-3 text-sm text-phosphor-dim">
                    {meta.tagline}
                  </p>
                </div>
                {actions ? (
                  <div className="no-print flex shrink-0 gap-3">{actions}</div>
                ) : null}
              </div>
            </header>

            {intro ? (
              <div className="mb-10 text-base leading-relaxed text-phosphor/90">
                {intro}
              </div>
            ) : null}

            {children}

            <footer className="no-print mt-14 border-t border-white/10 pt-6">
              <Link
                href="/"
                className="arcade-label inline-flex items-center gap-2 text-[0.6rem] text-phosphor-dim transition-colors hover:text-[var(--accent)]"
              >
                <span aria-hidden="true">&lt;</span> Back to the arcade
                <span className="ml-2 rounded border border-white/15 px-1.5 py-0.5 text-[0.5rem] text-phosphor-dim">
                  Esc
                </span>
              </Link>
            </footer>
          </div>
        </CrtFrame>
      </div>
    </div>
  );
}
