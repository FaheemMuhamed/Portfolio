import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// CSS-only entrance: content is always visible without JS; scroll-driven where the browser supports it.
export function Reveal({
  children,
  delay = 0,
  onScroll = false,
  className,
}: {
  children: ReactNode;
  delay?: number;
  onScroll?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(onScroll ? "reveal-scroll" : "reveal", className)}
      style={delay ? ({ animationDelay: `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
