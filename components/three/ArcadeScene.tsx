"use client";

import { useEffect } from "react";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";

import { ArcadeRoom } from "./ArcadeRoom";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { useArcadeStore, useQualityPreset } from "@/lib/store";

function ReadySignal() {
  useEffect(() => {
    useArcadeStore.getState().setSceneReady(true);
    return () => useArcadeStore.getState().setSceneReady(false);
  }, []);
  return null;
}

export default function ArcadeScene() {
  const quality = useQualityPreset();

  return (
    <>
      <color attach="background" args={["#04040a"]} />
      <fog attach="fog" args={["#0a0a12", 22, 48]} />

      <CameraRig />
      <ArcadeRoom />
      <Effects />

      {/* Drop a tier if the frame budget is blown for long enough. */}
      <PerformanceMonitor
        onDecline={() => useArcadeStore.getState().regressQuality()}
      />
      <AdaptiveDpr />
      <AdaptiveEvents />
      {quality.bakeShadows && <BakeShadows />}
      <Preload all />
      <ReadySignal />
    </>
  );
}
