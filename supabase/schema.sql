-- Moonii onboarding profile storage.
-- Run this once in the Supabase SQL Editor for the project.

create table if not exists public.user_onboarding (
  user_id uuid primary key references auth.users (id) on delete cascade,
  responses jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_onboarding enable row level security;

grant select, insert, update on table public.user_onboarding to authenticated;

drop policy if exists "Users can read their own onboarding" on public.user_onboarding;
create policy "Users can read their own onboarding"
  on public.user_onboarding
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own onboarding" on public.user_onboarding;
create policy "Users can create their own onboarding"
  on public.user_onboarding
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own onboarding" on public.user_onboarding;
create policy "Users can update their own onboarding"
  on public.user_onboarding
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
