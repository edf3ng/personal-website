"use client";

import { create } from "zustand";
import type { StationId } from "./stations";
import {
  QUALITY_PRESETS,
  demoteTier,
  type QualityPreset,
  type QualityTier,
} from "./quality";

type ArcadeState = {
  /** Which cabinet the camera is aimed at. */
  activeStation: StationId;
  /** True when parked at the pulled-back hub pose rather than at a cabinet. */
  atHub: boolean;
  /** True while the camera is still flying. Gates the overlay fade-in. */
  isTransitioning: boolean;
  hoveredStation: StationId | null;

  quality: QualityTier;
  /** Set when the visitor picks a tier by hand; blocks runtime demotion. */
  qualityLocked: boolean;
  webglEnabled: boolean;
  reducedMotion: boolean;
  /** Flips once the scene's suspended assets have resolved. */
  sceneReady: boolean;

  audioEnabled: boolean;

  /**
   * `immediate` skips the camera flight, which is what you want on a cold
   * load: the visitor should land at the cabinet, not fly in from the hub.
   */
  setRoute: (station: StationId, atHub: boolean, immediate?: boolean) => void;
  setTransitioning: (value: boolean) => void;
  setHovered: (station: StationId | null) => void;
  setQuality: (tier: QualityTier, locked?: boolean) => void;
  regressQuality: () => void;
  setWebglEnabled: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  setSceneReady: (value: boolean) => void;
  toggleAudio: () => void;
};

export const useArcadeStore = create<ArcadeState>((set, get) => ({
  activeStation: "home",
  atHub: true,
  isTransitioning: false,
  hoveredStation: null,

  quality: "medium",
  qualityLocked: false,
  webglEnabled: true,
  reducedMotion: false,
  sceneReady: false,

  audioEnabled: false,

  setRoute: (station, atHub, immediate = false) => {
    const prev = get();
    const sameRoute = prev.activeStation === station && prev.atHub === atHub;
    if (sameRoute && (immediate ? !prev.isTransitioning : true)) return;
    set({
      activeStation: station,
      atHub,
      isTransitioning: immediate ? false : !sameRoute,
    });
  },

  setTransitioning: (value) => {
    if (get().isTransitioning === value) return;
    set({ isTransitioning: value });
  },

  setHovered: (station) => {
    if (get().hoveredStation === station) return;
    set({ hoveredStation: station });
  },

  setQuality: (tier, locked = false) =>
    set({ quality: tier, qualityLocked: locked }),

  regressQuality: () => {
    const { quality, qualityLocked } = get();
    if (qualityLocked) return;
    const next = demoteTier(quality);
    if (next !== quality) set({ quality: next });
  },

  setWebglEnabled: (value) => set({ webglEnabled: value }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setSceneReady: (value) => set({ sceneReady: value }),
  toggleAudio: () => set({ audioEnabled: !get().audioEnabled }),
}));

export function useQualityPreset(): QualityPreset {
  return QUALITY_PRESETS[useArcadeStore((s) => s.quality)];
}
