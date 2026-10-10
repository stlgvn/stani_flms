import Link from "next/link";
import { PACKS, usd } from "@/lib/plans";

const changes = [
  ["Frame", "A subtle zoom and crop shift — captions and logos stay readable."],
  ["Color", "Brightness, contrast, saturation and gamma, plus fine grain and a vignette."],
  ["Speed", "1–5% faster, with video and audio perfectly in sync."],
  ["Audio", "Slightly higher pitch and volume."],
  ["File", "Re-encoded at 30 fps, metadata wiped, new creation date."],
  ["Never mirrored", "On-screen text never ends up backwards."],
];

const steps = [
  ["Create an account", "Just an email and a password — takes 10 seconds."],
  ["Upload a video", "MP4, MOV, WEBM or MKV, up to 500 MB and 11 minutes."],
  ["Download your version", "Ready in a minute or two. Every version gets its own random settings."],
];

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="rise space-y-7 pt-6 sm:pt-12">
        <p className="text-xs font-semibold tracking-[0.25em] text-tan">FOR REELS · SHORTS · TIKTOK</p>
        <h1 className="font-display text-[3.4rem] leading-[0.95] text-accent sm:text-[6.5rem]">
          One video.
          <br />
          Endless unique
          <br />
          versions.
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Every version is a brand-new file with fresh metadata — yet it looks and sounds just like your original.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/login"
            className="rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-fg shadow-[0_10px_30px_-10px] shadow-accent/60 transition hover:-translate-y-0.5"
          >
            Try it — 3 videos free
          </Link>
          <span className="text-sm text-muted">No card needed</span>
        </div>
      </section>

      <section className="space-y-8">
        <SectionTitle kicker="What changes" title="Invisible to viewers. New to algorithms." />
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
          {changes.map(([t, d]) => (
            <li key={t} className="bg-card p-6">
              <div className="font-display text-xl text-accent">{t}</div>
              <div className="mt-2 text-sm text-muted">{d}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-8">
        <SectionTitle kicker="How it works" title="Three steps." />
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-3xl border border-border bg-card p-6">
              <div className="font-display text-5xl text-accent/90">0{i + 1}</div>
              <div className="mt-4 font-semibold">{t}</div>
              <div className="mt-1 text-sm text-muted">{d}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-8">
        <SectionTitle kicker="Pricing" title="Pay per video. Credits never expire." />
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
                {p.note && <span className="text-xs opacity-80">{p.note}</span>}
              </div>
              <div className="font-display mt-4 text-5xl">{usd(p.priceCents)}</div>
              <div className="mt-1 text-sm opacity-75">
                {p.credits} videos · {usd(Math.round(p.priceCents / p.credits))} each
              </div>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">Every new account gets 3 videos free.</p>
      </section>

      <section className="rounded-[2rem] bg-accent px-6 py-14 text-center text-accent-fg sm:px-12">
        <h2 className="font-display text-4xl sm:text-6xl">Make your first version</h2>
        <p className="mx-auto mt-3 max-w-md opacity-80">Upload a video and get a unique copy in about a minute.</p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-full bg-accent-fg px-7 py-3.5 font-semibold text-accent transition hover:-translate-y-0.5"
        >
          Start free
        </Link>
      </section>
    </div>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-[0.25em] text-tan">{kicker.toUpperCase()}</p>
      <h2 className="font-display text-4xl sm:text-5xl">{title}</h2>
    </div>
  );
}
