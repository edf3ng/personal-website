"use client";

import Link from "next/link";

import { useArcadeStore } from "@/lib/store";
import { STATION_LIST } from "@/lib/stations";
import { site } from "@/lib/site";

/**
 * Attract mode. Deliberately sparse: the cabinets sit in the middle of the
 * frame, so the copy hugs the top and bottom edges and leaves them visible.
 */
export function HubOverlay() {
  const webglEnabled = useArcadeStore((s) => s.webglEnabled);
  const sceneReady = useArcadeStore((s) => s.sceneReady);
  const stations = STATION_LIST.filter((s) => s.path !== "/");

  return (
    <div className="pointer-events-none flex min-h-dvh flex-col justify-between px-4 pb-24 pt-24 text-center sm:px-6 sm:pt-28">
      <div className="animate-power-on">
        <p className="arcade-label animate-blink text-[0.6rem] text-neon-pink text-glow">
          Insert coin
        </p>
        <h1 className="mt-4 font-display text-[1.15rem] leading-[1.7] text-phosphor text-rgb-split sm:text-2xl sm:leading-[1.6]">
          {site.name}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-phosphor-dim">
          {site.tagline}
        </p>
      </div>

      <div className="animate-power-on">
        {!webglEnabled && (
          <p className="pointer-events-auto mx-auto mb-8 max-w-sm rounded-lg border border-white/10 bg-[rgb(4_4_10/0.8)] px-4 py-3 text-xs text-phosphor-dim">
            Your browser has WebGL turned off, so the arcade is showing in flat
            mode. Everything still works.
          </p>
        )}

        <p className="arcade-label mb-3 text-[0.55rem] text-phosphor-dim">
          {webglEnabled && !sceneReady
            ? "Powering up cabinets\u2026"
            : "Select a cabinet"}
        </p>

        <ul className="pointer-events-auto mx-auto flex max-w-3xl flex-wrap items-stretch justify-center gap-2">
          {stations.map((station) => (
            <li key={station.id}>
              <Link
                href={station.path}
                onPointerEnter={() =>
                  useArcadeStore.getState().setHovered(station.id)
                }
                onPointerLeave={() => useArcadeStore.getState().setHovered(null)}
                onFocus={() => useArcadeStore.getState().setHovered(station.id)}
                onBlur={() => useArcadeStore.getState().setHovered(null)}
                className="group block h-full w-36 rounded-lg border bg-[rgb(4_4_10/0.62)] px-3 py-2.5 text-left backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5 sm:w-40"
                style={{
                  borderColor: `${station.accent}44`,
                  boxShadow: `0 0 24px -14px ${station.accent}`,
                }}
              >
                <span
                  className="arcade-label block text-[0.5rem]"
                  style={{
                    color: station.accent,
                    textShadow: `0 0 10px ${station.accent}`,
                  }}
                >
                  {station.label}
                </span>
                <span className="mt-1.5 block text-[0.7rem] leading-relaxed text-phosphor-dim">
                  {station.tagline}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="arcade-label mt-7 text-[0.5rem] text-phosphor-dim/70">
          <span aria-hidden="true">&#8592; &#8594;</span> keys walk the row
          {webglEnabled ? " \u00B7 click a cabinet to enter" : ""}
        </p>
      </div>
    </div>
  );
}
