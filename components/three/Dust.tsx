"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";

const DustMaterial = shaderMaterial(
  { uTime: 0, uSize: 1.8, uColor: new THREE.Color("#9ad7ff"), uHeight: 4.2 },
  /* glsl */ `
    uniform float uTime;
    uniform float uSize;
    uniform float uHeight;
    attribute float aSeed;
    varying float vAlpha;

    void main() {
      vec3 p = position;
      // Motes rise slowly and wrap, with a lazy horizontal drift.
      p.y = mod(p.y + uTime * (0.03 + aSeed * 0.05), uHeight);
      p.x += sin(uTime * 0.27 + aSeed * 21.0) * 0.3;
      p.z += cos(uTime * 0.21 + aSeed * 13.0) * 0.3;

      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uSize * (0.5 + aSeed) * (14.0 / max(-mv.z, 0.1));
      vAlpha = 0.18 + 0.45 * aSeed;
    }
  `,
  /* glsl */ `
    uniform vec3 uColor;
    varying float vAlpha;

    void main() {
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.05, d) * vAlpha;
      if (a < 0.01) discard;
      gl_FragColor = vec4(uColor, a);
    }
  `,
);

extend({ DustMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    dustMaterial: ThreeElement<typeof DustMaterial>;
  }
}

type DustProps = {
  count: number;
  /** Half-extent of the box the motes occupy. */
  spread?: number;
  height?: number;
};

export function Dust({ count, spread = 9, height = 4.2 }: DustProps) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread * 2;
      positions[i * 3 + 1] = Math.random() * height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 2;
      seeds[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(0, height / 2, 0),
      spread * 2,
    );
    return geo;
  }, [count, spread, height]);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false} raycast={() => null}>
      <dustMaterial
        key={DustMaterial.key}
        ref={material}
        uHeight={height}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
