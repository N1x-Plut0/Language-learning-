-- ============================================================
-- Maze Academy — Supabase schema
-- Run ONCE: Supabase dashboard → SQL Editor → New query → paste → Run.
-- ============================================================

-- One row of progress per user.
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  de_progress jsonb default '{}'::jsonb,
  fr_progress jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Row-Level Security: each user can only read/write their own row.
alter table public.profiles enable row level security;

drop policy if exists "own profile - select" on public.profiles;
create policy "own profile - select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "own profile - insert" on public.profiles;
create policy "own profile - insert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "own profile - update" on public.profiles;
create policy "own profile - update" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
