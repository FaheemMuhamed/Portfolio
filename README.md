# Faheem Muhamed — portfolio

A minimal personal site with case studies, built with Next.js, Tailwind CSS and shadcn/ui. Content lives in this repo as plain files and is edited with [Keystatic](https://keystatic.com), a Git-based CMS at `/keystatic`.

## Run it

You need [Node.js](https://nodejs.org) (LTS).

```bash
npm install
```

```bash
npm run dev
```

- Site: http://localhost:3000
- CMS: http://localhost:3000/keystatic

## Update the portfolio

1. Run `npm run dev` and open http://localhost:3000/keystatic.
2. Edit **Profile** (bio, links, education), **Experience** (one entry per role) or **Projects** (case studies), then click **Save**. Keystatic writes the change to files in `content/` and `public/`, and the site updates instantly.
3. Commit and push:

```bash
git add -A && git commit -m "Update portfolio" && git push
```

To add a case study, click **Add** under Projects. Fill in the title, summary, cover (16:10), kind and order, then write the body. The **+** menu in the editor inserts images, galleries, callouts and stat rows. The file format is documented in [docs/CONTENT.md](docs/CONTENT.md).

**Kinds** decide which tab a project appears in on the home page:
- `case-study`: Work
- `side-project`: Side projects
- `playground`: Playground

## Where things live

```
content/profile.yaml          name, intro, links, education, certifications
content/experience/*.yaml     roles, shown in the Experience list
content/projects/*.mdoc       case studies (frontmatter + Markdoc body)
public/work/<slug>/           case-study images
public/images/                avatar
public/logos/                 company and school logos
keystatic.config.ts           CMS schema
src/app/(site)/               home page and /work/[slug] case-study pages
src/components/site/          header, footer, cards, tabs, Markdoc renderer
src/components/ui/            shadcn/ui components
src/app/globals.css           colour tokens (light + dark) and case-study typography
```

## Publish on GitHub Pages

The site deploys itself from GitHub. [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds static files and publishes them every time you push to `main`.

One-time setup:

1. Push this repo to GitHub.
2. On github.com, open the repo, go to **Settings → Pages**, and under "Build and deployment" set **Source** to **GitHub Actions**.
3. Open the **Actions** tab. When "Deploy to GitHub Pages" shows a green tick (about 1–2 minutes), the site is live at `https://faheemmuhamed.github.io/Portfolio/`.
   - If no run started, click "Deploy to GitHub Pages", then **Run workflow**.

After that, every push updates the live site. The workflow works out the URL itself, so a custom domain (Settings → Pages → Custom domain) needs no code changes.

GitHub Pages only hosts static files, so the CMS isn't part of the live site. Edit at `localhost:3000/keystatic`, then push.

To check the static build locally:

```bash
npm run build:static
```

The output goes to `out/`.

### Later: editing on the live site

To edit from a browser without running the project locally, host the site on a server platform such as [Vercel](https://vercel.com/new) (free) with `npm run build`, and switch Keystatic to GitHub mode:

- Set `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`.
- Visit `/keystatic`. It walks you through creating a GitHub App and gives you `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
- Add those as environment variables. After that, each save in the live CMS becomes a commit.

The repo is set in `keystatic.config.ts` (`FaheemMuhamed/Portfolio`).

## Notes

- CMS routes use `*.cms.tsx` / `*.cms.ts` file names. Static builds (`STATIC_EXPORT=true`) skip them; `npm run dev` and `npm run build` include them.
- Images in content use paths like `/work/...`. `src/lib/asset.ts` adds the `/Portfolio` sub-path on GitHub Pages.
- Logos live in `public/logos/`. An entry without a logo shows its initial.
- While `npm run dev` is running, edits to `src/app/globals.css` sometimes don't show up (a dev-server watcher quirk). Restart `npm run dev`. Content edits from the CMS aren't affected.
