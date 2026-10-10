-- Уникализатор: профили с балансом, очередь задач, хранилище видео.

-- ---------- профили ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  credits int not null default 3 check (credits >= 0),
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- задачи ----------
create type public.job_status as enum ('queued', 'processing', 'done', 'failed', 'expired');
create type public.job_strength as enum ('light', 'medium', 'strong');

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status public.job_status not null default 'queued',
  strength public.job_strength not null default 'medium',
  original_name text not null,
  input_path text not null,
  output_path text,
  progress real not null default 0,
  params jsonb,
  source_duration real,
  error text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  expires_at timestamptz
);

create index jobs_user_created_idx on public.jobs (user_id, created_at desc);
create index jobs_queue_idx on public.jobs (created_at) where status = 'queued';

-- ---------- RLS: читать только своё, писать напрямую нельзя ----------
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;

create policy "own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "own jobs" on public.jobs
  for select to authenticated using (user_id = (select auth.uid()));

revoke insert, update, delete, truncate on public.profiles, public.jobs from anon, authenticated;
revoke all on public.profiles, public.jobs from anon;

-- ---------- создание задачи (сайт) ----------
create function public.create_job(p_input_path text, p_original_name text, p_strength public.job_strength)
returns public.jobs
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_job public.jobs;
begin
  if v_uid is null then
    raise exception 'Нужно войти';
  end if;
  if p_input_path is null or p_input_path not like v_uid::text || '/%' or p_input_path like '%..%' then
    raise exception 'Неверный путь к файлу';
  end if;

  update public.profiles set credits = credits - 1
   where id = v_uid and credits > 0;
  if not found then
    raise exception 'Закончились ролики на балансе';
  end if;

  insert into public.jobs (user_id, original_name, input_path, strength)
  values (v_uid, left(coalesce(nullif(trim(p_original_name), ''), 'video.mp4'), 200), p_input_path, p_strength)
  returning * into v_job;
  return v_job;
end;
$$;

revoke execute on function public.create_job(text, text, public.job_strength) from public, anon;
grant execute on function public.create_job(text, text, public.job_strength) to authenticated;

-- ---------- взять задачу из очереди (воркер) ----------
create function public.claim_job()
returns setof public.jobs
language sql
security definer
set search_path = ''
as $$
  update public.jobs
     set status = 'processing', started_at = now(), progress = 0, error = null
   where id = (
     select id from public.jobs
      where status = 'queued'
      order by created_at
      for update skip locked
      limit 1
   )
  returning *;
$$;

revoke execute on function public.claim_job() from public, anon, authenticated;
grant execute on function public.claim_job() to service_role;

-- ---------- вернуть кредит при ошибке (воркер) ----------
create function public.refund_credit(p_user uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles set credits = credits + 1 where id = p_user;
$$;

revoke execute on function public.refund_credit(uuid) from public, anon, authenticated;
grant execute on function public.refund_credit(uuid) to service_role;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---------- хранилище ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'videos', 'videos', false, 524288000,
  array['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska']
);

create policy "videos: upload to own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'videos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "videos: read own folder" on storage.objects
  for select to authenticated
  using (bucket_id = 'videos' and (storage.foldername(name))[1] = (select auth.uid())::text);
