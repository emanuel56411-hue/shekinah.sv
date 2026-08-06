-- CMS básico del sitio: horarios y calendario.
-- Ejecuta este archivo en Supabase SQL Editor después de tener instalado
-- supabase-pastor-posts.sql, porque reutiliza pastor_admin_ok(p_token).

create extension if not exists pgcrypto;

create table if not exists public.site_schedules (
  id text primary key default gen_random_uuid()::text,
  day_of_week integer not null check (day_of_week between 0 and 6),
  day_label text not null,
  title text not null check (char_length(title) between 1 and 120),
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_calendar_events (
  id text primary key default gen_random_uuid()::text,
  event_date date not null,
  title text not null check (char_length(title) between 1 and 140),
  event_time text not null default '',
  description text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_schedules enable row level security;
alter table public.site_calendar_events enable row level security;

create or replace view public.public_site_schedules as
select
  id,
  day_of_week,
  day_label,
  title,
  start_time,
  end_time,
  sort_order
from public.site_schedules
where is_active = true
order by sort_order asc, day_of_week asc, start_time asc;

create or replace view public.public_site_calendar_events as
select
  id,
  event_date,
  title,
  event_time,
  description,
  sort_order
from public.site_calendar_events
where is_active = true
order by event_date asc, sort_order asc, event_time asc;

grant select on public.public_site_schedules to anon, authenticated;
grant select on public.public_site_calendar_events to anon, authenticated;

insert into public.site_schedules (id, day_of_week, day_label, title, start_time, end_time, sort_order)
values
  ('tuesday', 2, 'Martes', 'Estudio exegético', '19:00', '20:30', 10),
  ('thursday', 4, 'Jueves', 'Estudio bíblico', '19:00', '20:30', 20),
  ('saturday', 6, 'Sábado', 'Culto de jóvenes', '16:30', '18:00', 30),
  ('sunday1', 0, 'Domingo', 'Primer culto devocional', '08:30', '09:40', 40),
  ('sunday2', 0, 'Domingo', 'Segundo culto devocional', '10:00', '11:30', 50)
on conflict (id) do nothing;

insert into public.site_calendar_events (id, event_date, title, event_time, description, sort_order)
values
  ('calendar-2026-07-28-study', '2026-07-28', 'Estudio exegético', '7:00 p.m. - 8:30 p.m.', 'Reunión de estudio bíblico los martes.', 10),
  ('calendar-2026-07-30-study', '2026-07-30', 'Estudio bíblico', '7:00 p.m. - 8:30 p.m.', 'Estudio bíblico de jueves en la iglesia.', 20),
  ('calendar-2026-08-01-youth', '2026-08-01', 'Culto de jóvenes', '4:30 p.m. - 6:00 p.m.', 'Culto especial de jóvenes el sábado.', 30),
  ('calendar-2026-08-02-sunday1', '2026-08-02', 'Primer culto devocional', '8:30 a.m. - 9:40 a.m.', 'Primer servicio dominical.', 40),
  ('calendar-2026-08-02-sunday2', '2026-08-02', 'Segundo culto devocional', '10:00 a.m. - 11:30 a.m.', 'Segundo servicio dominical.', 50),
  ('calendar-2026-08-04-study', '2026-08-04', 'Estudio exegético', '7:00 p.m. - 8:30 p.m.', 'Reunión de estudio bíblico los martes.', 60),
  ('calendar-2026-08-06-study', '2026-08-06', 'Estudio bíblico', '7:00 p.m. - 8:30 p.m.', 'Estudio bíblico de jueves en la iglesia.', 70),
  ('calendar-2026-08-08-youth', '2026-08-08', 'Culto de jóvenes', '4:30 p.m. - 6:00 p.m.', 'Culto especial de jóvenes el sábado.', 80),
  ('calendar-2026-08-09-sunday1', '2026-08-09', 'Primer culto devocional', '8:30 a.m. - 9:40 a.m.', 'Primer servicio dominical.', 90),
  ('calendar-2026-08-09-sunday2', '2026-08-09', 'Segundo culto devocional', '10:00 a.m. - 11:30 a.m.', 'Segundo servicio dominical.', 100),
  ('calendar-2026-09-15-prayer', '2026-09-15', 'Noche de oración', '7:00 p.m.', 'Tiempo especial de oración por la iglesia y la comunidad.', 110),
  ('calendar-2026-12-24-christmas', '2026-12-24', 'Culto de Navidad', '6:00 p.m.', 'Celebración navideña en familia.', 120)
on conflict (id) do nothing;

create or replace function public.list_site_schedules_admin(p_token text)
returns setof public.site_schedules
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  return query
  select *
  from public.site_schedules
  order by sort_order asc, day_of_week asc, start_time asc;
end;
$$;

create or replace function public.upsert_site_schedule(
  p_token text,
  p_id text,
  p_day_of_week integer,
  p_day_label text,
  p_title text,
  p_start_time time,
  p_end_time time,
  p_is_active boolean,
  p_sort_order integer
)
returns public.site_schedules
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text := coalesce(nullif(p_id, ''), gen_random_uuid()::text);
  v_row public.site_schedules;
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  insert into public.site_schedules (
    id, day_of_week, day_label, title, start_time, end_time, is_active, sort_order, updated_at
  )
  values (
    v_id, p_day_of_week, trim(p_day_label), trim(p_title), p_start_time, p_end_time,
    coalesce(p_is_active, true), coalesce(p_sort_order, 0), now()
  )
  on conflict (id) do update set
    day_of_week = excluded.day_of_week,
    day_label = excluded.day_label,
    title = excluded.title,
    start_time = excluded.start_time,
    end_time = excluded.end_time,
    is_active = excluded.is_active,
    sort_order = excluded.sort_order,
    updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.delete_site_schedule(p_token text, p_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  delete from public.site_schedules where id = p_id;
  return found;
end;
$$;

create or replace function public.list_site_calendar_events_admin(p_token text)
returns setof public.site_calendar_events
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  return query
  select *
  from public.site_calendar_events
  order by event_date asc, sort_order asc, event_time asc;
end;
$$;

create or replace function public.upsert_site_calendar_event(
  p_token text,
  p_id text,
  p_event_date date,
  p_title text,
  p_event_time text,
  p_description text,
  p_is_active boolean,
  p_sort_order integer
)
returns public.site_calendar_events
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text := coalesce(nullif(p_id, ''), gen_random_uuid()::text);
  v_row public.site_calendar_events;
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  insert into public.site_calendar_events (
    id, event_date, title, event_time, description, is_active, sort_order, updated_at
  )
  values (
    v_id, p_event_date, trim(p_title), trim(coalesce(p_event_time, '')),
    trim(coalesce(p_description, '')), coalesce(p_is_active, true), coalesce(p_sort_order, 0), now()
  )
  on conflict (id) do update set
    event_date = excluded.event_date,
    title = excluded.title,
    event_time = excluded.event_time,
    description = excluded.description,
    is_active = excluded.is_active,
    sort_order = excluded.sort_order,
    updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.delete_site_calendar_event(p_token text, p_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  delete from public.site_calendar_events where id = p_id;
  return found;
end;
$$;

grant execute on function public.list_site_schedules_admin(text) to anon, authenticated;
grant execute on function public.upsert_site_schedule(text, text, integer, text, text, time, time, boolean, integer) to anon, authenticated;
grant execute on function public.delete_site_schedule(text, text) to anon, authenticated;
grant execute on function public.list_site_calendar_events_admin(text) to anon, authenticated;
grant execute on function public.upsert_site_calendar_event(text, text, date, text, text, text, boolean, integer) to anon, authenticated;
grant execute on function public.delete_site_calendar_event(text, text) to anon, authenticated;
