"use client";

import { useArcadeStore } from "@/lib/store";
import { site } from "@/lib/site";

/**
 * The room is the homepage. Copy stays out of the way so the cabinets
 * and the wall sign can do the introducing.
 */
export function HubOverlay() {
  const webglEnabled = useArcadeStore((s) => s.webglEnabled);
  const sceneReady = useArcadeStore((s) => s.sceneReady);

  return (
    <div className="pointer-events-none flex min-h-dvh flex-col justify-end px-5 pb-24 sm:px-8">
      <h1 className="sr-only">{site.name}</h1>

      <div className="mx-auto max-w-xl text-center">
        {!webglEnabled && (
          <p className="pointer-events-auto mb-6 rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm text-ink-dim">
            WebGL is off in this browser, so the room is showing as a flat
            backdrop. The pages still work from the menu above.
          </p>
        )}

        <p className="text-sm text-ink-dim">
          {webglEnabled && !sceneReady
            ? "Loading the room…"
            : "Click a cabinet, or pick a page above."}
        </p>
      </div>
    </div>
  );
}
