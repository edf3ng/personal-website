"use client";

import { useMemo } from "react";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Scanline,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import { useQualityPreset } from "@/lib/store";

export function Effects() {
  const quality = useQualityPreset();
  const fx = quality.effects;
  const aberrationOffset = useMemo(
    () => new THREE.Vector2(0.0008, 0.0005),
    [],
  );

  if (!Object.values(fx).some(Boolean)) return null;

  return (
    <EffectComposer
      multisampling={0}
      enableNormalPass={false}
      // The bloom pass needs headroom above 1.0 for the neon to actually bloom.
      frameBufferType={THREE.HalfFloatType}
    >
      {fx.bloom && (
        <Bloom
          mipmapBlur
          intensity={0.55}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.24}
          radius={0.72}
        />
      )}
      {fx.chromaticAberration && (
        <ChromaticAberration
          offset={aberrationOffset}
          radialModulation
          modulationOffset={0.35}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
      {fx.scanlines && (
        <Scanline blendFunction={BlendFunction.OVERLAY} density={1.1} />
      )}
      {fx.noise && (
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
      )}
      {fx.vignette && <Vignette offset={0.26} darkness={0.78} eskil={false} />}
    </EffectComposer>
  );
}
