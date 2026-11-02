import { DitherAvatar } from "@/components/site/dither-avatar";
import { ExternalLink } from "@/components/site/footer";
import { PlaygroundTile, ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { ShowMore } from "@/components/site/show-more";
import { WorkTabs } from "@/components/site/work-tabs";
import { asset } from "@/lib/asset";
import { getExperience, getProfile, getProjects, kindLabel, type Kind } from "@/lib/content";

export default async function Home() {
  const [profile, projects, experience] = await Promise.all([getProfile(), getProjects(), getExperience()]);

  const byKind = (kind: Kind) => projects.filter((p) => p.kind === kind);
  const tabs = (["case-study", "side-project", "playground"] as const)
    .map((kind) => {
      const items = byKind(kind);
      return {
        value: kind,
        label: kindLabel[kind],
        count: items.length,
        content:
          kind === "playground" ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {items.map((p) => (
                <PlaygroundTile key={p.slug} project={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-14">
              {items
                .filter((p) => !p.moreOnly)
                .map((p, i) => (
                  <Reveal key={p.slug} onScroll>
                    <ProjectCard project={p} priority={i === 0} />
                  </Reveal>
                ))}
              {items.some((p) => p.moreOnly) ? (
                <ShowMore count={items.filter((p) => p.moreOnly).length}>
                  {items
                    .filter((p) => p.moreOnly)
                    .map((p) => (
                      <ProjectCard key={p.slug} project={p} />
                    ))}
                </ShowMore>
              ) : null}
            </div>
          ),
      };
    })
    .filter((t) => t.count > 0);

  return (
    <>
      <section className="pt-10 pb-14 sm:pt-16">
        <Reveal>
          {profile.avatar ? <DitherAvatar src={asset(profile.avatar)} alt={profile.name} /> : null}
          <h1 className="mt-6 text-[22px] font-medium tracking-tight">{profile.name}</h1>
          <p className="mt-0.5 flex items-center gap-2 text-[15px] text-muted-foreground">
            {profile.role}
            {profile.location ? <span aria-hidden>·</span> : null}
            {profile.location}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 max-w-[560px] text-[15.5px] leading-7 text-foreground/85">{profile.intro}</p>
          {profile.available ? (
            <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-50 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-live" />
              </span>
              Available for freelance
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {profile.email ? <ExternalLink href={`mailto:${profile.email}`}>Email</ExternalLink> : null}
            {profile.links.map((l) => (
              <ExternalLink key={l.url} href={l.url}>
                {l.label}
              </ExternalLink>
            ))}
            {profile.resume ? <ExternalLink href={asset(profile.resume)}>Resume</ExternalLink> : null}
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="work">
        <h2 id="work" className="sr-only">
          Work
        </h2>
        <WorkTabs tabs={tabs} />
      </section>

      <section aria-labelledby="experience" className="mt-24">
        <SectionLabel id="experience">Experience</SectionLabel>
        <ol className="mt-5 divide-y divide-border">
          {experience.map((e) => (
            <li key={e.slug} className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1 py-4 sm:grid-cols-[auto_1fr_auto] sm:gap-x-4">
              <OrgLogo src={e.logo} name={e.company} />
              <div>
                <p className="text-[15px] text-foreground">
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noreferrer" className="hover:underline hover:underline-offset-4">
                      {e.company}
                    </a>
                  ) : (
                    e.company
                  )}
                  <span className="text-muted-foreground"> · {e.role}</span>
                </p>
                {e.description ? (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{e.description}</p>
                ) : null}
              </div>
              <p className="col-start-2 font-mono text-xs text-muted-foreground sm:col-start-auto sm:pt-1">
                {e.start} — {e.end || "Present"}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {profile.education.length || profile.certifications.length ? (
        <section aria-labelledby="education" className="mt-16 grid gap-10 sm:grid-cols-2">
          {profile.education.length ? (
            <div>
              <SectionLabel id="education">Education</SectionLabel>
              <ul className="mt-4 space-y-3">
                {profile.education.map((ed) => (
                  <li key={ed.school} className="flex gap-3.5 text-sm">
                    <OrgLogo src={ed.logo} name={ed.school} />
                    <div>
                      <p className="text-foreground">{ed.school}</p>
                      <p className="text-muted-foreground">
                        {ed.degree} · <span className="font-mono text-xs">{ed.years}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {profile.certifications.length ? (
            <div>
              <SectionLabel>Certifications</SectionLabel>
              <ul className="mt-4 space-y-3">
                {profile.certifications.map((c) => (
                  <li key={c.name} className="text-sm">
                    <p className="text-foreground">{c.name}</p>
                    <p className="text-muted-foreground">
                      {c.issuer} · <span className="font-mono text-xs">{c.year}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {profile.about ? (
        <section aria-labelledby="about" className="mt-16">
          <SectionLabel id="about">Outside work</SectionLabel>
          <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-muted-foreground">{profile.about}</p>
        </section>
      ) : null}
    </>
  );
}

function OrgLogo({ src, name }: { src?: string | null; name: string }) {
  return (
    <span className="mt-0.5 grid size-9 shrink-0 place-items-center overflow-hidden rounded-sm border border-border bg-white">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- tiny pre-sized logo
        <img src={asset(src)} alt="" width={36} height={36} loading="lazy" className="size-full object-contain p-1" />
      ) : (
        <span className="text-[13px] font-medium text-neutral-500" aria-hidden>
          {name.replace(/[^A-Za-z]/g, "").charAt(0)}
        </span>
      )}
    </span>
  );
}

function SectionLabel({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-[13px] font-medium text-muted-foreground">
      {children}
    </h2>
  );
}
