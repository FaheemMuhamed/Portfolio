"use client";

import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Copies the address instead of jumping to a mail app; the toast still offers the mail app.
// The toast is portalled to <body> so animated ancestors can't trap its fixed position.
export function CopyEmail({ email, className, children }: { email: string; className?: string; children: ReactNode }) {
  const [shown, setShown] = useState<"copied" | "failed" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  async function copy(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!navigator.clipboard) return; // fall back to the mailto link
    e.preventDefault();
    let result: "copied" | "failed" = "copied";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      result = "failed"; // e.g. clipboard blocked: show the address so it can be selected
    }
    setShown(result);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShown(null), result === "copied" ? 2600 : 6000);
  }

  return (
    <>
      <a href={`mailto:${email}`} onClick={copy} data-cursor="Copy" className={className}>
        {children}
      </a>
      {shown
        ? createPortal(
            <div
              role="status"
              className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 animate-in items-center gap-3 rounded-sm border border-border bg-foreground px-3.5 py-2 text-[13px] text-background shadow-lg duration-300 fade-in slide-in-from-bottom-2"
            >
              <span className={shown === "failed" ? "font-mono select-all" : undefined}>
                {shown === "copied" ? "Email copied" : email}
              </span>
              <a href={`mailto:${email}`} className="font-mono text-[11px] underline underline-offset-4 opacity-80 hover:opacity-100">
                Open mail
              </a>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
