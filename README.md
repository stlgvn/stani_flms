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
| payments | `lib/plans.ts`, `app/api/` | credit packs, Stripe Checkout and webhook |
| legal pages | `app/terms`, `app/privacy`, `app/refunds`, `lib/site.ts` | templates — fill in your details |

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
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=<sk_test_… from Stripe>
STRIPE_WEBHOOK_SECRET=<whsec_… from Stripe>
```

The same list is in `.env.example`.

`SUPABASE_SERVICE_ROLE_KEY` has full access to the database and is used only by the worker and the payment webhook. Never prefix it with
`NEXT_PUBLIC_`, or it will be shipped to the browser.

## Deploying to a server (one command)

On a fresh Ubuntu 24.04 server (e.g. Hetzner CPX32, 4 vCPU / 8 GB), logged in as root:

```bash
curl -fsSL https://raw.githubusercontent.com/stlgvn/stani_flms/master/deploy/install.sh | bash
```

It installs Docker, self-hosted Supabase, the website, the worker and Caddy (automatic HTTPS), applies the
migrations and opens only ports 22/80/443. Without a domain the site is at `https://<ip-with-dashes>.sslip.io`;
to use your own, point an A record at the server and run the same command with the domain at the end:
`… | bash -s -- uniq.example.com`. Re-running the command updates the app and keeps all data.

- Settings and keys: `/opt/supabase/.env` (Stripe keys go here, then `cd /opt/supabase && docker compose up -d`).
- Own domain: point an A record at the server, then run the installer with `DOMAIN=uniq.example.com`
  (`curl -fsSL …/install.sh | DOMAIN=uniq.example.com bash`). Later updates remember it.
- Stripe keys without editing files: `curl -fsSL …/install.sh | SET_STRIPE=1 bash` asks for them (hidden input).
- Logs: `cd /opt/supabase && docker compose logs -f web worker`.
- Until SMTP is configured in `/opt/supabase/.env` (`SMTP_*`), sign-ups are confirmed instantly (email + password).

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
- **Payments** — see [Stripe](#stripe) below.
- **Legal.** Terms of service, a privacy policy and consent to data processing; the terms should state that users
  only upload content they have the rights to.
- **Russian users — Federal Law 152-FZ.** Personal data (emails) of Russian citizens must be stored on servers in
  Russia: self-host Supabase (Docker) on a Russian VPS and register as a personal data operator with Roskomnadzor.
- **Worker.** A separate VPS with at least 4 vCPU / 8 GB RAM, ffmpeg and Node.js, running `npm run worker` under
  systemd or pm2. A 1-minute video takes about 1.5–2 minutes on 4 cores. Add more workers for a longer queue.
- **Website.** Vercel, or the same VPS (`npm run build && npm start` behind nginx with HTTPS).

## Stripe

Credit packs (names, credits, prices) live in `lib/plans.ts`. A purchase works like this: the **Buy** button opens a
Stripe Checkout page → the customer pays → Stripe calls `/api/stripe/webhook` → `grant_credits` adds the credits
(exactly once per payment, even if Stripe repeats the call). Payments are listed in the `payments` table.

1. Create an account at https://dashboard.stripe.com and finish activation (business details, bank account).
   Stripe checks that the site shows prices, terms, a privacy policy, a refund policy and a contact email —
   fill in `lib/site.ts` first.
2. **Developers → API keys** → copy the *Secret key* into `STRIPE_SECRET_KEY`.
3. **Developers → Webhooks → Add endpoint**: URL `https://<domain>/api/stripe/webhook`, events
   `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy the *Signing secret*
   into `STRIPE_WEBHOOK_SECRET`.
4. Set `NEXT_PUBLIC_SITE_URL=https://<domain>` and restart the site.

Testing locally with test keys (`sk_test_…`): install the Stripe CLI and run
`stripe listen --forward-to localhost:3000/api/stripe/webhook` — it prints a `whsec_…` secret for
`STRIPE_WEBHOOK_SECRET`. Pay with the test card `4242 4242 4242 4242`, any future date, any CVC.

The website needs `SUPABASE_SERVICE_ROLE_KEY` too (only server code uses it, for the webhook) — never prefix it with
`NEXT_PUBLIC_`.

## Troubleshooting

- `supabase start` can't pull images (`public.ecr.aws` / `Forbidden` errors):
  `SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io npx supabase start`.
- Jobs stay "Queued" — the worker isn't running (`npm run worker:dev`).
- No sign-in email — check Mailpit (http://127.0.0.1:54324) and open the link in the same browser where you
  requested it.
