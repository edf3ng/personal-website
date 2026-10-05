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
        opacity={0.02}
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
          color="#16141f"
          roughness={0.92}
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
        text="OPEN LATE"
        color="#7ad4ff"
        position={[-9.2, 2.4, -4]}
        rotation={[0, Math.PI / 2, 0]}
        width={3.2}
        fontSize={56}
        tracking={4}
        flicker={0}
      />
      <NeonSign
        text="TOKENS"
        color="#f0c86a"
        position={[9.2, 2.4, -4]}
        rotation={[0, -Math.PI / 2, 0]}
        width={2.8}
        fontSize={56}
        tracking={4}
      />

      <ambientLight intensity={0.62} color="#c8c4d8" />
      <hemisphereLight
        intensity={0.42}
        color="#e8e4f4"
        groundColor="#2a2438"
      />
      <directionalLight
        position={[0.4, 3.4, 6]}
        intensity={2.4}
        color="#fff6ea"
      />
      <spotLight
        position={[0, ROOM.height - 0.3, 2.2]}
        angle={0.85}
        penumbra={0.85}
        distance={20}
        decay={1.2}
        intensity={38}
        color="#f2f0ff"
        castShadow={quality.shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0012}
      />
      <pointLight
        position={[-4.2, 2.6, 0.4]}
        color="#ff9ac4"
        distance={12}
        decay={2}
        intensity={4}
      />
      <pointLight
        position={[4.2, 2.6, 0.4]}
        color="#8ad8ff"
        distance={12}
        decay={2}
        intensity={4}
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
