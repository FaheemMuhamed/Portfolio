"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// "On this page" for wide screens: sits in the left margin and follows the section you're reading.
export function CaseToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const line = window.innerHeight * 0.3;
      let current = headings[0]?.id;
      for (const h of headings) if (h.getBoundingClientRect().top < line) current = h.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (items.length < 3) return null;
  return (
    <nav
      aria-label="On this page"
      className="fixed top-28 left-[max(1.5rem,calc(50%-340px-240px))] hidden w-[190px] xl:block"
    >
      <p className="mb-3 font-mono text-[11px] text-muted-foreground">On this page</p>
      <ul className="space-y-1.5 border-l border-border">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={cn(
                "-ml-px block border-l py-0.5 pl-3 text-[13px] leading-5 transition-colors",
                active === i.id
                  ? "border-dither text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {i.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
