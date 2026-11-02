"use client";

import { useEffect, useRef, useState } from "react";

// Counts a stat's leading number up from zero the first time it scrolls into view ("300+", "4 weeks", "56").
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\d+)([\s\S]*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!match || !el || target < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen at load
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 900);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per value
  }, [value]);

  if (!match) return <>{value}</>;
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}
