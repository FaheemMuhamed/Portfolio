"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Fades elements up as they scroll into view. Opt in with data-reveal; case-study body blocks are included too.
// Only elements below the fold at load are hidden, so nothing flashes and the page still reads without JS.
const SELECTOR = "[data-reveal], .prose-case > article > *";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pending = [...document.querySelectorAll<HTMLElement>(SELECTOR)].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92,
    );
    const io = new IntersectionObserver(
      (entries) => {
        // Elements that arrive together get a short stagger.
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            const el = e.target as HTMLElement;
            el.style.transitionDelay = `${Math.min(i, 5) * 140}ms`;
            el.classList.add("is-revealed");
            io.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    for (const el of pending) {
      el.classList.add("will-reveal");
      io.observe(el);
    }
    return () => {
      io.disconnect();
      for (const el of pending) {
        el.classList.remove("will-reveal", "is-revealed");
        el.style.transitionDelay = "";
      }
    };
  }, [pathname]);

  return null;
}
