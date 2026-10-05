export type Vec3 = [number, number, number];

export type StationId = "about" | "projects" | "home" | "notes" | "resume";

export type CameraPose = {
  position: Vec3;
  target: Vec3;
};

export type Station = {
  id: StationId;
  path: string;
  /** Short name on the HUD and the floating hover label. */
  label: string;
  /** Text printed across the cabinet's lightbox marquee. */
  marquee: string;
  /** Attract-mode line shown under the marquee in the hub view. */
  tagline: string;
  accent: string;
  /** Used for `rgb(var(--accent-rgb) / <alpha>)` in CSS. */
  accentRgb: string;
  /** Spatial index, left to right. Drives arrow-key navigation. */
  order: number;
  cabinet: { position: Vec3; rotation: Vec3 };
  camera: CameraPose;
};

/* ------------------------------------------------------------------ */
/* Arc layout                                                          */
/*                                                                     */
/* Cabinets sit on an arc centred on the spot where the visitor        */
/* "stands", each rotated to face that spot. Deriving the transforms   */
/* instead of hardcoding them means adding a sixth station is one      */
/* entry in STATION_ORDER plus a route file -- the room re-arranges    */
/* itself.                                                             */
/* ------------------------------------------------------------------ */

const ARC = {
  center: [0, 0, 1] as Vec3,
  radius: 4.6,
  /** Total angular spread across all cabinets, in degrees. */
  spread: 92,
  /** Height of the centre of a cabinet's CRT. Matches CAB.screen.y. */
  screenHeight: 1.42,
  /** How far the camera parks in front of the cabinet's footprint centre. */
  viewDistance: 2.15,
  eyeHeight: 1.52,
};

const DEG = Math.PI / 180;

function layout(index: number, count: number) {
  const t = count === 1 ? 0.5 : index / (count - 1);
  const theta = (t - 0.5) * ARC.spread * DEG;

  const [cx, , cz] = ARC.center;
  const position: Vec3 = [
    cx + ARC.radius * Math.sin(theta),
    0,
    cz - ARC.radius * Math.cos(theta),
  ];

  // A cabinet's front faces +Z in model space, so rotating by -theta aims it
  // back at the arc centre.
  const rotation: Vec3 = [0, -theta, 0];

  // Unit vector pointing out of the cabinet's screen.
  const facing: Vec3 = [-Math.sin(theta), 0, Math.cos(theta)];

  const camera: CameraPose = {
    position: [
      position[0] + facing[0] * ARC.viewDistance,
      ARC.eyeHeight,
      position[2] + facing[2] * ARC.viewDistance,
    ],
    target: [position[0], ARC.screenHeight, position[2]],
  };

  return { cabinet: { position, rotation }, camera };
}

type StationSeed = Omit<Station, "order" | "cabinet" | "camera">;

/** Left-to-right spatial order. Home is centre stage. */
const SEEDS: StationSeed[] = [
  {
    id: "about",
    path: "/about",
    label: "About",
    marquee: "PLAYER ONE",
    tagline: "Who's behind the joystick",
    accent: "#ffd400",
    accentRgb: "255 212 0",
  },
  {
    id: "projects",
    path: "/projects",
    label: "Projects",
    marquee: "PROJECTS",
    tagline: "Things I built and shipped",
    accent: "#00e5ff",
    accentRgb: "0 229 255",
  },
  {
    id: "home",
    path: "/",
    label: "Home",
    marquee: "INSERT COIN",
    tagline: "Press start",
    accent: "#ff2d95",
    accentRgb: "255 45 149",
  },
  {
    id: "notes",
    path: "/notes",
    label: "Notes",
    marquee: "NOTES",
    tagline: "Writing, half-finished thoughts, logs",
    accent: "#b06bff",
    accentRgb: "176 107 255",
  },
  {
    id: "resume",
    path: "/resume",
    label: "Resume",
    marquee: "HIGH SCORES",
    tagline: "The formal record",
    accent: "#39ff14",
    accentRgb: "57 255 20",
  },
];

export const STATION_ORDER: StationId[] = SEEDS.map((s) => s.id);

export const STATIONS: Record<StationId, Station> = Object.fromEntries(
  SEEDS.map((seed, i) => [
    seed.id,
    { ...seed, order: i, ...layout(i, SEEDS.length) },
  ]),
) as Record<StationId, Station>;

export const STATION_LIST: Station[] = STATION_ORDER.map((id) => STATIONS[id]);

/** Pulled-back pose that frames the whole arc. */
export const HUB_CAMERA: CameraPose = {
  position: [0, 1.95, 3.55],
  target: [0, 1.2, -2.4],
};

export const CAMERA_FOV = 46;

/**
 * Maps any pathname onto a station, so `/notes/some-slug` keeps the camera
 * parked at the notes cabinet.
 */
export function resolveStation(pathname: string): StationId {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/") return "home";

  const match = STATION_LIST.filter((s) => s.path !== "/").find(
    (s) => clean === s.path || clean.startsWith(`${s.path}/`),
  );

  return match?.id ?? "home";
}

/** Whether the camera should sit at the hub pose rather than at a cabinet. */
export function isHub(pathname: string): boolean {
  return (pathname.replace(/\/+$/, "") || "/") === "/";
}

export function poseFor(station: StationId, atHub: boolean): CameraPose {
  return atHub ? HUB_CAMERA : STATIONS[station].camera;
}

export function neighbourStation(
  current: StationId,
  direction: -1 | 1,
): Station {
  const next = STATIONS[current].order + direction;
  const clamped = Math.max(0, Math.min(STATION_ORDER.length - 1, next));
  return STATION_LIST[clamped];
}
