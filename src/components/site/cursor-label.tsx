"use client";

import { useEffect, useRef } from "react";

// A small label that trails the cursor over anything marked data-cursor="…" (e.g. "View" on project cards).
// Mouse and trackpad only; touch screens and reduced-motion setups keep the plain cursor.
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let visible = false;

    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx + 14}px, ${cy + 14}px, 0) scale(${visible ? 1 : 0.6})`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      const label = target?.dataset.cursor ?? "";
      if (label) el.textContent = label;
      if (!visible && label) {
        cx = x;
        cy = y;
      }
      visible = Boolean(label);
      el.style.opacity = visible ? "1" : "0";
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-50 rounded-sm bg-dither px-2.5 py-1 font-mono text-[11px] text-white opacity-0 transition-opacity duration-150"
    />
  );
}
