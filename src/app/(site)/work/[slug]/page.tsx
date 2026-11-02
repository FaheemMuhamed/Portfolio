import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import { MarkdocContent } from "@/components/site/markdoc";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { asset } from "@/lib/asset";
import { getProject, getProjects } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.filter((p) => !p.comingSoon).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: project.cover ? { images: [asset(project.cover)] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project || project.comingSoon) notFound();

  const ready = all.filter((p) => !p.comingSoon);
  const index = ready.findIndex((p) => p.slug === slug);
  const next = ready.length > 1 ? ready[(index + 1) % ready.length] : null;

  const meta = [
    { label: "Role", value: project.role },
    { label: "Context", value: project.client },
    { label: "Timeline", value: [project.duration, project.year].filter(Boolean).join(" · ") },
    { label: "Team", value: project.team.length ? project.team.join(", ") : "" },
    { label: "Tools", value: project.tools.join(", ") },
  ].filter((m) => m.value);

  return (
    <article className="pt-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Back
      </Link>

      <Reveal>
        <header className="mt-10">
          <h1 className="text-[28px] leading-tight font-medium tracking-tight sm:text-[32px]">{project.title}</h1>
          {project.summary ? (
            <p className="mt-3 max-w-[560px] text-[16px] leading-7 text-muted-foreground">{project.summary}</p>
          ) : null}

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 sm:grid-cols-3">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs text-muted-foreground">{m.label}</dt>
                <dd className="mt-1 text-sm leading-6 text-foreground">{m.value}</dd>
              </div>
            ))}
          </dl>

          {project.liveUrl || project.behanceUrl ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.liveUrl ? <PillLink href={project.liveUrl}>Visit site</PillLink> : null}
              {project.behanceUrl ? <PillLink href={project.behanceUrl}>View on Behance</PillLink> : null}
            </div>
          ) : null}
        </header>
      </Reveal>

      {project.cover ? (
        <Reveal delay={0.05}>
          <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-lg border border-border/70 bg-muted">
            <Image src={asset(project.cover)} alt="" fill priority sizes="(min-width: 720px) 640px, 100vw" className="object-cover" />
          </div>
        </Reveal>
      ) : null}

      <div className="mt-12">
        <MarkdocContent node={project.body} />
      </div>

      {next ? (
        <aside data-reveal className="mt-24 border-t border-border pt-8">
          <p className="mb-5 text-[13px] font-medium text-muted-foreground">Next project</p>
          <ProjectCard project={next} />
        </aside>
      ) : null}
    </article>
  );
}

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-8 items-center gap-1 rounded-sm border border-border bg-card px-3.5 text-[13px] text-foreground transition-colors hover:bg-muted"
    >
      {children}
      <ArrowUpRightIcon className="size-3.5 text-muted-foreground" />
    </a>
  );
}
