-- Payments: Stripe Checkout sessions that topped up a balance.
create table public.payments (
  id text primary key, -- Stripe Checkout Session id
  user_id uuid not null references auth.users (id) on delete cascade,
  pack text not null,
  credits int not null check (credits > 0),
  amount_cents int not null,
  currency text not null,
  created_at timestamptz not null default now()
);

create index payments_user_created_idx on public.payments (user_id, created_at desc);

alter table public.payments enable row level security;
create policy "own payments" on public.payments
  for select to authenticated using (user_id = (select auth.uid()));
revoke insert, update, delete, truncate on public.payments from anon, authenticated;
revoke all on public.payments from anon;

-- Called by the Stripe webhook. Idempotent: Stripe may deliver the same event
-- more than once, but each session adds credits exactly once.
create function public.grant_credits(
  p_session_id text, p_user uuid, p_pack text, p_credits int, p_amount_cents int, p_currency text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.payments (id, user_id, pack, credits, amount_cents, currency)
  values (p_session_id, p_user, p_pack, p_credits, p_amount_cents, p_currency)
  on conflict (id) do nothing;
  if not found then
    return false;
  end if;
  update public.profiles set credits = credits + p_credits where id = p_user;
  return true;
end;
$$;

revoke execute on function public.grant_credits(text, uuid, text, int, int, text) from public, anon, authenticated;
grant execute on function public.grant_credits(text, uuid, text, int, int, text) to service_role;
