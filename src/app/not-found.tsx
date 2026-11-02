import Link from "next/link";
import { DitherFooter } from "@/components/site/dither-footer";

export default function NotFound() {
  return (
    <>
      <main className="mx-auto flex min-h-[60svh] max-w-[680px] flex-col justify-end px-5 pt-24 sm:px-6">
        <p className="font-mono text-xs text-muted-foreground">404 · off the trail</p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">This path doesn&apos;t lead anywhere.</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">The page may have moved, or the link has a typo.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-9 w-fit items-center rounded-sm border border-border bg-card px-3.5 text-[13px] text-foreground transition-colors hover:bg-muted"
        >
          Back to base camp
        </Link>
      </main>
      <DitherFooter />
    </>
  );
}
