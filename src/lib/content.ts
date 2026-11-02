import "server-only";
import { cache } from "react";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

export type Kind = "case-study" | "side-project" | "playground";

export const getProfile = cache(async () => {
  const profile = await reader.singletons.profile.read();
  if (!profile) throw new Error("content/profile.yaml is missing");
  return profile;
});

export const getProjects = cache(async () => {
  const all = await reader.collections.projects.all();
  return all
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (a.order ?? 10) - (b.order ?? 10) || a.title.localeCompare(b.title));
});

export type ProjectSummary = Awaited<ReturnType<typeof getProjects>>[number];

export const getProject = cache(async (slug: string) => {
  const entry = await reader.collections.projects.read(slug);
  if (!entry) return null;
  const { node } = await entry.body();
  return { slug, ...entry, body: node };
});

export const getExperience = cache(async () => {
  const all = await reader.collections.experience.all();
  return all
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (a.order ?? 10) - (b.order ?? 10));
});

export const kindLabel: Record<Kind, string> = {
  "case-study": "Work",
  "side-project": "Side projects",
  playground: "Playground",
};
