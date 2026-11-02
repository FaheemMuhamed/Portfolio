"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SiteClock } from "./site-clock";
import { ThemeToggle } from "./theme";

export function SiteHeader({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 -mx-5 flex items-center justify-between gap-4 border-b px-5 py-4 backdrop-blur-md transition-colors sm:-mx-6 sm:px-6",
        scrolled ? "border-border bg-background/80" : "border-transparent bg-background/0",
      )}
    >
      <Link href="/" className="shrink-0 text-sm font-medium tracking-tight whitespace-nowrap text-foreground">
        {name}
      </Link>
      <nav className="flex shrink-0 items-center gap-0.5 text-[13px] whitespace-nowrap text-muted-foreground sm:gap-4">
        <Link href="/#work" className="rounded-sm px-1.5 py-1 transition-colors hover:text-foreground">
          Work
        </Link>
        <Link href="/#experience" className="hidden rounded-sm px-1.5 py-1 transition-colors hover:text-foreground min-[420px]:inline">
          About
        </Link>
        <Link href="/#contact" className="rounded-sm px-1.5 py-1 transition-colors hover:text-foreground">
          Contact
        </Link>
        <SiteClock />
        <ThemeToggle />
      </nav>
    </header>
  );
}
