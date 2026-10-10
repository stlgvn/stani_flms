import Link from "next/link";
import { CompareVideos, ReelWall } from "@/components/Showcase";
import { PACKS, usd } from "@/lib/plans";
import { REELS } from "@/lib/showcase";

const uses = [
  ["Post everywhere", "Run the same video on several of your own accounts — each one gets its own file."],
  ["Test your hooks", "Make 5 versions of one Reel and see which one the algorithm likes."],
  ["Refresh old hits", "Bring back a video that already worked, as a brand-new upload."],
  ["For agencies", "Deliver variations to clients in minutes, not hours of re-editing."],
];

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
  ["Download your version", "Ready in about a minute. Every version gets its own random settings."],
];

const faq = [
  [
    "Will it lower the quality?",
    "No. A 4K video stays 4K, encoded at a high bitrate. Most people can't tell the two apart side by side.",
  ],
  [
    "Can the platform still recognise it?",
    "Each version is a new file with new metadata and small changes to picture and sound. No tool can promise how Instagram, TikTok or YouTube will treat a video — we don't either.",
  ],
  ["Can I upload someone else's video?", "No. Only videos you own or have the rights to. Uniq doesn't clear copyright."],
  ["How long are my files kept?", "48 hours after processing, then they're deleted automatically."],
  ["What if processing fails?", "The credit goes straight back to your balance."],
];

export default function Home() {
  return (
    <div className="space-y-28">
      {/* Hero */}
      <section className="rise grid items-center gap-10 pt-4 sm:pt-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-7">
          <p className="font-hand text-3xl text-tan">made for creators —</p>
          <h1 className="font-display text-[4.6rem] text-accent sm:text-[8rem]">
            One video.
            <br />
            Endless unique
            <br />
            versions.
          </h1>
          <p className="max-w-lg text-lg text-muted">
            Upload a Reel, Short or TikTok. Get back a brand-new file with fresh metadata — that looks and sounds just
            like your original.
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
            <span className="font-hand absolute -top-8 -left-6 -rotate-6 text-3xl text-accent">see it in action ↓</span>
            <video
              src={REELS[0].src}
              poster={REELS[0].poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="aspect-[9/16] w-60 rounded-[2.2rem] border-[6px] border-foreground object-cover shadow-2xl sm:w-72"
            />
          </div>
        )}
      </section>

      {/* Before / after */}
      <section className="space-y-8">
        <SectionTitle kicker="spot the difference" title="Same look. New file." note="(you won't find one)" />
        <CompareVideos />
        <p className="text-sm text-muted">Shot by Stani Films. Left: the original. Right: the Uniq version — processed in 8 seconds.</p>
      </section>

      {/* Uses */}
      <section className="space-y-8">
        <SectionTitle kicker="why creators use it" title="More reach from every video." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {uses.map(([t, d]) => (
            <li key={t} className="rounded-3xl border border-border bg-card p-6">
              <div className="font-display text-3xl text-accent">{t}</div>
              <div className="mt-2 text-sm text-muted">{d}</div>
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
        <SectionTitle kicker="what changes" title="Invisible to viewers. New to algorithms." />
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
          {changes.map(([t, d]) => (
            <li key={t} className="bg-card p-6">
              <div className="font-display text-3xl text-accent">{t}</div>
              <div className="mt-2 text-sm text-muted">{d}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Steps */}
      <section className="space-y-8">
        <SectionTitle kicker="how it works" title="Three steps. One minute." />
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-3xl border border-border bg-card p-6">
              <div className="font-display text-7xl text-accent/90">0{i + 1}</div>
              <div className="mt-3 font-semibold">{t}</div>
              <div className="mt-1 text-sm text-muted">{d}</div>
            </li>
          ))}
        </ol>
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
        <p className="mx-auto mt-3 max-w-md opacity-80">Upload a video and get a fresh version in about a minute.</p>
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
      <h2 className="font-display text-5xl sm:text-7xl">
        {title} {note && <span className="font-hand align-middle text-3xl text-accent sm:text-4xl">{note}</span>}
      </h2>
    </div>
  );
}
