"use client";

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Attract-mode screens. Every cabinet runs the same material with a different
 * `uVariant`, so five live CRTs cost five draw calls and zero render targets.
 */
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uVariant;
  uniform float uActive;
  uniform float uLive;
  uniform vec3 uAccent;
  uniform sampler2D uLabel;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // about: concentric sonar rings
  float patternRings(vec2 uv, float t) {
    float d = length((uv - 0.5) * vec2(1.5, 1.0));
    float w = sin(d * 32.0 - t * 2.2);
    return smoothstep(0.72, 1.0, w) * smoothstep(0.78, 0.05, d);
  }

  // projects: a grid of cells blinking in and out
  float patternBlocks(vec2 uv, float t) {
    vec2 g = uv * vec2(9.0, 6.0);
    vec2 id = floor(g);
    vec2 f = fract(g);
    float h = hash(id);
    float lit = step(0.58, fract(h * 3.7 + t * 0.22));
    float cell = step(0.1, f.x) * step(f.x, 0.9) * step(0.12, f.y) * step(f.y, 0.88);
    return lit * cell;
  }

  // home: stars streaking out of the centre
  float patternWarp(vec2 uv, float t) {
    vec2 p = (uv - 0.5) * vec2(1.5, 1.0);
    float d = length(p);
    float lane = floor((atan(p.y, p.x) + 3.14159) * 7.0);
    float h = hash(vec2(lane, 1.0));
    float phase = fract(h + t * (0.3 + h * 0.45));
    float star = smoothstep(0.035, 0.0, abs(d - phase * 0.8));
    return star * smoothstep(0.02, 0.22, d);
  }

  // notes: lines of text scrolling upward
  float patternLines(vec2 uv, float t) {
    float scroll = uv.y * 14.0 + t * 1.1;
    float row = floor(scroll);
    float h = hash(vec2(row, 3.0));
    float len = 0.2 + h * 0.62;
    float ink = step(0.1, uv.x) * step(uv.x, 0.1 + len);
    float body = step(0.28, fract(scroll)) * step(fract(scroll), 0.66);
    return ink * body;
  }

  // resume: a high-score bar chart
  float patternBars(vec2 uv, float t) {
    float col = uv.x * 8.0;
    float h = hash(vec2(floor(col), 7.0));
    float height = 0.16 + 0.68 * (0.5 + 0.5 * sin(t * 0.9 + h * 6.283));
    float inBar = step(0.18, fract(col)) * step(fract(col), 0.82);
    return inBar * step(uv.y, height) * step(0.07, uv.y);
  }

  void main() {
    // uLive freezes the animation on low-end devices without changing cost.
    float t = uTime * uLive;

    float p;
    if (uVariant < 0.5) {
      p = patternRings(vUv, t);
    } else if (uVariant < 1.5) {
      p = patternBlocks(vUv, t);
    } else if (uVariant < 2.5) {
      p = patternWarp(vUv, t);
    } else if (uVariant < 3.5) {
      p = patternLines(vUv, t);
    } else {
      p = patternBars(vUv, t);
    }

    vec3 col = vec3(0.012, 0.016, 0.034);
    col += uAccent * p * (0.8 + 0.5 * uActive);

    vec4 label = texture2D(uLabel, vUv);
    float pulse = 0.78 + 0.22 * sin(t * 2.6);
    col = mix(col, uAccent * 1.45 + vec3(0.3), label.a * pulse);

    // Phosphor scanlines and a soft shadow-mask stripe.
    col *= 0.8 + 0.2 * sin(vUv.y * 380.0);
    col *= 0.94 + 0.06 * sin(vUv.x * 240.0);

    // Tube falloff.
    vec2 cv = (vUv - 0.5) * 2.0;
    col *= clamp(1.0 - dot(cv, cv) * 0.4, 0.0, 1.0);

    // Glass reflection along the top edge.
    col += pow(1.0 - vUv.y, 7.0) * 0.05;

    // Mains hum.
    col *= 0.975 + 0.025 * sin(t * 31.0);

    gl_FragColor = vec4(col, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const CrtScreenMaterial = shaderMaterial(
  {
    uTime: 0,
    uVariant: 0,
    uActive: 0,
    uLive: 1,
    uAccent: new THREE.Color("#ff2d95"),
    uLabel: null as THREE.Texture | null,
  },
  vertexShader,
  fragmentShader,
);

extend({ CrtScreenMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    crtScreenMaterial: ThreeElement<typeof CrtScreenMaterial>;
  }
}
