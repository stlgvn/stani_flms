import Link from "next/link";
import { CompareVideos, ReelWall } from "@/components/Showcase";
import Viewfinder from "@/components/Viewfinder";
import { PACKS, usd } from "@/lib/plans";
import { REELS } from "@/lib/showcase";

const pains = [
  [
    "Reposts get buried",
    "Upload the same file twice — on a second account, or a month later — and platforms can treat it as a duplicate and quietly cut its reach.",
  ],
  [
    "Re-editing eats your day",
    "A new cut, a new hook, a new color pass, a new export. Hours of work just to post something you already made.",
  ],
  [
    "AI generations cost money",
    "Every new render burns credits and still might not come out as good as the first one. Your best generation should work more than once.",
  ],
];

const how = [
  ["Upload", "Drop in your Reel, Short or TikTok — MP4, MOV, WEBM or MKV, up to 500 MB."],
  [
    "We rebuild it",
    "A subtle zoom and crop, a touch of color and grain, 1–5% faster with audio in sync, slightly higher pitch, re-encoded at 30 fps with all old metadata wiped.",
  ],
  [
    "Download and post",
    "About a minute later you get a brand-new file that looks and sounds like the original. Repeat for as many versions as you need.",
  ],
];

const audiences = [
  ["Creators", "Post your best videos on every account and every platform without re-editing a single frame."],
  ["AI creators", "Turn one great generation into five posts — without paying to generate it again."],
  ["Brands & agencies", "Deliver fresh variations for every client account and A/B test in minutes."],
  ["UGC & ads", "Run the same winning creative across multiple ad accounts and pages."],
];

const changes = [
  ["Frame", "A subtle zoom and crop shift — captions and logos stay readable."],
  ["Color", "Brightness, contrast, saturation and gamma, plus fine grain and a vignette."],
  ["Speed", "1–5% faster, with video and audio perfectly in sync."],
  ["Audio", "Slightly higher pitch and volume."],
  ["File", "Re-encoded at 30 fps, metadata wiped, new creation date."],
  ["Never mirrored", "On-screen text never ends up backwards."],
];

const faq = [
  [
    "Will it lower the quality?",
    "No. A 4K video stays 4K, encoded at a high bitrate. Most people can't tell the two apart side by side.",
  ],
  [
    "Does it work with AI-generated videos?",
    "Yes — Runway, Kling, Sora, Veo, Higgsfield or anything else. If it exports as MP4 or MOV, Uniq can make new versions of it.",
  ],
  [
    "Can the platform still recognise it?",
    "Each version is a new file with new metadata and small changes to picture and sound. No tool can promise how Instagram, TikTok or YouTube will treat a video — we don't either.",
  ],
  ["Can I upload someone else's video?", "No. Only videos you own or have the rights to. Uniq doesn't clear copyright."],
  ["How long are my files kept?", "48 hours after processing, then they're deleted automatically."],
  ["What if processing fails?", "The credit goes straight back to your balance."],
];

const creator = PACKS.find((p) => p.id === "creator");
const fiveVersions = creator ? usd(Math.round((creator.priceCents / creator.credits) * 5)) : null;

export default function Home() {
  return (
    <div className="space-y-28">
      {/* Hero */}
      <section className="rise grid items-center gap-10 pt-4 sm:pt-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-7">
          <p className="font-hand text-3xl text-tan">for creators & AI creators —</p>
          <h1 className="font-display text-[4.6rem] text-accent sm:text-[8rem]">
            One video.
            <br />
            Endless unique
            <br />
            versions.
          </h1>
          <p className="max-w-lg text-lg text-muted">
            Stop re-editing and re-generating. Upload a Reel, Short or TikTok and get back a brand-new file with fresh
            metadata — that looks and sounds just like your original. In about a minute.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-accent px-8 py-4 font-semibold text-accent-fg shadow-[0_12px_32px_-10px] shadow-accent/60 transition hover:-translate-y-0.5"
            >
              Try it — 3 videos free
            </Link>
            <span className="font-hand text-2xl text-muted">no card needed</span>
          </div>
        </div>
        {REELS[0] && (
          <div className="relative mx-auto">
            <span className="font-hand absolute -top-8 -left-6 -rotate-6 text-3xl text-tan">see it in action ↓</span>
            <Viewfinder className="w-60 rounded-[1.6rem] shadow-2xl sm:w-72">
              <video
                src={REELS[0].src}
                poster={REELS[0].poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="block aspect-[9/16] w-full object-cover"
              />
            </Viewfinder>
          </div>
        )}
      </section>

      {/* Pain */}
      <section className="space-y-8">
        <SectionTitle kicker="sound familiar?" title="Great content shouldn't be one-and-done." />
        <ul className="grid gap-4 sm:grid-cols-3">
          {pains.map(([t, d], i) => (
            <li key={t} className="rounded-3xl border border-border bg-card p-6">
              <div className="font-display text-6xl text-accent/25">0{i + 1}</div>
              <div className="font-display mt-2 text-3xl text-accent">{t}</div>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
        <p className="max-w-2xl text-lg">
          <span className="font-semibold text-accent">Uniq fixes all three.</span> One upload, one minute, and your video
          is ready to go out again — on any account, any platform, as many times as you need.
        </p>
      </section>

      {/* Before / after */}
      <section className="space-y-8">
        <SectionTitle kicker="spot the difference" title="Same look. New file." note="(you won't find one)" />
        <CompareVideos />
        <p className="text-sm text-muted">
          Shot by Stani Films. Left: the original. Right: the Uniq version — processed in 8 seconds.
        </p>
      </section>

      {/* AI creators */}
      <section className="grid gap-8 rounded-[2rem] border border-border bg-card p-8 sm:p-12 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div className="space-y-4">
          <p className="font-hand text-2xl text-tan">for AI creators —</p>
          <h2 className="font-display text-5xl text-accent sm:text-7xl">Don&apos;t pay to generate it twice.</h2>
          <p className="text-muted">
            You spent credits, prompts and hours to land that perfect AI clip. Re-generating it for every account costs
            money and rarely comes out as good. Uniq turns one great generation into as many unique posts as you need —
            same quality, new file every time.
          </p>
        </div>
        {fiveVersions && (
          <div className="rounded-3xl bg-accent p-8 text-accent-fg">
            <div className="font-hand text-2xl opacity-90">5 versions of one video</div>
            <div className="font-display mt-2 text-8xl">{fiveVersions}</div>
            <p className="mt-2 text-sm opacity-80">on the Creator pack. No new prompts, no new generation credits.</p>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <SectionTitle kicker="how it works" title="Three steps. One minute." />
        <ol className="grid gap-4 sm:grid-cols-3">
          {how.map(([t, d], i) => (
            <li key={t} className="rounded-3xl border border-border bg-card p-6">
              <div className="font-display text-7xl text-accent">0{i + 1}</div>
              <div className="mt-3 text-lg font-semibold">{t}</div>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Who it's for */}
      <section className="space-y-8">
        <SectionTitle kicker="who it's for" title="More reach from every video." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map(([t, d]) => (
            <li key={t} className="rounded-3xl border border-border bg-card p-6">
              <div className="font-display text-3xl text-accent">{t}</div>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      {REELS.length >= 3 && (
        <section className="space-y-8">
          <SectionTitle kicker="made with uniq" title="Real videos. Real views." />
          <ReelWall />
        </section>
      )}

      {/* What changes */}
      <section className="space-y-8">
        <SectionTitle kicker="under the hood" title="Invisible to viewers. New to algorithms." />
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
          {changes.map(([t, d]) => (
            <li key={t} className="bg-card p-6">
              <div className="font-display text-3xl text-accent">{t}</div>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Pricing */}
      <section className="space-y-8">
        <SectionTitle kicker="pricing" title="Pay per video." note="credits never expire" />
        <ul className="grid gap-4 sm:grid-cols-3">
          {PACKS.map((p) => (
            <li
              key={p.id}
              className={`rounded-3xl border p-6 ${
                p.note === "Most popular" ? "border-accent bg-accent text-accent-fg" : "border-border bg-card"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">{p.name}</span>
                {p.note && <span className="font-hand text-xl">{p.note}</span>}
              </div>
              <div className="font-display mt-4 text-7xl">{usd(p.priceCents)}</div>
              <div className="mt-1 text-sm opacity-75">
                {p.credits} videos · {usd(Math.round(p.priceCents / p.credits))} each
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-accent/40 p-6 sm:flex-row sm:items-center">
          <div className="font-display text-5xl text-accent">+ Bonus</div>
          <p className="text-sm">
            <span className="font-semibold">Every pack includes The Trial Reels Playbook</span> — a step-by-step guide to
            testing Uniq versions with Instagram Trial Reels and growing a new audience, plus 10 hooks to try.
          </p>
        </div>
        <p className="text-sm text-muted">Every new account gets 3 videos free.</p>
      </section>

      {/* FAQ */}
      <section className="space-y-8">
        <SectionTitle kicker="questions" title="Good to know." />
        <div className="divide-y divide-border rounded-3xl border border-border bg-card">
          {faq.map(([q, a]) => (
            <details key={q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}
                <span className="font-display text-3xl text-accent transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="rounded-[2rem] bg-accent px-6 py-16 text-center text-accent-fg sm:px-12">
        <p className="font-hand text-3xl opacity-90">your next upload —</p>
        <h2 className="font-display mt-2 text-6xl sm:text-8xl">Make it unique</h2>
        <p className="mx-auto mt-3 max-w-md opacity-80">3 videos free. No card. About a minute per video.</p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-full bg-accent-fg px-8 py-4 font-semibold text-accent transition hover:-translate-y-0.5"
        >
          Start free
        </Link>
      </section>
    </div>
  );
}

function SectionTitle({ kicker, title, note }: { kicker: string; title: string; note?: string }) {
  return (
    <div className="space-y-1">
      <p className="font-hand text-2xl text-tan">{kicker} —</p>
      <h2 className="font-display text-5xl text-accent sm:text-7xl">
        {title} {note && <span className="font-hand align-middle text-3xl text-tan sm:text-4xl">{note}</span>}
      </h2>
    </div>
  );
}
