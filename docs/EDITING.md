# Editing the portfolio

You edit content in a visual editor (the CMS) on your own computer, check it in the browser, then push to GitHub, which updates the live site in about 2 minutes.

```
Open the CMS  →  edit and Save  →  check localhost:3000  →  Commit + Push in GitHub Desktop  →  live
```

## 1. Open the CMS

1. Open **GitHub Desktop** and choose the **faheem-portfolio** repository.
2. Click **Repository → Open in Terminal**.
3. The first time only, install the project:
   ```bash
   npm install
   ```
4. Start it:
   ```bash
   npm run dev
   ```
5. Open **http://localhost:3000/keystatic**. That's the CMS. Your site is at **http://localhost:3000**.

Keep the Terminal window open while you edit. When you're done, press `Ctrl + C` in it to stop.

## 2. What's in the CMS

The left sidebar has three sections:

| Section | What it controls |
|---|---|
| **Profile** | Name, role, location, avatar, intro, "Outside work" text, "Available for freelance", email, links (LinkedIn, Behance…), resume, education, certifications |
| **Projects** | Every case study, side project and playground piece |
| **Experience** | Each role in the Experience list |

After any change, click **Save** at the top right. The site at localhost:3000 updates right away; refresh it to check.

## 3. Common tasks

### Change your intro, links or availability
**Profile** → edit the field → **Save**.
- **Links:** use **Add** to add one; drag the handle to reorder.
- **Available for freelance:** untick it to hide the green dot line.
- **Resume:** **Choose file**, pick a PDF. A "Resume" link appears next to your other links.

### Add a new job
**Experience** → **Add** (top right):
- **Company**, **Role**, **Location**
- **Logo**: a square image, about 160×160. Leave it empty to show the company's initial.
- **Start**, for example `Aug 2025`. Leave **End** empty to show "Present".
- **Description**: one line.
- **Company URL**: makes the whole row clickable.
- **Order**: lower numbers show first. Give your newest job `1` and add 1 to the others.

Then **Save**.

### Add a new case study
**Projects** → **Add**:

| Field | What to put |
|---|---|
| **Title** | Project name. The URL (slug) is made from it automatically. |
| **Summary** | One or two sentences, shown on the card and under the title. |
| **Cover** | 16:10 image, ideally 1600×1000 WebP or JPG. |
| **Kind** | *Case study* → Work tab · *Side project* → Side projects tab · *Playground* → Playground tab |
| **Year**, **Client / context**, **Role**, **Duration** | Shown in the case-study header. |
| **Team**, **Tools**, **Tags** | Click **Add** for each item. |
| **Order** | Position in its tab; lower numbers show first. |
| **Hide behind Show more** | Tuck it under the "Show other works" button. |
| **Coming soon** | Shows the card with a "Coming soon" label and no page yet. |
| **Live URL**, **Behance URL** | Adds "Visit site" / "View on Behance" buttons. |

**Writing the body** (the big editor):
- Use **Heading 2** for each section (Overview, The problem, Process…). These become the "On this page" list.
- Type normally for paragraphs. Bold, italic and links are in the toolbar.
- **Images:** use the **+** (insert) menu → **Image**, or drag a file in. The image's *title* becomes its caption. Every image opens large when clicked.
- **+** menu → **Gallery** shows 2 or 3 images side by side. Set **Columns** to 2 or 3, then put images inside.
- **+** menu → **Callout** gives a boxed highlight for a key insight.
- **+** menu → **Stats**, then add **Stat** items, each with a **Value** and a **Label**. Numbers like `300+` or `6 weeks` count up as they scroll in.

**Save** when done.

### Reorder, hide or remove projects
- **Reorder:** change **Order** numbers. Tessell is `0`, so it's always first.
- **Hide behind the button:** tick **Hide behind Show more**.
- **Remove:** open the project, click the **⋯** menu at the top → **Delete**. Its images stay in `public/work/<slug>/`, so you can delete that folder too.

### Change the avatar
**Profile** → **Avatar** → **Choose file**, a square photo of at least 256×256. Hovering it on the site still shows the dither effect.

## 4. Publish

1. In **GitHub Desktop**, the files you changed are listed on the left.
2. Write a short summary at the bottom left, for example "Add new case study".
3. Click **Commit to main**, then **Push origin**.
4. In the **Actions** tab of the repo on github.com, "Deploy to GitHub Pages" turns green after about 2 minutes. The live site is updated: https://faheemmuhamed.github.io/Portfolio/

## 5. Tips

- **Undo before publishing:** in GitHub Desktop, right-click a changed file → **Discard changes**.
- **Image sizes:** keep covers around 1600×1000 and body images at most 1600px wide. WebP keeps them light; most image tools can export it.
- **Something looks off locally:** stop the Terminal (`Ctrl + C`) and run `npm run dev` again.
- **The live site isn't updating:** open the repo's **Actions** tab. A red run means the build failed. Open it to see why, or ask for help with the error shown there.
