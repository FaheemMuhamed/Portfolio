import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { getProjects } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const ready = projects.filter((p) => !p.comingSoon);
  return [{ url: `${base}/` }, ...ready.map((p) => ({ url: `${base}/work/${p.slug}/` }))];
}
