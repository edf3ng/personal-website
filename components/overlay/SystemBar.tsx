"use client";

import { useEffect } from "react";

import { playSelect, unlockAudio } from "@/lib/audio";
import { useArcadeStore } from "@/lib/store";
import { TIER_ORDER, type QualityTier } from "@/lib/quality";

const AUDIO_KEY = "arcade:audio";
const QUALITY_KEY = "arcade:quality";

const TIER_LABEL: Record<QualityTier, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
};

export function SystemBar() {
  const audioEnabled = useArcadeStore((s) => s.audioEnabled);
  const quality = useArcadeStore((s) => s.quality);
  const qualityLocked = useArcadeStore((s) => s.qualityLocked);
  const webglEnabled = useArcadeStore((s) => s.webglEnabled);

  useEffect(() => {
    const store = useArcadeStore.getState();

    if (localStorage.getItem(AUDIO_KEY) === "on") store.toggleAudio();

    const savedTier = localStorage.getItem(QUALITY_KEY);
    if (savedTier && TIER_ORDER.includes(savedTier as QualityTier)) {
      store.setQuality(savedTier as QualityTier, true);
    }
  }, []);

  const onToggleAudio = () => {
    const next = !useArcadeStore.getState().audioEnabled;
    useArcadeStore.getState().toggleAudio();
    localStorage.setItem(AUDIO_KEY, next ? "on" : "off");
    if (next) {
      unlockAudio();
      playSelect();
    }
  };

  const onCycleQuality = () => {
    const current = useArcadeStore.getState().quality;
    const next =
      TIER_ORDER[(TIER_ORDER.indexOf(current) + 1) % TIER_ORDER.length];
    useArcadeStore.getState().setQuality(next, true);
    localStorage.setItem(QUALITY_KEY, next);
    if (useArcadeStore.getState().audioEnabled) playSelect();
  };

  return (
    <div className="no-print fixed bottom-5 right-5 z-40 flex items-center gap-4 text-[12px] text-ink-dim">
      <button
        type="button"
        onClick={onToggleAudio}
        aria-pressed={audioEnabled}
        className="transition-colors hover:text-ink"
      >
        Sound {audioEnabled ? "on" : "off"}
      </button>

      {webglEnabled && (
        <button
          type="button"
          onClick={onCycleQuality}
          title={
            qualityLocked
              ? "Graphics quality (locked to your choice)"
              : "Graphics quality (auto-detected)"
          }
          className="transition-colors hover:text-ink"
        >
          Graphics {TIER_LABEL[quality]}
          {qualityLocked ? "" : ""}
        </button>
      )}
    </div>
  );
}
