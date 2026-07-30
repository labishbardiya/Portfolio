# Portfolio Studio setup

Portfolio Studio uses Supabase so public visitors can read only published work while you manage drafts privately from any device.

## Connect the hosted project

1. Create a Supabase project and run [`supabase/migrations/20260730070000_portfolio_studio.sql`](../supabase/migrations/20260730070000_portfolio_studio.sql) in its SQL Editor.
2. Copy the project URL and publishable key into `.env.local`, using `.env.example` as the template.
3. Restart the site. Projects will now load from the hosted database; the local project list is only a development fallback.

## Protect Studio access

The next Studio feature will use Supabase Auth. After signing in for the first time, add your Supabase Auth user ID to the database:

```sql
insert into public.portfolio_admins (user_id)
values ('your-auth-user-id');
```

Only IDs in `portfolio_admins` can create, edit, archive, or publish records. The browser can never access drafts because Row Level Security enforces that rule in the database.

## What this migration creates

- `portfolio_projects`: cards, links, tags, order, featured flag, and draft/published/archive state.
- `portfolio_timeline_entries`: experience and awards.
- `portfolio_settings`: hero typewriter copy, social links, and visual-theme controls.
- `portfolio_admins`: the small allow-list that gates Studio editing.
