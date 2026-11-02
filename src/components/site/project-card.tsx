import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import type { ProjectSummary } from "@/lib/content";

export function ProjectCard({ project, priority }: { project: ProjectSummary; priority?: boolean }) {
  const meta = [project.client, project.role].filter(Boolean).join(" · ");
  return (
    <Link href={`/work/${project.slug}`} className="group block outline-none">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/70 bg-muted transition-shadow group-hover:shadow-[0_8px_30px_-12px_rgb(0_0_0/0.18)] group-focus-visible:ring-2 group-focus-visible:ring-ring">
        {project.cover ? (
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="(min-width: 720px) 640px, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="mt-3.5 flex items-baseline justify-between gap-4">
        <h3 className="flex items-center gap-1 text-[15px] font-medium tracking-tight text-foreground">
          {project.title}
          <ArrowUpRightIcon className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </h3>
        {project.year ? (
          <span className="shrink-0 font-mono text-xs text-muted-foreground">{project.year}</span>
        ) : null}
      </div>
      {project.summary ? (
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{project.summary}</p>
      ) : null}
      {meta ? <p className="mt-1.5 text-xs text-muted-foreground/80">{meta}</p> : null}
    </Link>
  );
}

export function PlaygroundTile({ project }: { project: ProjectSummary }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block outline-none">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border/70 bg-muted group-focus-visible:ring-2 group-focus-visible:ring-ring">
        {project.cover ? (
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="(min-width: 720px) 320px, 50vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="mt-2.5 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium tracking-tight text-foreground">{project.title}</h3>
        {project.year ? <span className="font-mono text-xs text-muted-foreground">{project.year}</span> : null}
      </div>
    </Link>
  );
}
