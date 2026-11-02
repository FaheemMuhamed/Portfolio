import { CursorLabel } from "@/components/site/cursor-label";
import { DitherFooter } from "@/components/site/dither-footer";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { getProfile } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();
  return (
    <>
      <a
        href="#content"
        className="sr-only z-50 rounded-sm bg-foreground px-3 py-2 text-sm text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div className="mx-auto w-full max-w-[680px] px-5 sm:px-6">
        <SiteHeader name={profile.name} />
        <main id="content">{children}</main>
        <SiteFooter profile={profile} />
      </div>
      <DitherFooter />
      <ScrollReveal />
      <CursorLabel />
    </>
  );
}
