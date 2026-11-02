import { DitherFooter } from "@/components/site/dither-footer";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getProfile } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();
  return (
    <>
      <div className="mx-auto w-full max-w-[680px] px-5 sm:px-6">
        <SiteHeader name={profile.name} />
        <main>{children}</main>
        <SiteFooter profile={profile} />
      </div>
      <DitherFooter />
    </>
  );
}
