import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { SurpriseFooter } from "@/components/site/surprise-footer";
import { getProfile } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();
  return (
    <div className="[--reveal-h:min(560px,85svh)]">
      {/* The page sits above the hidden footer and lifts away from it at the end of the scroll. */}
      <div className="relative z-10 border-b border-border bg-background shadow-[0_24px_48px_-24px_rgb(0_0_0/0.35)]">
        <div className="mx-auto w-full max-w-[680px] px-5 sm:px-6">
          <SiteHeader name={profile.name} />
          <main>{children}</main>
          <SiteFooter profile={profile} />
        </div>
      </div>
      <SurpriseFooter email={profile.email ?? undefined} links={profile.links} />
    </div>
  );
}
