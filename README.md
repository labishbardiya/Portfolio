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

Published projects are served from Supabase when the environment variables below
are configured. Local data remains as a safe fallback during development.

For the presentational parts that are still file-managed, use these focused files:

- `data/home.ts` — typewriter phrases, experience, and awards.
- `data/projects.ts` — local project fallback content and links.
- `app/writing/page.tsx` — writing archive entry point.
- `app/about/page.tsx` — personal introduction and currently section.
- `app/resume/page.tsx` — résumé display and download.
- `app/contact/page.tsx` — contact form UI.

Shared interface pieces live in `components/`, while `app/globals.css` owns the visual system. Keep the design minimal: one clear idea per section, generous whitespace, and no decoration that does not help the content.

## Portfolio Studio

`/studio` is a private content dashboard. It uses Supabase magic-link auth and
database-enforced Row Level Security; a signed-in account must also exist in
`public.portfolio_admins` before it can view drafts or change a project.

1. Add the production callback URL (`https://labishbardiya.com/auth/callback`)
   and the local callback URL (`http://localhost:3000/auth/callback`) under
   **Supabase → Authentication → URL Configuration**.
2. Open `/studio`, request a magic link, and complete sign-in.
3. Add that account's Auth user ID to `portfolio_admins` through the protected
   Supabase admin workflow. The dashboard will show the exact ID while access
   is pending.

Required local configuration (keep this file out of Git):

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...

SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=...
CONTACT_FROM="Labish Bardiya <hello@labishbardiya.com>"
CONTACT_TO=...
```

The public `NEXT_PUBLIC_` values are intentionally safe for browser use because
the database policies enforce which rows each visitor can read or edit. SMTP
credentials must remain server-only.

## Project structure

```text
app/          Routes, page layouts, and global styling
components/   Reusable interactive and display components
data/         Editable structured site content
lib/supabase/ Server and browser clients for cookie-based Studio auth
supabase/     Auditable database migrations and access policies
```

## Technology

- Next.js with the App Router
- React and TypeScript
- Font Awesome brand icons
- Plain CSS for a compact, dependency-light visual system
