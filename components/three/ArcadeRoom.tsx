"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei";

import { Cabinet } from "./Cabinet";
import { Dust } from "./Dust";
import { NeonSign } from "./NeonSign";
import { useCanvasTexture } from "./useCanvasTexture";
import { useQualityPreset } from "@/lib/store";
import { STATION_LIST } from "@/lib/stations";
import { site } from "@/lib/site";

export const ROOM = {
  width: 22,
  depth: 20,
  height: 4.8,
  backWallZ: -10,
};

/** Classic black-light arcade carpet, generated rather than downloaded. */
function useCarpetTexture() {
  const texture = useCanvasTexture(
    512,
    512,
    (ctx, w, h) => {
      ctx.fillStyle = "#0d0722";
      ctx.fillRect(0, 0, w, h);

      const palette = ["#ff2d95", "#00e5ff", "#ffd400", "#39ff14", "#b06bff"];
      // Deterministic so the tile is stable across redraws.
      let seed = 1337;
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };

      for (let i = 0; i < 220; i++) {
        const x = rand() * w;
        const y = rand() * h;
        const s = 4 + rand() * 14;
        ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
        ctx.globalAlpha = 0.1 + rand() * 0.22;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rand() * Math.PI);

        const shape = Math.floor(rand() * 3);
        if (shape === 0) {
          ctx.fillRect(-s / 2, -s / 6, s, s / 3);
        } else if (shape === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, s / 2.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -s / 2);
          ctx.lineTo(s / 2, s / 2);
          ctx.lineTo(-s / 2, s / 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    },
    [],
  );

  return useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 9);
    texture.needsUpdate = true;
    return texture;
  }, [texture]);
}

function LightCone({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} raycast={() => null}>
      <coneGeometry args={[1.35, 3.2, 20, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.045}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export function ArcadeRoom() {
  const quality = useQualityPreset();
  const carpet = useCarpetTexture();

  return (
    <group>
      {/* Shell. A single back-facing box guarantees no seams. */}
      <mesh position={[0, ROOM.height / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM.width, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial
          color="#09060f"
          roughness={0.95}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        {quality.reflectiveFloor ? (
          <MeshReflectorMaterial
            map={carpet}
            mirror={0.32}
            resolution={512}
            blur={[420, 110]}
            mixBlur={1.1}
            mixStrength={2.4}
            depthScale={0.9}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            roughness={0.72}
            metalness={0.1}
          />
        ) : (
          <meshStandardMaterial map={carpet} roughness={0.82} metalness={0.06} />
        )}
      </mesh>

      {/* Neon on the back wall */}
      <NeonSign
        text={site.name.toUpperCase()}
        color="#ff2d95"
        position={[0, 3.5, ROOM.backWallZ + 0.08]}
        width={7.6}
        fontSize={96}
        flicker={9}
      />
      <NeonSign
        text="ARCADE"
        color="#00e5ff"
        position={[0, 2.62, ROOM.backWallZ + 0.08]}
        width={3.4}
        fontSize={70}
        tracking={22}
      />
      <NeonSign
        text="OPEN 24H"
        color="#39ff14"
        position={[-9.2, 2.4, -4]}
        rotation={[0, Math.PI / 2, 0]}
        width={3.6}
        fontSize={60}
        tracking={10}
        flicker={5.5}
      />
      <NeonSign
        text="TOKENS"
        color="#ffd400"
        position={[9.2, 2.4, -4]}
        rotation={[0, -Math.PI / 2, 0]}
        width={3.2}
        fontSize={60}
        tracking={10}
      />

      {/* Lighting */}
      <ambientLight intensity={0.38} color="#6a5a9a" />
      <hemisphereLight
        intensity={0.28}
        color="#8aa4ff"
        groundColor="#1a0e2e"
      />
      <spotLight
        position={[0, ROOM.height - 0.3, 1.2]}
        angle={0.95}
        penumbra={0.9}
        distance={18}
        decay={1.4}
        intensity={34}
        color="#c8d8ff"
        castShadow={quality.shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0012}
      />
      <pointLight
        position={[-4.8, 3.2, -1.4]}
        color="#ff2d95"
        distance={14}
        decay={2}
        intensity={8}
      />
      <pointLight
        position={[4.8, 3.2, -1.4]}
        color="#00e5ff"
        distance={14}
        decay={2}
        intensity={8}
      />

      {quality.lightCones && (
        <>
          <LightCone position={[-4.4, 3.1, -1.2]} color="#ff2d95" />
          <LightCone position={[0, 3.1, -2.2]} color="#ffffff" />
          <LightCone position={[4.4, 3.1, -1.2]} color="#00e5ff" />
        </>
      )}

      <Dust count={quality.particles} spread={9} height={ROOM.height} />

      {STATION_LIST.map((station) => (
        <Cabinet
          key={station.id}
          station={station}
          live={quality.liveScreens}
          glowPlane={!quality.reflectiveFloor}
        />
      ))}
    </group>
  );
}
