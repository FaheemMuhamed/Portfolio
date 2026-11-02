import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// CSS-only entrance for content at the top of a page; content further down uses <ScrollReveal /> via data-reveal.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("reveal", className)}
      style={delay ? ({ animationDelay: `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
