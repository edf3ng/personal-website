"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useArcadeStore } from "@/lib/store";
import { detectTier, supportsWebGL } from "@/lib/quality";

// Keeps three.js, drei, and postprocessing out of the server bundle and off
// the critical path for the text content.
const CanvasMount = dynamic(() => import("./CanvasMount"), { ssr: false });

/**
 * Always-on backdrop. The canvas paints over it once WebGL is up, and it is
 * the entire background when WebGL is unavailable.
 */
function Backdrop() {
  return (
    <div className="absolute inset-0 bg-void">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 12%, rgb(255 45 149 / 0.22), transparent 70%), radial-gradient(70% 60% at 12% 85%, rgb(0 229 255 / 0.16), transparent 70%), radial-gradient(70% 60% at 88% 85%, rgb(176 107 255 / 0.16), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(216 255 240 / 0.6) 1px, transparent 1px), linear-gradient(90deg, rgb(216 255 240 / 0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(70% 60% at 50% 70%, #000 20%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 70%, #000 20%, transparent 85%)",
        }}
      />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-void/60">
      <p className="text-sm text-ink-dim">Loading the room…</p>
    </div>
  );
}

export function ArcadeCanvas() {
  const [probed, setProbed] = useState(false);
  const webglEnabled = useArcadeStore((s) => s.webglEnabled);
  const sceneReady = useArcadeStore((s) => s.sceneReady);

  useEffect(() => {
    const store = useArcadeStore.getState();
    store.setWebglEnabled(supportsWebGL());
    store.setQuality(detectTier());

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () =>
      useArcadeStore.getState().setReducedMotion(motion.matches);
    sync();
    motion.addEventListener("change", sync);

    setProbed(true);
    return () => motion.removeEventListener("change", sync);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <Backdrop />
      {probed && webglEnabled && <CanvasMount />}
      {probed && webglEnabled && !sceneReady && <LoadingScreen />}
    </div>
  );
}
