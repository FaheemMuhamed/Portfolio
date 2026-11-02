"use client";

import { ChevronDownIcon } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

export function ShowMore({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <div id={id} hidden={!open} className="flex flex-col gap-14">
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-1.5 self-start rounded-sm border border-border bg-card px-3.5 text-[13px] text-foreground transition-colors hover:bg-muted"
      >
        {open ? "Hide other works" : "Show other works"}
        <ChevronDownIcon className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
    </>
  );
}
