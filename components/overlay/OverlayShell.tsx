"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CrtFrame } from "./CrtFrame";
import { useArcadeStore } from "@/lib/store";
import { STATIONS, type StationId } from "@/lib/stations";

const MAX_WAIT_MS = 1100;

type OverlayShellProps = {
  station: StationId;
  title: string;
  eyebrow?: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  width?: "narrow" | "wide";
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
      style={
        {
          ["--accent" as string]: meta.accent,
          ["--accent-rgb" as string]: meta.accentRgb,
        } as React.CSSProperties
      }
    >
      <div
        aria-busy={!ready}
        className={ready ? "animate-fade-in" : "opacity-0"}
      >
        <CrtFrame>
          <div className="px-6 py-8 sm:px-10 sm:py-11">
            <header className="mb-8 border-b border-white/10 pb-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="label text-ink-dim">
                    {eyebrow ?? meta.label}
                  </p>
                  <h1 className="mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                    {title}
                  </h1>
                </div>
                {actions ? (
                  <div className="no-print flex shrink-0 gap-3">{actions}</div>
                ) : null}
              </div>
            </header>

            {intro ? (
              <div className="mb-10 text-[17px] leading-relaxed text-ink/85">
                {intro}
              </div>
            ) : null}

            {children}

            <footer className="no-print mt-14 border-t border-white/10 pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-ink"
              >
                Back to the room
                <span className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[10px]">
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
