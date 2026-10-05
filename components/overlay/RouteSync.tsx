"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { useArcadeStore } from "@/lib/store";
import { STATIONS, isHub, resolveStation } from "@/lib/stations";

/**
 * Single writer for route-derived scene state. It is mounted above the routed
 * children in the layout so its effect lands before any page's effects, which
 * is what lets `OverlayShell` trust `isTransitioning` on the very first frame
 * after a navigation.
 */
export function RouteSync() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    const station = resolveStation(pathname);
    const atHub = isHub(pathname);

    useArcadeStore.getState().setRoute(station, atHub, first.current);
    first.current = false;

    const accent = STATIONS[station];
    const root = document.documentElement;
    root.style.setProperty("--accent", accent.accent);
    root.style.setProperty("--accent-rgb", accent.accentRgb);
  }, [pathname]);

  return null;
}
