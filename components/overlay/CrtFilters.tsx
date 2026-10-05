/**
 * SVG filters used by the CRT chrome. Applied only to decorative glass layers,
 * never to live text, so the content stays crisp and selectable.
 */
export function CrtFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-0 w-0"
    >
      <defs>
        <filter id="crt-warp" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0004 0.0019"
            numOctaves="1"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="crt-bleed" x="-6%" y="-6%" width="112%" height="112%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 2 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
