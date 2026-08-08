create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  checkin_date date not null,
  shake_done boolean not null default false,
  workout_done boolean not null default false,
  diet_done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lead_id, checkin_date)
);

grant select, insert, update on public.daily_checkins to anon;
grant select, insert, update on public.daily_checkins to authenticated;
grant all on public.daily_checkins to service_role;

alter table public.daily_checkins enable row level security;

create policy "Anyone can read checkins" on public.daily_checkins for select using (true);
create policy "Anyone can insert checkins" on public.daily_checkins for insert with check (true);
create policy "Anyone can update checkins" on public.daily_checkins for update using (true) with check (true);

create trigger trg_daily_checkins_updated_at
before update on public.daily_checkins
for each row execute function public.update_reviews_updated_at();