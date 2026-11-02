import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[680px] flex-col justify-center px-5">
      <p className="font-mono text-xs text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight">This page doesn&apos;t exist.</h1>
      <Link href="/" className="mt-6 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
        Back home
      </Link>
    </main>
  );
}
