"use client";

import { useEffect, useRef } from "react";
import { ditherRGB } from "@/lib/dither-color";

// A hidden panel under the page. Keep scrolling past the footer and the page lifts away to reveal a live
// ordered-dither field of blue dots with "say hi" punched out of it. The field leans toward the cursor and ripples on click.
const CELL = 4; // CSS px per dither cell

// 8×8 Bayer matrix, normalised to (0, 1).
const BAYER8 = (() => {
  const m = [[0]];
  for (let n = 1; n < 8; n *= 2) {
    const next: number[][] = [];
    for (let y = 0; y < n * 2; y++) {
      next[y] = [];
      for (let x = 0; x < n * 2; x++) {
        const q = (y < n ? 0 : 2) + (x < n ? 0 : 1);
        next[y][x] = 4 * m[y % n][x % n] + [0, 2, 3, 1][q];
      }
    }
    m.splice(0, m.length, ...next);
  }
  return m.flat().map((v) => (v + 0.5) / 64);
})();

type Ripple = { x: number; y: number; t: number };

export function SurpriseFooter({ email, links }: { email?: string; links: readonly { label: string; url: string }[] }) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const spacer = spacerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !spacer || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let mask = new Uint8Array(0);
    let image: ImageData | null = null;
    let raf = 0;
    let running = false;
    const pointer = { x: -1e4, y: -1e4, active: 0 };
    const ripples: Ripple[] = [];

    function layout() {
      const rect = canvas!.getBoundingClientRect();
      cols = Math.max(1, Math.ceil(rect.width / CELL));
      rows = Math.max(1, Math.ceil(rect.height / CELL));
      canvas!.width = cols;
      canvas!.height = rows;
      image = ctx!.createImageData(cols, rows);

      // Rasterise the words at grid resolution to use as a mask.
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      const family = getComputedStyle(document.body).fontFamily;
      let size = rows * 0.62;
      o.font = `600 ${size}px ${family}`;
      const width = o.measureText("say hi").width;
      if (width > cols * 0.86) size *= (cols * 0.86) / width;
      o.font = `600 ${size}px ${family}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#fff";
      o.fillText("say hi", cols / 2, rows * 0.44);
      const px = o.getImageData(0, 0, cols, rows).data;
      mask = new Uint8Array(cols * rows);
      for (let i = 0; i < mask.length; i++) mask[i] = px[i * 4 + 3] > 110 ? 1 : 0;
    }

    function frame(now: number) {
      if (!image) return;
      const t = now / 1000;
      const data = image.data;
      data.fill(0);
      const [r, g, b] = ditherRGB();
      pointer.active += ((pointer.x > -1e3 ? 1 : 0) - pointer.active) * 0.08;
      while (ripples.length && t - ripples[0].t > 2.4) ripples.shift();

      for (let y = 0; y < rows; y++) {
        const gy = y / rows;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          // Slow interference of two waves, brighter toward the bottom edge.
          let v =
            0.34 +
            0.16 * Math.sin(x * 0.045 + t * 0.7) * Math.cos(y * 0.07 - t * 0.45) +
            0.12 * Math.sin((x + y) * 0.028 - t * 0.35) +
            (gy - 0.5) * 0.28;

          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d2 = dx * dx + dy * dy;
          v += 0.55 * pointer.active * Math.exp(-d2 / 700);

          for (const r of ripples) {
            const age = t - r.t;
            const ring = Math.sqrt((x - r.x) ** 2 + (y - r.y) ** 2) - age * 90;
            v += 0.6 * Math.exp(-(ring * ring) / 40) * (1 - age / 2.4);
          }

          if (mask[i]) v = 0.82 + 0.12 * Math.sin(x * 0.2 + t * 2) - 0.35 * pointer.active * Math.exp(-d2 / 500);

          if (v <= BAYER8[(y & 7) * 8 + (x & 7)]) continue;
          const p = i * 4;
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
      if (reduce) frame(0);
    };

    document.fonts.ready.then(() => {
      layout();
      if (running && reduce) frame(0);
    });
    const ro = new ResizeObserver(() => {
      layout();
      if (reduce) frame(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(spacer);
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
    <>
      {/* Transparent scroll room: the page lifts away over it to uncover the fixed panel. */}
      <div ref={spacerRef} aria-hidden className="pointer-events-none h-[var(--reveal-h)]" />
      <footer className="fixed inset-x-0 bottom-0 z-0 h-[var(--reveal-h)] overflow-hidden bg-background text-foreground">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 size-full cursor-crosshair touch-none [image-rendering:pixelated]"
        />
        <p className="sr-only">Say hi.</p>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 font-mono text-[11px] sm:p-6">
          <span className="rounded-sm border border-border bg-background/90 px-3 py-1.5 text-muted-foreground">You found the bottom. Click around.</span>
          <span className="pointer-events-auto flex flex-wrap gap-2">
            {email ? (
              <a href={`mailto:${email}`} className="rounded-sm bg-foreground px-3 py-1.5 text-background transition-opacity hover:opacity-85">
                {email}
              </a>
            ) : null}
            {links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-border bg-background/90 px-3 py-1.5 text-foreground transition-colors hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
          </span>
        </div>
      </footer>
    </>
  );
}
