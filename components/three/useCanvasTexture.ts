"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

/**
 * Builds a CanvasTexture and redraws it once webfonts resolve, so marquee and
 * screen text render in the pixel face rather than the fallback monospace.
 */
export function useCanvasTexture(
  width: number,
  height: number,
  draw: Draw,
  deps: React.DependencyList,
): THREE.CanvasTexture {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, [width, height]);

  useEffect(() => {
    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      draw(ctx, width, height);
      texture.needsUpdate = true;
    };

    render();

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) render();
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texture, width, height, ...deps]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}

/**
 * next/font mints a hashed family name, so canvas drawing has to read it back
 * off the CSS variable rather than hardcoding "Press Start 2P".
 */
export function cssFontFamily(variable: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return value ? `${value}, ${fallback}` : fallback;
}

/** Wide letter-spaced text, centred. Canvas2D has no letter-spacing everywhere. */
export function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  tracking: number,
) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total =
    widths.reduce((a, b) => a + b, 0) + tracking * (text.length - 1);

  let x = cx - total / 2;
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], x + widths[i] / 2, cy);
    x += widths[i] + tracking;
  }
}
