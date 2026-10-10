# Uniq — short vertical video uniqualizer

Turns one source video (Reels / Shorts / TikTok) into new versions that differ from the original in both file and
metadata, yet look and sound the same: a subtle zoom and crop shift, 1–5 % faster playback (audio stays in sync),
slightly higher pitch, color grading, grain, a vignette, re-encoding at 30 fps and wiped metadata.
Every run picks new random parameters. The frame is never mirrored.

What's inside:

| part | where | what it does |
|---|---|---|
| core | `lib/uniq.ts` | ffprobe + ffmpeg, random parameters, A/V sync check |
| CLI | `scripts/uniq.ts` | `npm run uniq -- …` — process a single file without the website |
| website | `app/`, `components/`, `proxy.ts` | Next.js: landing page, email sign-in, dashboard |
| database | `supabase/migrations/` | profiles with a credit balance, job queue, private storage |
| worker | `scripts/worker.ts` | takes jobs from the queue and processes them |

## First-time setup

You need **ffmpeg**, **Node.js 20+** and **Docker**.

macOS:

```bash
brew install ffmpeg node colima docker
colima start --cpu 4 --memory 8
```

Windows: `winget install Gyan.FFmpeg OpenJS.NodeJS.LTS` plus Docker Desktop.

Then, in the project folder:

```bash
npm install
npx supabase start          # downloads images the first time, ~5–10 minutes
npx supabase status -o env  # keys for .env.local
```

Create a `.env.local` file (it is never committed to git):

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY from supabase status>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY from supabase status>
```

`SUPABASE_SERVICE_ROLE_KEY` has full access to the database and is used only by the worker. Never prefix it with
`NEXT_PUBLIC_`, or it will be shipped to the browser.

## Starting after a reboot

Four steps. Run the website and the worker **in separate terminal tabs** and keep them open:

```bash
colima start                # 1. Docker (on Windows just open Docker Desktop)
npx supabase start          # 2. database, auth, storage
npm run dev                 # 3. tab 1 — website: http://localhost:3000
npm run worker:dev          # 4. tab 2 — worker (restarts when the code changes)
```

- Sign-in emails are not really sent locally — you'll find them in Mailpit: http://127.0.0.1:54324
- Database dashboard (Supabase Studio): http://127.0.0.1:54323
- Stop the database: `npx supabase stop`

To add credits manually (e.g. for yourself): Studio → Table editor → `profiles` → `credits`,
or in SQL: `update profiles set credits = credits + 10 where email = 'you@example.com';`

## Without the website: one command

```bash
npm run uniq -- "<input.mp4>" "<output.mp4>" [light|medium|strong] ["Metadata title"]
```

Use absolute paths. Finished videos go into the project folder, in a sub-folder named after the day (`DD.MM.YYYY`),
e.g. `…/stani_flms/10.10.2026/🎬 Topic — hook_v1.mp4`. These folders are not committed to git.

Strength: `light` — barely noticeable, `medium` (default) — the sweet spot, `strong` — maximum difference.

## How it works

1. A user signs in with a magic link (no password) and gets 3 free videos.
2. The browser uploads the file straight to private storage, into `<user_id>/<uuid>/in.<ext>` (with a progress bar),
   then calls `create_job`, which atomically deducts 1 credit and queues the job.
3. The worker claims the job (`claim_job`, safe with several workers), checks the duration (up to 11 minutes),
   runs the core and stores `out.mp4` next to the source. Results are kept for 48 hours.
4. If processing fails, the job is marked "Failed" and the credit is refunded.
5. Every 10 minutes the worker deletes expired files and requeues jobs stuck for over an hour.

Security: users only see their own jobs, profile and files; nobody can write to the tables directly;
`claim_job` and `refund_credit` are available to the worker only.

## Before going public

- **Email.** Supabase's built-in mailer sends very few emails and lands in spam. Plug in your own SMTP
  (Postmark, Resend, Amazon SES, etc.) and customize the sign-in email template.
- **Hosted Supabase.** The free plan caps files at 50 MB — videos up to 500 MB need a paid plan
  (or self-hosted Supabase). Push the migration: `npx supabase link` → `npx supabase db push`.
  In Auth settings set the site URL and add `https://<domain>/auth/confirm` to Redirect URLs.
- **Payments.** E.g. Stripe (or YooKassa for Russia): a server-side webhook increases `profiles.credits` after a
  successful payment (using the service role, never from the browser).
- **Legal.** Terms of service, a privacy policy and consent to data processing; the terms should state that users
  only upload content they have the rights to.
- **Russian users — Federal Law 152-FZ.** Personal data (emails) of Russian citizens must be stored on servers in
  Russia: self-host Supabase (Docker) on a Russian VPS and register as a personal data operator with Roskomnadzor.
- **Worker.** A separate VPS with at least 4 vCPU / 8 GB RAM, ffmpeg and Node.js, running `npm run worker` under
  systemd or pm2. A 1-minute video takes about 1.5–2 minutes on 4 cores. Add more workers for a longer queue.
- **Website.** Vercel, or the same VPS (`npm run build && npm start` behind nginx with HTTPS).

## Troubleshooting

- `supabase start` can't pull images (`public.ecr.aws` / `Forbidden` errors):
  `SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io npx supabase start`.
- Jobs stay "Queued" — the worker isn't running (`npm run worker:dev`).
- No sign-in email — check Mailpit (http://127.0.0.1:54324) and open the link in the same browser where you
  requested it.
