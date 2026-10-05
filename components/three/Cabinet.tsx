"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { easing } from "maath";

import { CAB, getCabinetGeometry } from "./geometry/cabinet";
import {
  cssFontFamily,
  drawTracked,
  useCanvasTexture,
} from "./useCanvasTexture";
import { CrtScreenMaterial } from "./materials/CrtScreenMaterial";
import { useArcadeStore } from "@/lib/store";
import type { Station } from "@/lib/stations";

/** Button positions on the panel, in (across, up-slope) metres. */
const BUTTON_LAYOUT: [number, number][] = [
  [0.03, -0.05],
  [0.09, -0.02],
  [0.15, -0.02],
  [0.21, -0.05],
];

let sharedCabinetMaterials: {
  body: THREE.MeshStandardMaterial;
  panel: THREE.MeshStandardMaterial;
  metal: THREE.MeshStandardMaterial;
  stick: THREE.MeshStandardMaterial;
} | null = null;

/** The structural materials are identical across cabinets, so build them once. */
function getSharedMaterials() {
  sharedCabinetMaterials ??= {
    body: new THREE.MeshStandardMaterial({
      color: "#3a3848",
      roughness: 0.48,
      metalness: 0.18,
    }),
    panel: new THREE.MeshStandardMaterial({
      color: "#2a2836",
      roughness: 0.38,
      metalness: 0.12,
    }),
    metal: new THREE.MeshStandardMaterial({
      color: "#6a6a78",
      roughness: 0.28,
      metalness: 0.72,
    }),
    stick: new THREE.MeshStandardMaterial({
      color: "#1f1e28",
      roughness: 0.4,
      metalness: 0.55,
    }),
  };
  return sharedCabinetMaterials;
}

type CabinetProps = {
  station: Station;
  live: boolean;
  glowPlane: boolean;
};

export function Cabinet({ station, live, glowPlane }: CabinetProps) {
  const router = useRouter();
  const geo = useMemo(() => getCabinetGeometry(), []);
  const mats = useMemo(() => getSharedMaterials(), []);

  const accent = useMemo(
    () => new THREE.Color(station.accent),
    [station.accent],
  );

  /** Per-station materials, animated together as the cabinet heats up. */
  const skin = useMemo(() => {
    const trim = new THREE.MeshBasicMaterial({
      color: accent,
      toneMapped: false,
    });
    const glow = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const ball = new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.35,
      roughness: 0.18,
    });
    const buttonA = new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.5,
      roughness: 0.25,
    });
    const buttonB = new THREE.MeshStandardMaterial({
      color: "#e8e8f2",
      emissive: "#7f8aa0",
      emissiveIntensity: 0.4,
      roughness: 0.25,
    });
    return { trim, glow, ball, buttonA, buttonB };
  }, [accent]);

  useEffect(
    () => () => Object.values(skin).forEach((m) => m.dispose()),
    [skin],
  );

  const group = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.ShaderMaterial>(null);
  const labelSprite = useRef<THREE.Sprite>(null);
  const marqueeLight = useRef<THREE.PointLight>(null);
  const heat = useRef(0);

  const marqueeTexture = useCanvasTexture(
    512,
    148,
    (ctx, w, h) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, "#1a1430");
      gradient.addColorStop(0.5, "#241a44");
      gradient.addColorStop(1, "#120d26");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = station.accent;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, w - 20, h - 20);
      ctx.globalAlpha = 1;

      ctx.font = `600 42px ${cssFontFamily("--font-sans-loaded", "system-ui, sans-serif")}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = station.accent;
      ctx.shadowBlur = 26;
      ctx.fillStyle = "#fff6ff";
      drawTracked(ctx, station.marquee, w / 2, h / 2 + 2, 6);
      ctx.shadowBlur = 0;
    },
    [station.marquee, station.accent],
  );

  const screenLabelTexture = useCanvasTexture(
    512,
    364,
    (ctx, w, h) => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";

      ctx.font = `600 34px ${cssFontFamily("--font-sans-loaded", "system-ui, sans-serif")}`;
      drawTracked(ctx, station.label, w / 2, h * 0.36, 2);

      ctx.font = `400 18px ${cssFontFamily("--font-sans-loaded", "system-ui, sans-serif")}`;
      drawTracked(ctx, "Open", w / 2, h * 0.62, 1);
    },
    [station.label],
  );

  const hoverLabelTexture = useCanvasTexture(
    512,
    128,
    (ctx, w, h) => {
      ctx.fillStyle = "rgba(4, 4, 10, 0.8)";
      ctx.beginPath();
      ctx.roundRect(8, 28, w - 16, h - 56, 10);
      ctx.fill();
      ctx.strokeStyle = station.accent;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = `600 28px ${cssFontFamily("--font-sans-loaded", "system-ui, sans-serif")}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = station.accent;
      ctx.shadowColor = station.accent;
      ctx.shadowBlur = 18;
      drawTracked(ctx, station.label, w / 2, h / 2, 1);
      ctx.shadowBlur = 0;
    },
    [station.label, station.accent],
  );

  const handleOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      useArcadeStore.getState().setHovered(station.id);
      document.body.style.cursor = "pointer";
    },
    [station.id],
  );

  const handleOut = useCallback(() => {
    const store = useArcadeStore.getState();
    if (store.hoveredStation === station.id) store.setHovered(null);
    document.body.style.cursor = "";
  }, [station.id]);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      document.body.style.cursor = "";
      router.push(station.path);
    },
    [router, station.path],
  );

  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  useFrame((state, delta) => {
    const { hoveredStation, activeStation, atHub } = useArcadeStore.getState();
    const isHovered = hoveredStation === station.id;
    const isActive = activeStation === station.id && !atHub;

    heat.current = THREE.MathUtils.damp(
      heat.current,
      isActive ? 1 : isHovered ? 0.7 : 0,
      6,
      delta,
    );
    const k = heat.current;

    if (group.current) {
      easing.damp(group.current.position, "y", k * 0.035, 0.22, delta);
    }

    skin.trim.color.copy(accent).multiplyScalar(1 + k * 1.3);
    skin.glow.opacity = 0.1 + k * 0.24;

    if (marqueeLight.current) {
      marqueeLight.current.intensity = 0.55 + k * 1.2;
    }

    if (labelSprite.current) {
      const mat = labelSprite.current.material as THREE.SpriteMaterial;
      easing.damp(mat, "opacity", isHovered && !isActive ? 1 : 0, 0.12, delta);
      labelSprite.current.visible = mat.opacity > 0.01;
    }

    if (screenMat.current) {
      const u = screenMat.current.uniforms;
      u.uTime.value = state.clock.elapsedTime + station.order * 3.7;
      u.uActive.value = k;
    }
  });

  return (
    <group
      position={station.cabinet.position}
      rotation={station.cabinet.rotation}
    >
      <group
        ref={group}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        {/* Profile depths are measured from the back panel, so shifting the
            group puts the station's room position at the footprint centre. */}
        <group position={[0, 0, -CAB.depthCenter]}>
          <mesh
            geometry={geo.body}
            material={mats.body}
            castShadow
            receiveShadow
          />

          <mesh
            geometry={geo.screen}
            position={[0, CAB.screen.y, CAB.screen.z]}
          >
            <crtScreenMaterial
              key={CrtScreenMaterial.key}
              ref={screenMat}
              uVariant={station.order}
              uLive={live ? 1 : 0}
              uAccent={accent}
              uLabel={screenLabelTexture}
              toneMapped={false}
            />
          </mesh>

          <mesh
            geometry={geo.marquee}
            position={[0, CAB.marquee.y, CAB.marquee.z]}
          >
            <meshBasicMaterial map={marqueeTexture} toneMapped={false} />
          </mesh>
          <pointLight
            ref={marqueeLight}
            position={[0, CAB.marquee.y - 0.12, CAB.marquee.z + 0.3]}
            color={station.accent}
            distance={2.4}
            decay={2}
            intensity={0.55}
          />

          {/* Control panel. The outer group's +Z is the panel normal. */}
          <group
            position={[0, CAB.panel.y, CAB.panel.z]}
            rotation={[-Math.PI / 2 + CAB.panel.tiltX, 0, 0]}
          >
            <mesh geometry={geo.panel} material={mats.panel} />
            {/* Re-align so children stand along the panel normal. */}
            <group rotation={[Math.PI / 2, 0, 0]}>
              <mesh
                geometry={geo.stick}
                material={mats.stick}
                position={[-0.17, 0.042, 0]}
              />
              <mesh
                geometry={geo.ball}
                material={skin.ball}
                position={[-0.17, 0.095, 0]}
              />
              {BUTTON_LAYOUT.map(([bx, bz], i) => (
                <mesh
                  key={i}
                  geometry={geo.button}
                  material={i % 2 === 0 ? skin.buttonA : skin.buttonB}
                  position={[bx, 0.012, bz]}
                />
              ))}
            </group>
          </group>

          <mesh
            geometry={geo.coinDoor}
            material={mats.metal}
            position={[0, CAB.coinDoor.y, CAB.coinDoor.z]}
          />
          <mesh
            geometry={geo.unitBox}
            material={skin.trim}
            position={[0, CAB.coinDoor.y + 0.035, CAB.coinDoor.z + 0.013]}
            scale={[0.055, 0.012, 0.01]}
          />

          {/* Neon trim down both front edges. */}
          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh
                geometry={geo.unitBox}
                material={skin.trim}
                position={[
                  side * (CAB.width / 2 + 0.005),
                  (CAB.trim.screen.bottom + CAB.trim.screen.top) / 2,
                  CAB.trim.screen.z,
                ]}
                scale={[
                  0.014,
                  CAB.trim.screen.top - CAB.trim.screen.bottom,
                  0.014,
                ]}
              />
              <mesh
                geometry={geo.unitBox}
                material={skin.trim}
                position={[
                  side * (CAB.width / 2 + 0.005),
                  (CAB.trim.base.bottom + CAB.trim.base.top) / 2,
                  CAB.trim.base.z,
                ]}
                scale={[0.014, CAB.trim.base.top - CAB.trim.base.bottom, 0.014]}
              />
            </group>
          ))}

          {glowPlane && (
            <mesh
              geometry={geo.glow}
              material={skin.glow}
              position={[0, 0.012, CAB.depthCenter + 0.25]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
          )}
        </group>

        <sprite
          ref={labelSprite}
          position={[0, CAB.label.y, 0]}
          scale={[1.1, 0.275, 1]}
          visible={false}
          raycast={() => null}
        >
          <spriteMaterial
            map={hoverLabelTexture}
            transparent
            opacity={0}
            depthTest={false}
            toneMapped={false}
          />
        </sprite>
      </group>
    </group>
  );
}
