import { collection, config, fields, singleton } from "@keystatic/core";
import { block, repeating, wrapper } from "@keystatic/core/content-components";

// Local mode edits files on disk while `npm run dev` is running.
// Set NEXT_PUBLIC_KEYSTATIC_STORAGE=github (plus the GitHub App env vars) once the site is deployed.
const storage =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github"
    ? ({ kind: "github", repo: "FaheemMuhamed/Portfolio" } as const)
    : ({ kind: "local" } as const);

const list = (label: string) =>
  fields.array(fields.text({ label }), {
    label: `${label}s`,
    itemLabel: (props) => props.value,
  });

export default config({
  storage,
  ui: {
    brand: { name: "Portfolio" },
    navigation: {
      Site: ["profile"],
      Content: ["projects", "experience"],
    },
  },
  singletons: {
    profile: singleton({
      label: "Profile",
      path: "content/profile",
      schema: {
        name: fields.text({ label: "Name" }),
        role: fields.text({ label: "Role" }),
        location: fields.text({ label: "Location" }),
        avatar: fields.image({
          label: "Avatar",
          directory: "public/images",
          publicPath: "/images/",
        }),
        intro: fields.text({
          label: "Intro",
          description: "The short paragraph under your name.",
          multiline: true,
        }),
        about: fields.text({
          label: "About",
          description: "A longer, more personal note shown further down the page.",
          multiline: true,
        }),
        available: fields.checkbox({
          label: "Available for freelance",
          defaultValue: true,
        }),
        email: fields.text({ label: "Email" }),
        resume: fields.file({
          label: "Resume (PDF)",
          directory: "public/files",
          publicPath: "/files/",
        }),
        links: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            url: fields.text({ label: "URL" }),
          }),
          { label: "Links", itemLabel: (props) => props.fields.label.value },
        ),
        education: fields.array(
          fields.object({
            school: fields.text({ label: "School" }),
            logo: fields.image({
              label: "Logo",
              description: "Square, ideally 160×160. Leave empty to show an initial.",
              directory: "public/logos",
              publicPath: "/logos/",
            }),
            degree: fields.text({ label: "Degree" }),
            years: fields.text({ label: "Years" }),
          }),
          { label: "Education", itemLabel: (props) => props.fields.school.value },
        ),
        certifications: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            issuer: fields.text({ label: "Issuer" }),
            year: fields.text({ label: "Year" }),
          }),
          { label: "Certifications", itemLabel: (props) => props.fields.name.value },
        ),
      },
    }),
  },
  collections: {
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "content/projects/*",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "kind", "year"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        summary: fields.text({ label: "Summary", multiline: true }),
        cover: fields.image({
          label: "Cover",
          description: "Card thumbnail and page hero, about 16:10.",
          directory: "public/work",
          publicPath: "/work/",
        }),
        kind: fields.select({
          label: "Kind",
          options: [
            { label: "Case study", value: "case-study" },
            { label: "Side project", value: "side-project" },
            { label: "Playground", value: "playground" },
          ],
          defaultValue: "case-study",
        }),
        year: fields.text({ label: "Year" }),
        client: fields.text({ label: "Client / context" }),
        role: fields.text({ label: "Role" }),
        duration: fields.text({ label: "Duration" }),
        team: list("Teammate"),
        tools: list("Tool"),
        tags: list("Tag"),
        featured: fields.checkbox({ label: "Featured", defaultValue: false }),
        moreOnly: fields.checkbox({
          label: "Hide behind Show more",
          description: "Listed only after the visitor clicks Show more on the home page.",
          defaultValue: false,
        }),
        comingSoon: fields.checkbox({
          label: "Coming soon",
          description: "Shows the card with a Coming soon label and no page.",
          defaultValue: false,
        }),
        order: fields.integer({
          label: "Order",
          description: "Lower numbers show first.",
          defaultValue: 10,
        }),
        liveUrl: fields.text({ label: "Live URL" }),
        behanceUrl: fields.text({ label: "Behance URL" }),
        body: fields.markdoc({
          label: "Body",
          options: {
            image: { directory: "public/work", publicPath: "/work/" },
          },
          components: {
            callout: wrapper({ label: "Callout", schema: {} }),
            gallery: wrapper({
              label: "Gallery",
              schema: {
                columns: fields.integer({
                  label: "Columns",
                  defaultValue: 2,
                  validation: { min: 1, max: 3 },
                }),
              },
            }),
            stats: repeating({ label: "Stats", children: ["stat"], schema: {} }),
            stat: block({
              label: "Stat",
              schema: {
                value: fields.text({ label: "Value" }),
                label: fields.text({ label: "Label" }),
              },
            }),
          },
        }),
      },
    }),
    experience: collection({
      label: "Experience",
      slugField: "company",
      path: "content/experience/*",
      format: "yaml",
      columns: ["company", "role", "start"],
      schema: {
        company: fields.slug({ name: { label: "Company" } }),
        role: fields.text({ label: "Role" }),
        logo: fields.image({
          label: "Logo",
          description: "Square, ideally 160×160. Leave empty to show an initial.",
          directory: "public/logos",
          publicPath: "/logos/",
        }),
        location: fields.text({ label: "Location" }),
        start: fields.text({ label: "Start", description: "e.g. Aug 2025" }),
        end: fields.text({ label: "End", description: "Leave empty for Present" }),
        description: fields.text({ label: "Description", multiline: true }),
        url: fields.text({ label: "Company URL" }),
        order: fields.integer({
          label: "Order",
          description: "Lower numbers show first.",
          defaultValue: 10,
        }),
      },
    }),
  },
});
