-- Keep one SELECT policy per role/action. Authenticated Studio admins may read
-- all content; everyone else can still read only the published public slice.

drop policy "Published projects are public" on public.portfolio_projects;
drop policy "Admins read all projects" on public.portfolio_projects;
create policy "Public reads published projects" on public.portfolio_projects
for select to anon
using (status = 'published');
create policy "Authenticated reads published projects or admin content" on public.portfolio_projects
for select to authenticated
using (status = 'published' or (select private.is_portfolio_admin()));

drop policy "Published timeline entries are public" on public.portfolio_timeline_entries;
drop policy "Admins read all timeline entries" on public.portfolio_timeline_entries;
create policy "Public reads published timeline entries" on public.portfolio_timeline_entries
for select to anon
using (status = 'published');
create policy "Authenticated reads published timeline entries or admin content" on public.portfolio_timeline_entries
for select to authenticated
using (status = 'published' or (select private.is_portfolio_admin()));

drop policy "Published settings are public" on public.portfolio_settings;
drop policy "Admins read all settings" on public.portfolio_settings;
create policy "Public reads published settings" on public.portfolio_settings
for select to anon
using (is_published);
create policy "Authenticated reads published settings or admin content" on public.portfolio_settings
for select to authenticated
using (is_published or (select private.is_portfolio_admin()));
