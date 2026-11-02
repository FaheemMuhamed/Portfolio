# Content format

All site content lives in this repo as plain files. Edit it in the CMS at `/keystatic` (run `npm run dev` first), or by hand.

```
content/
  profile.yaml              name, role, bio, links
  experience/<slug>.yaml    one file per role
  projects/<slug>.mdoc      one file per project (frontmatter + Markdoc body)
public/work/<slug>/         images for that project
```

## Project file

`content/projects/<slug>.mdoc`. The file name is the URL slug (`/work/<slug>`).

```yaml
---
title: Knoweb3
summary: A Web3 learning app that makes the basics feel less intimidating.
cover: /work/knoweb3/cover.webp
kind: case-study          # case-study | playground | side-project
year: '2022'
client: IIT Guwahati coursework   # company / client / context
role: UX research, UI design
duration: 4 weeks
team:
  - Harinandh V R
  - Harinandanan K M
tools:
  - Figma
  - Photoshop
tags:
  - UI/UX
  - Web3
featured: true
order: 3                  # lower shows first
liveUrl: ''
behanceUrl: https://www.behance.net/gallery/151329895/Knoweb3-A-Web3-Learning-platform
---
```

All values are strings except `featured` (boolean), `order` (integer) and the arrays.

## Body (Markdoc)

Plain Markdown, plus a few tags. Sections are `##` headings; use `###` sparingly.

Image with caption (the quoted title becomes the caption):

```md
![Three onboarding screens](/work/knoweb3/onboarding.webp "Onboarding, first pass")
```

Gallery, 2 or 3 columns. Only images inside:

```md
{% gallery columns=2 %}
![Home](/work/knoweb3/home.webp)

![Lesson](/work/knoweb3/lesson.webp)
{% /gallery %}
```

Callout, for a key insight or quote:

```md
{% callout %}
Most people we spoke to had heard of Web3, but couldn't explain what it was.
{% /callout %}
```

Stats row:

```md
{% stats %}
{% stat value="300+" label="3D scans optimised" /%}
{% stat value="4 weeks" label="Research to final UI" /%}
{% /stats %}
```

## Images

- WebP, max 1600px wide, quality ~80. Animated work can be animated WebP.
- Name files by what they show (`research-board.webp`, `final-screens.webp`), not by number.
- `cover.webp` is the card thumbnail and page hero, about 16:10.
