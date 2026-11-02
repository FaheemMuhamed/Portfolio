import Link from "next/link";
import { ThemeToggle } from "./theme";

export function SiteHeader({ name }: { name: string }) {
  return (
    <header className="flex items-center justify-between py-6">
      <Link
        href="/"
        className="text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-70"
      >
        {name}
      </Link>
      <ThemeToggle />
    </header>
  );
}
