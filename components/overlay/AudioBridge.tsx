"use client";

import { useEffect } from "react";

import { playBlip, playCoin } from "@/lib/audio";
import { useArcadeStore } from "@/lib/store";

/** Turns store transitions into cabinet noises, but only when sound is on. */
export function AudioBridge() {
  useEffect(() => {
    const unsubRoute = useArcadeStore.subscribe((state, prev) => {
      if (!state.audioEnabled) return;
      if (
        state.activeStation !== prev.activeStation ||
        state.atHub !== prev.atHub
      ) {
        playCoin();
      } else if (
        state.hoveredStation &&
        state.hoveredStation !== prev.hoveredStation
      ) {
        playBlip();
      }
    });

    return unsubRoute;
  }, []);

  return null;
}
