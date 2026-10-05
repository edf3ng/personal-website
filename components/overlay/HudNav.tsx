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
        aria-label="Site"
        className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-5 py-5 sm:px-8"
      >
        <Link
          href="/"
          className="text-[15px] font-medium tracking-tight text-ink transition-opacity hover:opacity-70"
        >
          {site.name}
        </Link>

        <ul className="flex min-w-0 items-center gap-5 overflow-x-auto sm:gap-7">
          {STATION_LIST.filter((station) => station.id !== "home").map(
            (station) => {
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
                    onFocus={() =>
                      useArcadeStore.getState().setHovered(station.id)
                    }
                    onBlur={() => useArcadeStore.getState().setHovered(null)}
                    className={`text-[13px] transition-colors ${
                      isActive || isHovered
                        ? "text-ink"
                        : "text-ink-dim hover:text-ink"
                    }`}
                  >
                    {station.label}
                  </Link>
                </li>
              );
            },
          )}
        </ul>
      </nav>
    </header>
  );
}
