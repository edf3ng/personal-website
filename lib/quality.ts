export type QualityTier = "high" | "medium" | "low";

export type QualityPreset = {
  dpr: [number, number];
  shadows: boolean;
  /** Render shadows once, then freeze the map. Cheap stand-in for realtime. */
  bakeShadows: boolean;
  reflectiveFloor: boolean;
  /** Cabinet CRTs run a live render target instead of a static texture. */
  liveScreens: boolean;
  screenResolution: number;
  particles: number;
  lightCones: boolean;
  effects: {
    bloom: boolean;
    chromaticAberration: boolean;
    scanlines: boolean;
    vignette: boolean;
    noise: boolean;
  };
};

export const QUALITY_PRESETS: Record<QualityTier, QualityPreset> = {
  high: {
    dpr: [1, 2],
    shadows: true,
    bakeShadows: false,
    reflectiveFloor: true,
    liveScreens: true,
    screenResolution: 512,
    particles: 420,
    lightCones: true,
    effects: {
      bloom: true,
      chromaticAberration: true,
      scanlines: true,
      vignette: true,
      noise: true,
    },
  },
  medium: {
    dpr: [1, 1.5],
    shadows: true,
    bakeShadows: true,
    reflectiveFloor: false,
    liveScreens: true,
    screenResolution: 256,
    particles: 180,
    lightCones: true,
    effects: {
      bloom: true,
      chromaticAberration: false,
      scanlines: false,
      vignette: true,
      noise: false,
    },
  },
  low: {
    dpr: [1, 1],
    shadows: false,
    bakeShadows: false,
    reflectiveFloor: false,
    liveScreens: false,
    screenResolution: 128,
    particles: 60,
    lightCones: false,
    effects: {
      bloom: false,
      chromaticAberration: false,
      scanlines: false,
      vignette: false,
      noise: false,
    },
  },
};

export const TIER_ORDER: QualityTier[] = ["low", "medium", "high"];

export function demoteTier(tier: QualityTier): QualityTier {
  const i = TIER_ORDER.indexOf(tier);
  return TIER_ORDER[Math.max(0, i - 1)];
}

/** Rough GPU blacklist. These renderers consistently choke on post-processing. */
const WEAK_GPU = /swiftshader|llvmpipe|software|mesa offscreen|microsoft basic/i;
const MOBILE_GPU = /adreno|mali|powervr|apple a\d/i;

function readRendererString(): string {
  if (typeof document === "undefined") return "";
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "";

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext
      ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string)
      : (gl.getParameter(gl.RENDERER) as string);

    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return renderer ?? "";
  } catch {
    return "";
  }
}

export function supportsWebGL(): boolean {
  if (typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    (gl as WebGLRenderingContext)
      .getExtension("WEBGL_lose_context")
      ?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Best guess at what this device can handle, made once before the canvas
 * mounts. R3F's performance monitor demotes further at runtime if we guessed
 * too generously.
 */
export function detectTier(): QualityTier {
  if (typeof window === "undefined") return "medium";

  const renderer = readRendererString();
  if (WEAK_GPU.test(renderer)) return "low";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;

  let score = 0;
  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;

  if (memory >= 8) score += 2;
  else if (memory >= 4) score += 1;

  if (!coarsePointer) score += 1;
  if (!narrow) score += 1;
  if (MOBILE_GPU.test(renderer)) score -= 2;

  if (score >= 5) return "high";
  if (score >= 3) return "medium";
  return "low";
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
