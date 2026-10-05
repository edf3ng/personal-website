"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import ArcadeScene from "./ArcadeScene";
import { useArcadeStore, useQualityPreset } from "@/lib/store";
import { CAMERA_FOV, poseFor } from "@/lib/stations";

export default function CanvasMount() {
  const quality = useQualityPreset();
  // Read once: the canvas mounts after RouteSync has settled the store, so the
  // camera is born at the right cabinet rather than snapping to it.
  const { activeStation, atHub } = useArcadeStore.getState();
  const start = poseFor(activeStation, atHub);

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={quality.dpr}
      shadows={quality.shadows}
      performance={{ min: 0.5 }}
      camera={{
        fov: CAMERA_FOV,
        near: 0.1,
        far: 60,
        position: start.position,
      }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        // Bloom does the edge softening that MSAA would have done.
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Suspense fallback={null}>
        <ArcadeScene />
      </Suspense>
    </Canvas>
  );
}
