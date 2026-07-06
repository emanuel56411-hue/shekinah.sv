-- Supabase setup for Iglesia Bautista Shekinah help requests.
-- Run this file in the Supabase SQL editor for the target project.

create extension if not exists pgcrypto;

create table if not exists public.help_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_name text,
  phone text,
  email text,
  help_type text not null default 'General',
  message_private text not null,
  public_message text,
  status text not null default 'pending',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint help_requests_status_check check (
    status in ('pending', 'approved', 'in_process', 'resolved', 'rejected')
  ),
  constraint help_requests_publication_check check (
    (is_public = false and published_at is null)
    or (is_public = true and published_at is not null and display_name is not null and public_message is not null)
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_help_requests_updated_at on public.help_requests;

create trigger set_help_requests_updated_at
before update on public.help_requests
for each row
execute function public.set_updated_at();

drop view if exists public.public_help_requests;

create view public.public_help_requests
with (security_barrier = true)
as
select
  id,
  display_name,
  help_type,
  public_message,
  status,
  published_at
from public.help_requests
where
  is_public = true
  and status in ('approved', 'in_process')
  and published_at >= now() - interval '14 days';

alter table public.help_requests enable row level security;

drop policy if exists "Anyone can submit pending help requests" on public.help_requests;

create policy "Anyone can submit pending help requests"
on public.help_requests
for insert
to anon, authenticated
with check (
  status = 'pending'
  and is_public = false
  and display_name is null
  and public_message is null
  and published_at is null
);

revoke all on public.help_requests from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant insert on public.help_requests to anon, authenticated;

revoke all on public.public_help_requests from anon, authenticated;
grant select on public.public_help_requests to anon, authenticated;

-- The donations/help coordinator can approve requests in Supabase Dashboard:
-- 1. Review private fields in public.help_requests.
-- 2. Set display_name and public_message to redacted public values.
-- 3. Set status to 'approved' or 'in_process'.
-- 4. Set is_public = true and published_at = now().
