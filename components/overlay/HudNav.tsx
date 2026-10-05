"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useArcadeStore } from "@/lib/store";
import {
  STATION_LIST,
  neighbourStation,
  resolveStation,
} from "@/lib/stations";
import { site } from "@/lib/site";

/**
 * The accessibility backbone. The canvas is `aria-hidden`, so every cabinet
 * needs a real link here, and arrow keys mirror walking the row.
 */
export function HudNav() {
  const pathname = usePathname();
  const router = useRouter();
  const active = resolveStation(pathname);
  const hovered = useArcadeStore((s) => s.hoveredStation);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;

      // Up/Down stay with the document so long pages still scroll.
      const direction =
        event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
      if (!direction) return;

      event.preventDefault();
      router.push(neighbourStation(active, direction as -1 | 1).path);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, router]);

  return (
    <header className="no-print fixed inset-x-0 top-0 z-40">
      <nav
        aria-label="Arcade sections"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6"
      >
        <Link
          href="/"
          className="arcade-label shrink-0 text-[0.6rem] text-phosphor text-glow transition-opacity hover:opacity-80 sm:text-[0.7rem]"
        >
          {site.name}
        </Link>

        <ul className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-[rgb(4_4_10/0.72)] px-2 py-1.5 backdrop-blur-md sm:gap-2 sm:px-3">
          {STATION_LIST.map((station) => {
            const isActive = station.id === active;
            const isHovered = station.id === hovered;
            return (
              <li key={station.id} className="shrink-0">
                <Link
                  href={station.path}
                  aria-current={isActive ? "page" : undefined}
                  onPointerEnter={() =>
                    useArcadeStore.getState().setHovered(station.id)
                  }
                  onPointerLeave={() =>
                    useArcadeStore.getState().setHovered(null)
                  }
                  onFocus={() => useArcadeStore.getState().setHovered(station.id)}
                  onBlur={() => useArcadeStore.getState().setHovered(null)}
                  className="arcade-label flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.55rem] transition-colors sm:px-3 sm:text-[0.6rem]"
                  style={{
                    color:
                      isActive || isHovered
                        ? station.accent
                        : "var(--color-phosphor-dim)",
                    textShadow:
                      isActive || isHovered
                        ? `0 0 10px ${station.accent}`
                        : undefined,
                    background: isActive
                      ? `linear-gradient(${station.accent}14, ${station.accent}00)`
                      : undefined,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className={isActive ? "animate-blink" : "opacity-0"}
                  >
                    &gt;
                  </span>
                  {station.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="arcade-label hidden shrink-0 text-[0.5rem] text-phosphor-dim lg:block">
          <span aria-hidden="true">&#8592; &#8594;</span> to move
        </p>
      </nav>
    </header>
  );
}
