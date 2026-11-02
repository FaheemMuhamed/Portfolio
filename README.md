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
keystatic.config.ts           CMS schema
src/app/(site)/               home page and /work/[slug] case-study pages
src/components/site/          header, footer, cards, tabs, Markdoc renderer
src/components/ui/            shadcn/ui components
src/app/globals.css           colour tokens (light + dark) and case-study typography
```

## Deploy later

Nothing is deployed yet. When you're ready:

1. Import this repo on [Vercel](https://vercel.com/new) (free). The defaults work.
2. Set `NEXT_PUBLIC_SITE_URL` to the live URL, for correct sitemap and share links.
3. To edit content on the live site rather than locally, switch Keystatic to GitHub mode:
   - Set `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` in Vercel.
   - Run `npm run dev` with that variable set locally once, and open `/keystatic`. It walks you through creating a GitHub App and gives you `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
   - Add those to Vercel too.
   - After that, `your-site.com/keystatic` asks you to sign in with GitHub. Each save becomes a commit, and Vercel redeploys.

The repo is set in `keystatic.config.ts` (`FaheemMuhamed/Portfolio`).
