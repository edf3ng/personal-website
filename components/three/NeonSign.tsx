"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import {
  cssFontFamily,
  drawTracked,
  useCanvasTexture,
} from "./useCanvasTexture";

type NeonSignProps = {
  text: string;
  color: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  /** Font size in canvas pixels; the canvas is 1024 wide. */
  fontSize?: number;
  tracking?: number;
  /** Seconds between flicker stutters. 0 disables. */
  flicker?: number;
  light?: boolean;
};

export function NeonSign({
  text,
  color,
  position,
  rotation = [0, 0, 0],
  width,
  fontSize = 110,
  tracking = 14,
  flicker = 0,
  light = true,
}: NeonSignProps) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const pointLight = useRef<THREE.PointLight>(null);

  const texture = useCanvasTexture(
    1024,
    256,
    (ctx, w, h) => {
      ctx.font = `${fontSize}px ${cssFontFamily("--font-pixel", '"Courier New", monospace')}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Three passes: wide halo, tight halo, hot core.
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.shadowBlur = 56;
      drawTracked(ctx, text, w / 2, h / 2, tracking);
      ctx.shadowBlur = 24;
      drawTracked(ctx, text, w / 2, h / 2, tracking);
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffffff";
      drawTracked(ctx, text, w / 2, h / 2, tracking);
      ctx.shadowBlur = 0;
    },
    [text, color, fontSize, tracking],
  );

  useFrame((state) => {
    if (!flicker) return;
    const t = state.clock.elapsedTime;
    const phase = (t % flicker) / flicker;
    // Steady most of the cycle, with a short stutter at the end.
    const dim =
      phase > 0.94 ? 0.35 + 0.65 * Math.abs(Math.sin(t * 47)) : 1;

    if (material.current) material.current.opacity = dim;
    if (pointLight.current) pointLight.current.intensity = 2.4 * dim;
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh raycast={() => null}>
        <planeGeometry args={[width, (width * 256) / 1024]} />
        <meshBasicMaterial
          ref={material}
          map={texture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {light && (
        <pointLight
          ref={pointLight}
          position={[0, 0, 0.9]}
          color={color}
          distance={9}
          decay={2}
          intensity={2.4}
        />
      )}
    </group>
  );
}
