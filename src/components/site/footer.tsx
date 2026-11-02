import type { getProfile } from "@/lib/content";
import { CopyEmail } from "./copy-email";

type Profile = Awaited<ReturnType<typeof getProfile>>;

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer id="contact" data-reveal className="mt-24 scroll-mt-24 border-t border-border py-10 text-sm">
      <p className="text-foreground">Say hi.</p>
      <p className="mt-1 text-muted-foreground">
        I&apos;m always happy to talk about design, 3D or a project you have in mind.
      </p>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
        {profile.email ? (
          <CopyEmail
            email={profile.email}
            className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-current"
          >
            {profile.email}
          </CopyEmail>
        ) : null}
        {profile.links.map((l) => (
          <ExternalLink key={l.url} href={l.url}>
            {l.label}
          </ExternalLink>
        ))}
      </div>
      <p className="mt-10 font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-current"
    >
      {children}
    </a>
  );
}
