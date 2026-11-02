"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ditherRGB } from "@/lib/dither-color";

// On hover the photo pixelates into an ordered (Bayer 4×4) dither of blue dots on a transparent ground,
// then a slow wave keeps the pattern moving.
const SIZE = 64; // canvas pixels; CSS size matches, so cells stay crisp with image-rendering: pixelated
const STEPS = [16, 8, 4, 2]; // cell sizes for the pixelate-in
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export function DitherAvatar({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lumaRef = useRef<Float32Array | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = SIZE;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
      const luma = new Float32Array(SIZE * SIZE);
      let min = 1;
      let max = 0;
      for (let i = 0; i < luma.length; i++) {
        const l = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
        luma[i] = l;
        min = Math.min(min, l);
        max = Math.max(max, l);
      }
      // Stretch contrast so the dark photo still gives a readable dither.
      const range = Math.max(max - min, 0.01);
      for (let i = 0; i < luma.length; i++) luma[i] = Math.pow((luma[i] - min) / range, 0.75);
      lumaRef.current = luma;
    };
    return () => cancelAnimationFrame(frameRef.current);
  }, [src]);

  function draw(cell: number, t: number) {
    const canvas = canvasRef.current;
    const luma = lumaRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !luma || !ctx) return;
    const out = ctx.createImageData(SIZE, SIZE);
    const [r, g, b] = ditherRGB();
    for (let by = 0; by < SIZE; by += cell) {
      for (let bx = 0; bx < SIZE; bx += cell) {
        let sum = 0;
        for (let y = by; y < by + cell; y++) for (let x = bx; x < bx + cell; x++) sum += luma[y * SIZE + x];
        const avg = sum / (cell * cell);
        const cx = bx / cell;
        const cy = by / cell;
        const wave = 0.09 * Math.sin(t / 380 + cy * 0.45 + cx * 0.15);
        // Dots mark the light areas; shadows stay transparent.
        if (avg + wave <= BAYER[(cy % 4) * 4 + (cx % 4)]) continue;
        for (let y = by; y < by + cell; y++) {
          for (let x = bx; x < bx + cell; x++) {
            const i = (y * SIZE + x) * 4;
            out.data[i] = r;
            out.data[i + 1] = g;
            out.data[i + 2] = b;
            out.data[i + 3] = 255;
          }
        }
      }
    }
    ctx.putImageData(out, 0, 0);
  }

  function start() {
    cancelAnimationFrame(frameRef.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      draw(2, 0);
      return;
    }
    const t0 = performance.now();
    let last = 0;
    const tick = (now: number) => {
      // ~15 fps keeps the motion stepped and digital rather than smooth.
      if (now - last > 66) {
        last = now;
        const step = Math.min(Math.floor((now - t0) / 70), STEPS.length - 1);
        draw(STEPS[step], now);
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(frameRef.current);
  }

  return (
    <span
      className="group/avatar relative block size-16 overflow-hidden rounded-lg border border-border"
      onPointerEnter={start}
      onPointerLeave={stop}
    >
      <Image
        src={src}
        alt={alt}
        width={64}
        height={64}
        priority
        className="size-full object-cover transition-opacity duration-200 group-hover/avatar:opacity-0"
      />
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        aria-hidden
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-200 [image-rendering:pixelated] group-hover/avatar:opacity-100"
      />
    </span>
  );
}
