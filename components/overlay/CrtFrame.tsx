"use client";

import { useArcadeStore } from "@/lib/store";

type CrtFrameProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * The glass. Everything decorative lives in sibling layers above the content
 * so the text underneath stays selectable, searchable, and unfiltered.
 */
export function CrtFrame({ children, className = "" }: CrtFrameProps) {
  const reducedMotion = useArcadeStore((s) => s.reducedMotion);

  return (
    <div
      className={`relative rounded-[22px] border border-white/5 bg-[#07070f]/90 p-2 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.95)] backdrop-blur-sm sm:p-3 ${className}`}
    >
      {/* Bezel */}
      <div className="pointer-events-none absolute inset-0 rounded-[22px] box-glow" />

      <div className="relative overflow-hidden rounded-[14px] bg-[rgb(4_4_10/0.88)]">
        <div className="relative z-10">{children}</div>

        {/* Scanlines */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-20 mix-blend-overlay ${
            reducedMotion ? "" : "animate-scanroll"
          }`}
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgb(0 0 0 / var(--scanline-opacity)) 0px, rgb(0 0 0 / var(--scanline-opacity)) 1px, transparent 1px, transparent var(--scanline-size))",
          }}
        />

        {/* Shadow mask + phosphor tint */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-[0.12] mix-blend-color-dodge"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgb(255 0 90 / 0.5) 0px, rgb(0 255 170 / 0.5) 1px, rgb(0 140 255 / 0.5) 2px, transparent 3px)",
          }}
        />

        {/* Curved glass: glare, edge falloff, and a slow signal wobble. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            filter: reducedMotion ? undefined : "url(#crt-warp)",
            background:
              "radial-gradient(120% 90% at 50% -10%, rgb(255 255 255 / 0.07), transparent 55%), radial-gradient(130% 110% at 50% 50%, transparent 55%, rgb(0 0 0 / 0.55) 100%)",
          }}
        />

        {/* Tube edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 rounded-[14px]"
          style={{
            boxShadow:
              "inset 0 0 60px -20px rgb(var(--accent-rgb) / 0.4), inset 0 0 0 1px rgb(var(--accent-rgb) / 0.22)",
          }}
        />
      </div>
    </div>
  );
}
