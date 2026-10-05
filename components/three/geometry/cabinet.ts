import * as THREE from "three";

/**
 * Side profile of a classic upright, in (depth, height). Extruding this is both
 * cheaper and far more tweakable than shipping a GLB.
 */
const PROFILE: [number, number][] = [
  [0, 0],
  [0.8, 0],
  [0.8, 0.2], // kick plate
  [0.72, 0.28],
  [0.72, 0.78],
  [0.88, 0.86], // control panel overhang
  [0.56, 1.02],
  [0.56, 1.1],
  [0.46, 1.18],
  [0.44, 1.66], // CRT face, leaning back slightly
  [0.58, 1.74],
  [0.58, 1.98], // marquee lightbox
  [0.48, 2.06],
  [0, 2.06],
];

const DEPTH = 0.88;

/**
 * Key dimensions, shared by the mesh builder and by anything that parks
 * something on the cabinet's surface.
 *
 * All `z` values are profile depths measured from the back panel. `Cabinet`
 * renders its contents inside a group offset by `-depthCenter`, so the
 * station's position in the room lines up with the cabinet's footprint centre
 * while these numbers stay readable.
 */
export const CAB = {
  width: 0.78,
  height: 2.06,
  depth: DEPTH,
  depthCenter: DEPTH / 2,
  screen: { y: 1.42, z: 0.475, w: 0.62, h: 0.44 },
  marquee: { y: 1.86, z: 0.592, w: 0.66, h: 0.19 },
  panel: { y: 0.94, z: 0.72, length: 0.36, tiltX: 0.4636 },
  coinDoor: { y: 0.5, z: 0.732 },
  trim: {
    screen: { bottom: 1.18, top: 1.66, z: 0.452 },
    base: { bottom: 0.3, top: 0.76, z: 0.728 },
  },
  label: { y: 2.46 },
} as const;

export type CabinetGeometry = {
  body: THREE.ExtrudeGeometry;
  screen: THREE.PlaneGeometry;
  marquee: THREE.PlaneGeometry;
  panel: THREE.PlaneGeometry;
  button: THREE.CylinderGeometry;
  stick: THREE.CylinderGeometry;
  ball: THREE.SphereGeometry;
  unitBox: THREE.BoxGeometry;
  coinDoor: THREE.BoxGeometry;
  glow: THREE.PlaneGeometry;
};

let cached: CabinetGeometry | null = null;

/**
 * Built once and shared by all five cabinets. They differ only in material
 * uniforms and textures, so there is no reason to duplicate the buffers.
 */
export function getCabinetGeometry(): CabinetGeometry {
  if (cached) return cached;

  const shape = new THREE.Shape();
  shape.moveTo(PROFILE[0][0], PROFILE[0][1]);
  for (let i = 1; i < PROFILE.length; i++) {
    shape.lineTo(PROFILE[i][0], PROFILE[i][1]);
  }
  shape.closePath();

  const body = new THREE.ExtrudeGeometry(shape, {
    depth: CAB.width,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
  });

  // Extrusion runs along +Z in shape space. Rotating by -90deg about Y puts
  // profile depth on +Z and the extruded width on X.
  body.rotateY(-Math.PI / 2);
  body.translate(CAB.width / 2, 0, 0);
  body.computeVertexNormals();

  cached = {
    body,
    screen: new THREE.PlaneGeometry(CAB.screen.w, CAB.screen.h),
    marquee: new THREE.PlaneGeometry(CAB.marquee.w, CAB.marquee.h),
    panel: new THREE.PlaneGeometry(0.6, CAB.panel.length),
    button: new THREE.CylinderGeometry(0.026, 0.026, 0.018, 14),
    stick: new THREE.CylinderGeometry(0.011, 0.015, 0.085, 8),
    ball: new THREE.SphereGeometry(0.028, 14, 10),
    unitBox: new THREE.BoxGeometry(1, 1, 1),
    coinDoor: new THREE.BoxGeometry(0.3, 0.18, 0.02),
    glow: new THREE.PlaneGeometry(1.5, 1.5),
  };

  return cached;
}
