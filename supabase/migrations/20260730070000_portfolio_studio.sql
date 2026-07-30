-- Portfolio Studio foundation. Run this migration in a new Supabase project.
-- The public site can read published records only; authenticated Studio admins
-- must appear in portfolio_admins before they can write anything.

create table public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.portfolio_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to authenticated;

create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  number smallint not null check (number between 1 and 99),
  stage text not null check (char_length(stage) between 1 and 40),
  description text not null check (char_length(description) between 1 and 500),
  tags text[] not null default '{}',
  links jsonb not null default '[]'::jsonb check (jsonb_typeof(links) = 'array'),
  cover_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio_timeline_entries (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('experience', 'award')),
  period text not null check (char_length(period) between 1 and 40),
  title text not null check (char_length(title) between 1 and 120),
  organisation text not null check (char_length(organisation) between 1 and 180),
  description text not null check (char_length(description) between 1 and 500),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio_settings (
  id boolean primary key default true check (id),
  typewriter_lines text[] not null default '{}',
  social_links jsonb not null default '[]'::jsonb check (jsonb_typeof(social_links) = 'array'),
  visual_theme jsonb not null default '{}'::jsonb check (jsonb_typeof(visual_theme) = 'object'),
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);

create index portfolio_projects_public_order on public.portfolio_projects (status, sort_order);
create index portfolio_timeline_entries_public_order on public.portfolio_timeline_entries (status, category, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_portfolio_projects_updated_at
before update on public.portfolio_projects
for each row execute function public.set_updated_at();

create trigger set_portfolio_timeline_entries_updated_at
before update on public.portfolio_timeline_entries
for each row execute function public.set_updated_at();

create trigger set_portfolio_settings_updated_at
before update on public.portfolio_settings
for each row execute function public.set_updated_at();

alter table public.portfolio_admins enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_timeline_entries enable row level security;
alter table public.portfolio_settings enable row level security;

-- SQL-created tables are not necessarily exposed to the Data API by default.
-- Grant the minimum table privileges; RLS below still decides which rows exist.
grant usage on schema public to anon, authenticated;
grant select on public.portfolio_projects, public.portfolio_timeline_entries, public.portfolio_settings to anon;
grant select, insert, update, delete on public.portfolio_projects, public.portfolio_timeline_entries, public.portfolio_settings to authenticated;
grant select on public.portfolio_admins to authenticated;

create policy "Admins can see their own access" on public.portfolio_admins
for select to authenticated using ((select auth.uid()) = user_id);

create policy "Published projects are public" on public.portfolio_projects
for select to anon, authenticated using (status = 'published');

create policy "Admins manage projects" on public.portfolio_projects
for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Published timeline entries are public" on public.portfolio_timeline_entries
for select to anon, authenticated using (status = 'published');

create policy "Admins manage timeline entries" on public.portfolio_timeline_entries
for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Published settings are public" on public.portfolio_settings
for select to anon, authenticated using (is_published);

create policy "Admins manage settings" on public.portfolio_settings
for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

insert into public.portfolio_projects (name, slug, number, stage, description, tags, links, status, featured, sort_order, published_at)
values
  ('Bruxlix', 'bruxlix', 1, 'Building', 'A patent-pending ML wearable for detecting sleep bruxism at home.', array['Healthtech', 'ML', 'Wearables'], '[{"label":"Code","href":"https://github.com/labishbardiya/Bruxlix"},{"label":"Live","href":"https://bruxlix.vercel.app"}]', 'published', true, 10, now()),
  ('CureNet', 'curenet', 2, 'Researching', 'Offline-first clinical intelligence that turns handwritten records into FHIR R4 data.', array['Healthtech', 'Edge AI', 'FHIR R4'], '[{"label":"Code","href":"https://github.com/labishbardiya/CureNet"}]', 'published', true, 20, now()),
  ('LeverageAI', 'leverageai', 3, 'Shipped', 'An AI negotiator for high-stakes services: parallel quotes, honest evidence, clearer decisions.', array['Voice AI', 'Agents', 'Negotiation'], '[{"label":"Code","href":"https://github.com/labishbardiya/LeverageAI"},{"label":"Live","href":"https://leverageai-tawny.vercel.app"}]', 'published', true, 30, now()),
  ('Hackotomate', 'hackotomate', 4, 'Shipped', 'An AI-powered web aggregator that discovers hackathons from public directories.', array['Agents', 'Research', 'Automation'], '[{"label":"Code","href":"https://github.com/labishbardiya/hackotomate"}]', 'published', false, 40, now());

insert into public.portfolio_settings (typewriter_lines, social_links, visual_theme, is_published)
values (
  array['Curious by default, building by instinct.', 'Thinking in systems, building with heart.', 'Finding the human side of technology.', 'Turning research into things people can use.', 'Chasing ideas worth making real.', 'Somewhere between code, care, and curiosity.', 'Learning in public, making things real.'],
  '[{"label":"LinkedIn","href":"https://linkedin.com/in/labishbardiya"},{"label":"X","href":"https://x.com/labishbardiya"},{"label":"GitHub","href":"https://github.com/labishbardiya"},{"label":"YouTube","href":"https://youtube.com/@Labishbardiya"},{"label":"Instagram","href":"https://www.instagram.com/labish.bardiya/"}]',
  '{"preset":"dark-lab","accent":"#d0fb75"}',
  true
);
