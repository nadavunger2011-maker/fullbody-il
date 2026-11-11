create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users can read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where id in ('7e31f1ea-afb3-4bcd-a5ca-97495b3c3846','4efda212-f8bd-4e0e-987a-92611dd1f8c4');

-- ad_spend
drop policy "Authenticated users can manage ad_spend" on public.ad_spend;
create policy "Admins manage ad_spend" on public.ad_spend for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
-- app_settings
drop policy "Authenticated users can insert settings" on public.app_settings;
drop policy "Authenticated users can read settings" on public.app_settings;
drop policy "Authenticated users can update settings" on public.app_settings;
create policy "Admins manage settings" on public.app_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
-- social_posts
drop policy "Authenticated users can manage social posts" on public.social_posts;
create policy "Admins manage social posts" on public.social_posts for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
-- email_sends
drop policy "Authenticated users can read email sends" on public.email_sends;
create policy "Admins read email sends" on public.email_sends for select to authenticated using (public.has_role(auth.uid(),'admin'));
-- recipes
drop policy "Authenticated users can delete recipes" on public.recipes;
drop policy "Authenticated users can insert recipes" on public.recipes;
drop policy "Authenticated users can update recipes" on public.recipes;
create policy "Admins manage recipes" on public.recipes for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
-- leads
drop policy "Authenticated users can read leads" on public.leads;
drop policy "Lead can touch last_seen_at" on public.leads;
create policy "Admins read leads" on public.leads for select to authenticated using (public.has_role(auth.uid(),'admin'));
-- daily_checkins
drop policy "Anyone can insert checkins" on public.daily_checkins;
drop policy "Anyone can read checkins" on public.daily_checkins;
drop policy "Anyone can update checkins" on public.daily_checkins;
create policy "Admins read checkins" on public.daily_checkins for select to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.get_lead_checkins(_lead_id uuid)
returns table (checkin_date date, shake_done boolean, workout_done boolean, diet_done boolean)
language sql stable security definer set search_path = public
as $$ select c.checkin_date, c.shake_done, c.workout_done, c.diet_done from public.daily_checkins c
  where c.lead_id = _lead_id order by c.checkin_date desc limit 400 $$;

create or replace function public.save_lead_checkin(_lead_id uuid, _checkin_date date, _shake_done boolean, _workout_done boolean, _diet_done boolean)
returns void language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.leads where id = _lead_id) then raise exception 'unknown lead'; end if;
  if _checkin_date < current_date - 2 or _checkin_date > current_date + 1 then raise exception 'invalid date'; end if;
  insert into public.daily_checkins (lead_id, checkin_date, shake_done, workout_done, diet_done)
  values (_lead_id, _checkin_date, _shake_done, _workout_done, _diet_done)
  on conflict (lead_id, checkin_date) do update set shake_done = excluded.shake_done, workout_done = excluded.workout_done, diet_done = excluded.diet_done;
end $$;
grant execute on function public.get_lead_checkins(uuid) to anon, authenticated;
grant execute on function public.save_lead_checkin(uuid, date, boolean, boolean, boolean) to anon, authenticated;