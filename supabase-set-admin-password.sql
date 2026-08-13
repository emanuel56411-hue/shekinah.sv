-- Cambia la contraseña del administrador pastoral.
-- 1. Reemplaza CAMBIA_ESTA_CONTRASENA por la contraseña nueva.
-- 2. Ejecuta este SQL en Supabase SQL Editor.
-- 3. No subas este archivo con una contraseña real escrita.

create extension if not exists pgcrypto;

create or replace function public.pastor_token_hash(p_token text)
returns text
language sql
as $$
  select crypt(coalesce(p_token, ''), gen_salt('bf'));
$$;

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
      and crypt(coalesce(p_token, ''), value_hash) = value_hash
  );
$$;

insert into public.app_secrets (key, value_hash, updated_at)
values ('pastor_admin', public.pastor_token_hash('CAMBIA_ESTA_CONTRASENA'), now())
on conflict (key) do update
set
  value_hash = excluded.value_hash,
  updated_at = now();
