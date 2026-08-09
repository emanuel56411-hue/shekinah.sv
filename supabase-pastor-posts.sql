-- Publicaciones del pastor (versículos, anuncios, mensajes).
-- Ejecutar en el SQL Editor de Supabase.
-- IMPORTANTE: desactiva Google Translate en esta página antes de pegar.

create table if not exists public.app_secrets (
  key text primary key,
  value_hash text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.pastor_posts (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  post_type text not null default 'mensaje',
  reference text,
  is_active boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pastor_posts_type_check check (
    post_type in ('versiculo', 'anuncio', 'mensaje')
  ),
  constraint pastor_posts_content_check check (
    char_length(trim(content)) between 1 and 4000
  ),
  constraint pastor_posts_reference_check check (
    reference is null or char_length(trim(reference)) between 1 and 120
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

drop trigger if exists set_pastor_posts_updated_at on public.pastor_posts;

create trigger set_pastor_posts_updated_at
before update on public.pastor_posts
for each row
execute function public.set_updated_at();

drop view if exists public.public_pastor_posts;

-- security_invoker: usa permisos del usuario que consulta (evita el lint SECURITY DEFINER).
create view public.public_pastor_posts
with (security_invoker = true)
as
select
  id,
  content,
  post_type,
  reference,
  published_at
from public.pastor_posts
where is_active = true;

alter table public.pastor_posts enable row level security;
alter table public.app_secrets enable row level security;

revoke all on public.pastor_posts from anon, authenticated;
revoke all on public.app_secrets from anon, authenticated;
revoke all on public.public_pastor_posts from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.pastor_posts to anon, authenticated;
grant select on public.public_pastor_posts to anon, authenticated;

drop policy if exists "Anyone can read active pastor posts" on public.pastor_posts;

create policy "Anyone can read active pastor posts"
on public.pastor_posts
for select
to anon, authenticated
using (is_active = true);

create or replace function public.pastor_token_hash(p_token text)
returns text
language sql
immutable
as $$
  select md5('shekinah-pastor-v1:' || coalesce(p_token, ''));
$$;

insert into public.app_secrets (key, value_hash)
values ('pastor_admin', public.pastor_token_hash('shekinah'))
on conflict (key) do nothing;

create or replace function public.pastor_admin_ok(p_token text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_secrets
    where key = 'pastor_admin'
      and value_hash = public.pastor_token_hash(p_token)
  );
$$;

create or replace function public.verify_pastor_admin(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return public.pastor_admin_ok(p_token);
end;
$$;

create or replace function public.list_pastor_posts_admin(p_token text)
returns table (
  id uuid,
  content text,
  post_type text,
  reference text,
  is_active boolean,
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    p.content,
    p.post_type,
    p.reference,
    p.is_active,
    p.published_at,
    p.created_at,
    p.updated_at
  from public.pastor_posts p
  order by p.published_at desc, p.created_at desc;
end;
$$;

create or replace function public.create_pastor_post(
  p_token text,
  p_content text,
  p_post_type text default 'mensaje',
  p_reference text default null,
  p_is_active boolean default true,
  p_published_at timestamptz default now()
)
returns public.pastor_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  created public.pastor_posts;
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  insert into public.pastor_posts (
    content,
    post_type,
    reference,
    is_active,
    published_at
  )
  values (
    trim(p_content),
    p_post_type,
    nullif(trim(coalesce(p_reference, '')), ''),
    coalesce(p_is_active, true),
    coalesce(p_published_at, now())
  )
  returning * into created;

  return created;
end;
$$;

create or replace function public.update_pastor_post(
  p_token text,
  p_id uuid,
  p_content text,
  p_post_type text,
  p_reference text default null,
  p_is_active boolean default true,
  p_published_at timestamptz default null
)
returns public.pastor_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  updated public.pastor_posts;
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  update public.pastor_posts
  set
    content = trim(p_content),
    post_type = p_post_type,
    reference = nullif(trim(coalesce(p_reference, '')), ''),
    is_active = coalesce(p_is_active, true),
    published_at = coalesce(p_published_at, published_at)
  where id = p_id
  returning * into updated;

  if updated.id is null then
    raise exception 'not_found' using errcode = 'P0002';
  end if;

  return updated;
end;
$$;

create or replace function public.delete_pastor_post(
  p_token text,
  p_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  delete from public.pastor_posts where id = p_id;
  return found;
end;
$$;

create or replace function public.set_pastor_admin_password(
  p_current_token text,
  p_new_token text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pastor_admin_ok(p_current_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  if char_length(trim(p_new_token)) < 8 then
    raise exception 'password_too_short' using errcode = '22023';
  end if;

  insert into public.app_secrets (key, value_hash, updated_at)
  values ('pastor_admin', public.pastor_token_hash(trim(p_new_token)), now())
  on conflict (key) do update
  set
    value_hash = excluded.value_hash,
    updated_at = now();

  return true;
end;
$$;

revoke all on function public.pastor_token_hash(text) from public;
revoke all on function public.pastor_admin_ok(text) from public;
revoke all on function public.verify_pastor_admin(text) from public;
revoke all on function public.list_pastor_posts_admin(text) from public;
revoke all on function public.create_pastor_post(text, text, text, text, boolean, timestamptz) from public;
revoke all on function public.update_pastor_post(text, uuid, text, text, text, boolean, timestamptz) from public;
revoke all on function public.delete_pastor_post(text, uuid) from public;
revoke all on function public.set_pastor_admin_password(text, text) from public;

grant execute on function public.verify_pastor_admin(text) to anon, authenticated;
grant execute on function public.list_pastor_posts_admin(text) to anon, authenticated;
grant execute on function public.create_pastor_post(text, text, text, text, boolean, timestamptz) to anon, authenticated;
grant execute on function public.update_pastor_post(text, uuid, text, text, text, boolean, timestamptz) to anon, authenticated;
grant execute on function public.delete_pastor_post(text, uuid) to anon, authenticated;
grant execute on function public.set_pastor_admin_password(text, text) to anon, authenticated;
