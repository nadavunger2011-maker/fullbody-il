alter table public.blog_posts
  add column if not exists topic_key text,
  add column if not exists proposed_slug text,
  add column if not exists noindex boolean not null default false,
  add column if not exists merged_into text;

create table if not exists public.blog_redirects (
  old_slug text primary key,
  new_slug text not null,
  reason text not null default 'merge',
  created_at timestamptz not null default now()
);

grant select on public.blog_redirects to anon, authenticated;
grant all on public.blog_redirects to service_role;

alter table public.blog_redirects enable row level security;

drop policy if exists "Public can read blog redirects" on public.blog_redirects;
create policy "Public can read blog redirects"
  on public.blog_redirects for select
  to anon, authenticated
  using (true);

create index if not exists blog_posts_topic_key_idx on public.blog_posts(topic_key);