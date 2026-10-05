"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

import { useArcadeStore } from "@/lib/store";
import { poseFor } from "@/lib/stations";

const SETTLE_EPSILON = 0.0009;
const SCRATCH = new THREE.Vector3();

/**
 * Drives the camera from the route. `RouteSync` owns the pathname and writes
 * it into the store; this just chases whatever pose that implies.
 */
export function CameraRig() {
  const activeStation = useArcadeStore((s) => s.activeStation);
  const atHub = useArcadeStore((s) => s.atHub);

  // Start wherever the store already says we are, so a cold load on /notes
  // lands at the notes cabinet instead of flying in from the hub.
  const initial = useRef(poseFor(activeStation, atHub));
  const base = useRef(new THREE.Vector3(...initial.current.position));
  const look = useRef(new THREE.Vector3(...initial.current.target));
  const parallax = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3(...initial.current.position));
  const targetLook = useRef(new THREE.Vector3(...initial.current.target));

  useEffect(() => {
    const pose = poseFor(activeStation, atHub);
    targetPos.current.set(...pose.position);
    targetLook.current.set(...pose.target);
  }, [activeStation, atHub]);

  useFrame((state, delta) => {
    const store = useArcadeStore.getState();
    // Clamp so a background tab doesn't teleport the camera on resume.
    const dt = Math.min(delta, 1 / 20);

    if (store.reducedMotion) {
      base.current.copy(targetPos.current);
      look.current.copy(targetLook.current);
      parallax.current.set(0, 0, 0);
    } else {
      easing.damp3(base.current, targetPos.current, 0.55, dt);
      easing.damp3(look.current, targetLook.current, 0.55, dt);
      easing.damp3(
        parallax.current,
        SCRATCH.set(state.pointer.x * 0.22, state.pointer.y * 0.1, 0),
        0.4,
        dt,
      );
    }

    state.camera.position.copy(base.current).add(parallax.current);
    state.camera.lookAt(look.current);

    const settled =
      base.current.distanceToSquared(targetPos.current) < SETTLE_EPSILON &&
      look.current.distanceToSquared(targetLook.current) < SETTLE_EPSILON;

    if (store.isTransitioning === settled) {
      store.setTransitioning(!settled);
    }
  });

  return null;
}
