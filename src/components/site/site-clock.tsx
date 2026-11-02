"use client";

import { useEffect, useState } from "react";

// Local time in Bengaluru, with a slow blinking colon.
export function SiteClock() {
  const [parts, setParts] = useState<{ h: string; m: string; p: string } | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true });
    const update = () => {
      const o = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
      setParts({ h: o.hour, m: o.minute, p: o.dayPeriod });
    };
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="hidden font-mono text-[11px] text-muted-foreground tabular-nums sm:inline" title="Local time in Bengaluru">
      BLR{" "}
      {parts ? (
        <>
          {parts.h}
          <span className="animate-[blink_2s_steps(1)_infinite] motion-reduce:animate-none">:</span>
          {parts.m} {parts.p}
        </>
      ) : (
        "--:--"
      )}
    </span>
  );
}
