-- A focused publishing model: one owner, drafts before publication, no public edits.
create table public.portfolio_writing_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 180),
  subtitle text not null default '' check (char_length(subtitle) <= 280),
  excerpt text not null default '' check (char_length(excerpt) <= 500),
  body_markdown text not null default '' check (char_length(body_markdown) <= 50000),
  external_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index portfolio_writing_posts_public_order
  on public.portfolio_writing_posts (status, published_at desc, sort_order);

create trigger set_portfolio_writing_posts_updated_at
before update on public.portfolio_writing_posts
for each row execute function public.set_updated_at();

alter table public.portfolio_writing_posts enable row level security;

grant select on public.portfolio_writing_posts to anon;
grant select, insert, update, delete on public.portfolio_writing_posts to authenticated;

create policy "Public reads published writing" on public.portfolio_writing_posts
for select to anon
using (status = 'published');

create policy "Authenticated reads published writing or admin content" on public.portfolio_writing_posts
for select to authenticated
using (status = 'published' or (select private.is_portfolio_admin()));

create policy "Admins insert writing" on public.portfolio_writing_posts
for insert to authenticated
with check ((select private.is_portfolio_admin()));

create policy "Admins update writing" on public.portfolio_writing_posts
for update to authenticated
using ((select private.is_portfolio_admin()))
with check ((select private.is_portfolio_admin()));

create policy "Admins delete writing" on public.portfolio_writing_posts
for delete to authenticated
using ((select private.is_portfolio_admin()));
