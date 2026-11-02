import Markdoc, { type Config, type Node, type RenderableTreeNode, Tag } from "@markdoc/markdoc";
import React, { type ReactNode } from "react";
import { asset } from "@/lib/asset";
import { CountUp } from "./count-up";
import { cn } from "@/lib/utils";

const isFigure = (child: RenderableTreeNode) =>
  Tag.isTag(child) ? child.name === "Figure" : typeof child === "string" && !child.trim();

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const textOf = (node: Node) => {
  let out = "";
  for (const child of node.walk()) if (child.type === "text") out += String(child.attributes.content ?? "");
  return out;
};

// Section headings (for "On this page") and a reading-time estimate, from the Markdoc tree.
export function outline(node: Node) {
  const headings: { id: string; title: string }[] = [];
  for (const child of node.children) {
    if (child.type === "heading" && child.attributes.level === 2) {
      const title = textOf(child);
      headings.push({ id: slugify(title), title });
    }
  }
  const words = textOf(node).split(/\s+/).filter(Boolean).length;
  return { headings, minutes: Math.max(1, Math.round(words / 220)) };
}

const config: Config = {
  nodes: {
    heading: {
      children: ["inline"],
      attributes: { level: { type: Number, required: true } },
      transform(node, cfg) {
        const level = Number(node.attributes.level);
        const children = node.transformChildren(cfg);
        const id = level <= 3 ? slugify(textOf(node)) : undefined;
        return new Tag(`h${level}`, { id, className: "scroll-mt-24" }, children);
      },
    },
    image: {
      render: "Figure",
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
        title: { type: String },
      },
    },
    // A paragraph holding only images renders as bare figures, so <figure> never sits inside <p>.
    paragraph: {
      transform(node, cfg) {
        const children = node.transformChildren(cfg).flat() as RenderableTreeNode[];
        if (children.length && children.some(Tag.isTag) && children.every(isFigure)) {
          return children.filter(Tag.isTag);
        }
        return new Tag("p", {}, children);
      },
    },
  },
  tags: {
    callout: { render: "Callout" },
    gallery: {
      render: "Gallery",
      attributes: { columns: { type: Number, default: 2 } },
    },
    stats: { render: "Stats" },
    stat: {
      render: "Stat",
      selfClosing: true,
      attributes: {
        value: { type: String, required: true },
        label: { type: String, required: true },
      },
    },
  },
};

function Figure({ src, alt, title }: { src: string; alt?: string; title?: string }) {
  return (
    <figure className="cs-figure">
      {/* eslint-disable-next-line @next/next/no-img-element -- body images are pre-optimised WebP of unknown size */}
      <img
        src={asset(src)}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        data-zoomable
        data-cursor="Zoom"
        className="w-full cursor-zoom-in rounded-lg border border-border/70 bg-muted"
      />
      {title ? (
        <figcaption className="mt-2.5 text-[13px] text-muted-foreground">{title}</figcaption>
      ) : null}
    </figure>
  );
}

function Gallery({ columns = 2, children }: { columns?: number; children: ReactNode }) {
  return (
    <div
      className={cn(
        "cs-gallery grid gap-3 [&_figure]:my-0",
        columns >= 3 ? "grid-cols-2 sm:grid-cols-3" : columns === 2 ? "sm:grid-cols-2" : "grid-cols-1",
      )}
    >
      {children}
    </div>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <aside className="cs-callout rounded-lg border border-border bg-card px-5 py-4 text-[15.5px] leading-7 text-foreground [&>p+p]:mt-3">
      {children}
    </aside>
  );
}

function Stats({ children }: { children: ReactNode }) {
  return (
    <div className="cs-stats grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
      {children}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    // The offset shadow draws inner dividers only; the container clips it at the outer edges.
    <div className="px-4 py-4 shadow-[-1px_-1px_0_0_var(--border)]">
      <div className="text-xl font-medium tracking-tight text-foreground">
        <CountUp value={value} />
      </div>
      <div className="mt-1 text-[13px] leading-5 text-muted-foreground">{label}</div>
    </div>
  );
}

const components = { Figure, Gallery, Callout, Stats, Stat };

export function MarkdocContent({ node }: { node: Node }) {
  const tree = Markdoc.transform(node, config);
  return <div className="prose-case">{Markdoc.renderers.react(tree, React, { components })}</div>;
}
