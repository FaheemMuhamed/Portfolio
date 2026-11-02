"use client";

import { useEffect, useRef } from "react";
import { ditherRGB } from "@/lib/dither-color";

// The end of every page: a short band that draws a dithered mountain range in blue dots on a transparent ground. The ridges rise as you keep scrolling (far range first, then the nearer ones, then the
// snowcaps), so it only finishes forming at the very bottom. The cursor lights it up; clicks send ripples.
const CELL = 4; // CSS px per dither cell

// 8×8 Bayer matrix, normalised to (0, 1).
const BAYER8 = (() => {
  let m = [[0]];
  for (let n = 1; n < 8; n *= 2) {
    const next: number[][] = [];
    for (let y = 0; y < n * 2; y++) {
      next[y] = [];
      for (let x = 0; x < n * 2; x++) {
        const q = (y < n ? 0 : 2) + (x < n ? 0 : 1);
        next[y][x] = 4 * m[y % n][x % n] + [0, 2, 3, 1][q];
      }
    }
    m = next;
  }
  return m.flat().map((v) => (v + 0.5) / 64);
})();

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp01(v), 3);
// A pointed peak: 1 at its centre, falling to 0 at ±width.
const peak = (u: number, c: number, w: number, h: number) => h * Math.pow(Math.max(0, 1 - Math.abs(u - c) / w), 1.25);

// Ridge tops as a fraction of the canvas height (0 = top). Far → near.
const RIDGES = [
  {
    top: (u: number) =>
      0.8 -
      Math.max(peak(u, 0.6, 0.2, 0.58), peak(u, 0.38, 0.16, 0.4), peak(u, 0.84, 0.14, 0.33), peak(u, 0.12, 0.2, 0.22)) +
      0.012 * Math.sin(u * 97) +
      0.008 * Math.sin(u * 41),
    density: 0.24,
    snow: true,
  },
  {
    top: (u: number) =>
      0.86 -
      Math.max(peak(u, 0.22, 0.28, 0.36), peak(u, 0.52, 0.22, 0.24), peak(u, 0.96, 0.24, 0.32)) +
      0.018 * Math.sin(u * 63 + 1) +
      0.01 * Math.sin(u * 23),
    density: 0.46,
    snow: false,
  },
  {
    top: (u: number) =>
      0.94 - Math.max(peak(u, 0.04, 0.34, 0.26), peak(u, 0.74, 0.34, 0.2)) + 0.014 * Math.sin(u * 51 + 2),
    density: 0.78,
    snow: false,
  },
];

type Ripple = { x: number; y: number; t: number };

export function DitherFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let tops: Float32Array[] = [];
    let image: ImageData | null = null;
    let raf = 0;
    let running = false;
    let shown = reduce ? 1 : 0; // eased scroll progress
    const pointer = { x: -1e4, y: -1e4, active: 0 };
    const ripples: Ripple[] = [];

    function layout() {
      const rect = canvas!.getBoundingClientRect();
      cols = Math.max(1, Math.ceil(rect.width / CELL));
      rows = Math.max(1, Math.ceil(rect.height / CELL));
      canvas!.width = cols;
      canvas!.height = rows;
      image = ctx!.createImageData(cols, rows);
      tops = RIDGES.map((r) => Float32Array.from({ length: cols }, (_, x) => r.top(x / cols)));
    }

    // 0 as the band starts entering the viewport, 1 when the page is scrolled to the very end.
    function scrollProgress() {
      const rect = section!.getBoundingClientRect();
      return clamp01((window.innerHeight - rect.top) / rect.height);
    }

    function frame(now: number) {
      if (!image) return;
      const t = now / 1000;
      const data = image.data;
      data.fill(0);
      const [r, g, b] = ditherRGB();

      shown += ((reduce ? 1 : scrollProgress()) - shown) * (reduce ? 1 : 0.12);
      const rise = RIDGES.map((_, k) => ease(shown * 1.5 - k * 0.22));
      const snow = ease(shown * 2.2 - 1.15);
      pointer.active += ((pointer.x > -1e3 ? 1 : 0) - pointer.active) * 0.08;
      while (ripples.length && t - ripples[0].t > 2.4) ripples.shift();

      for (let y = 0; y < rows; y++) {
        const gy = y / rows;
        for (let x = 0; x < cols; x++) {
          const u = x / cols;
          let v = 0;

          for (let k = 0; k < RIDGES.length; k++) {
            // Each ridge starts below the canvas and rises into place.
            const top = tops[k][x] + (1 - rise[k]) * (1.05 - tops[k][x]);
            if (gy < top) continue;
            const depth = gy - top;
            // Light from the left: slopes facing it read a touch brighter.
            const slope = (tops[k][Math.min(cols - 1, x + 1)] - tops[k][Math.max(0, x - 1)]) * cols;
            v = RIDGES[k].density + depth * 0.35 + slope * 0.02;
            if (RIDGES[k].snow && tops[k][x] < 0.5 && depth < 0.07 * (0.5 - tops[k][x]) * 4) v = 0.2 + 0.75 * snow;
          }

          // Mist drifting between the far and middle ranges.
          const mist = Math.exp(-(((gy - 0.66 - 0.025 * Math.sin(u * 7 + t * 0.35)) / 0.045) ** 2));
          v = v > 0 ? v - 0.22 * mist * rise[1] : 0.1 * mist * rise[1] * (0.6 + 0.4 * Math.sin(u * 13 - t * 0.5));

          const dx = x - pointer.x;
          const dy = y - pointer.y;
          v += 0.32 * pointer.active * Math.exp(-(dx * dx + dy * dy) / 600);
          for (const rp of ripples) {
            const age = t - rp.t;
            const ring = Math.sqrt((x - rp.x) ** 2 + (y - rp.y) ** 2) - age * 90;
            v += 0.5 * Math.exp(-(ring * ring) / 40) * (1 - age / 2.4);
          }

          if (v <= BAYER8[(y & 7) * 8 + (x & 7)]) continue;
          const p = (y * cols + x) * 4;
          data[p] = r;
          data[p + 1] = g;
          data[p + 2] = b;
          data[p + 3] = 255;
        }
      }
      ctx!.putImageData(image, 0, 0);
    }

    let last = 0;
    function loop(now: number) {
      // ~30 fps is plenty for a dither and keeps it cheap.
      if (now - last > 33) {
        last = now;
        frame(now);
      }
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      if (reduce) frame(0);
      else raf = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const toGrid = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      return { x: (e.clientX - rect.left) / CELL, y: (e.clientY - rect.top) / CELL };
    };
    const onMove = (e: PointerEvent) => Object.assign(pointer, toGrid(e));
    const onLeave = () => Object.assign(pointer, { x: -1e4, y: -1e4 });
    const onDown = (e: PointerEvent) => {
      ripples.push({ ...toGrid(e), t: performance.now() / 1000 });
      if (ripples.length > 6) ripples.shift();
    };

    layout();
    const ro = new ResizeObserver(() => {
      layout();
      if (reduce) frame(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(section);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <section ref={sectionRef} aria-hidden className="relative mt-8 h-[clamp(220px,30vw,340px)]">
      <canvas ref={canvasRef} className="absolute inset-0 size-full [image-rendering:pixelated]" />
    </section>
  );
}
