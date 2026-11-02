"use client";

import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Click any case-study image to see it large. Tall boards scroll inside the viewer; Esc or a click closes it.
export function Lightbox() {
  const [image, setImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const img = (e.target as Element | null)?.closest<HTMLImageElement>("img[data-zoomable]");
      if (!img) return;
      e.preventDefault();
      setImage({ src: img.currentSrc || img.src, alt: img.alt });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setImage(null);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [image]);

  if (!image) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || "Image"}
      onClick={() => setImage(null)}
      className="fixed inset-0 z-[60] animate-in overflow-y-auto bg-background/95 backdrop-blur-sm duration-200 fade-in"
    >
      <button
        type="button"
        aria-label="Close"
        className="fixed top-4 right-4 z-10 grid size-9 place-items-center rounded-sm border border-border bg-card text-foreground hover:bg-muted"
      >
        <XIcon className="size-4" />
      </button>
      <div className="flex min-h-full items-center justify-center p-4 sm:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element -- same file as the inline image */}
        <img
          src={image.src}
          alt={image.alt}
          className="max-w-[min(1400px,100%)] animate-in rounded-lg duration-300 zoom-in-95"
        />
      </div>
    </div>
  );
}
