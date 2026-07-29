# Labish Bardiya — Portfolio

The personal portfolio website for Labish Bardiya. It is designed to be restrained, text-first, and easy to keep current as projects, writing, and milestones evolve.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser. Before publishing any changes, run:

```bash
npm run lint
npm run build
```

## Updating the site

The content that will change most often lives in deliberately small, focused files:

- `data/home.ts` — typewriter phrases, experience, and awards.
- `app/projects/page.tsx` — project content and links.
- `app/writing/page.tsx` — writing archive entry point.
- `app/about/page.tsx` — personal introduction and currently section.
- `app/resume/page.tsx` — résumé display and download.
- `app/contact/page.tsx` — contact form UI.

Shared interface pieces live in `components/`, while `app/globals.css` owns the visual system. Keep the design minimal: one clear idea per section, generous whitespace, and no decoration that does not help the content.

## Project structure

```text
app/          Routes, page layouts, and global styling
components/   Reusable interactive and display components
data/         Editable structured site content
```

## Technology

- Next.js with the App Router
- React and TypeScript
- Font Awesome brand icons
- Plain CSS for a compact, dependency-light visual system
