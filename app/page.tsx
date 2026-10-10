import Link from "next/link";
import { CompareVideos, ReelWall } from "@/components/Showcase";
import StickyCta from "@/components/StickyCta";
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
  ["Upload", "Reel / Short / TikTok", "MP4, MOV, WEBM or MKV, up to 500 MB."],
  [
    "We rebuild it",
    "Frame / color / speed / audio / file",
    "A subtle zoom and crop, a touch of color and grain, 1–5% faster with audio in sync, slightly higher pitch, re-encoded at 30 fps with all old metadata wiped.",
  ],
  ["Download and post", "About one minute", "A brand-new file that looks and sounds like the original. Repeat for as many versions as you need."],
];

const audiences = [
  ["Creators", "Every account / every platform", "Post your best videos everywhere without re-editing a single frame."],
  ["AI creators", "Runway / Kling / Sora / Veo", "Turn one great generation into five posts — without paying to generate it again."],
  ["Brands & agencies", "Client accounts / A/B tests", "Deliver fresh variations for every account in minutes."],
  ["UGC & ads", "Ad accounts / pages", "Run the same winning creative across multiple ad accounts and pages."],
];

const changes = [
  ["Frame", "Subtle zoom and crop shift. Captions and logos stay readable."],
  ["Color", "Brightness, contrast, saturation, gamma, fine grain, vignette."],
  ["Speed", "1–5% faster. Video and audio stay in sync."],
  ["Audio", "Slightly higher pitch and volume."],
  ["File", "Re-encoded at 30 fps. Metadata wiped. New creation date."],
  ["Never mirrored", "On-screen text never ends up backwards."],
];

const faq = [
  ["Will it lower the quality?", "No. A 4K video stays 4K, encoded at a high bitrate. Most people can't tell the two apart side by side."],
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

// On phones the cards scroll sideways; on larger screens they become a grid.
const SWIPE = "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0";
// Section numbers shift when the "real views" block is shown.
const R = REELS.length >= 3 ? 1 : 0;
const num = (n: number) => String(n).padStart(2, "0");
const SWIPE_ITEM = "w-[82%] shrink-0 snap-start sm:w-auto";

export default function Home() {
  return (
    <div className="space-y-20 sm:space-y-28">
      {/* Hero */}
      <section className="rise grid items-center gap-10 border-t border-foreground pt-8 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <p className="label text-muted">Reels / Shorts / TikTok / AI video</p>
          <h1 className="font-display text-[4.4rem] sm:text-[7.5rem]">
            One video.
            <br />
            Endless
            <br />
            versions.
          </h1>
          <p className="font-poppins max-w-md text-base leading-relaxed sm:text-lg">
            Stop re-editing and re-generating. Get a brand-new file that looks and sounds like your original — in about a
            minute.
          </p>
          <p className="label text-muted">For creators &amp; AI creators</p>
          <div className="flex flex-wrap items-center gap-4 border-t border-foreground pt-6">
            <Link href="/login" className="bg-accent px-7 py-4 font-semibold text-accent-fg hover:opacity-90">
              Try it — 3 videos free
            </Link>
            <span className="label text-xs text-muted">No card needed</span>
          </div>
        </div>
        {REELS[0] && (
          <div className="mx-auto w-56 space-y-2 sm:w-72">
            <p className="label text-xs text-muted">Live preview</p>
            <Viewfinder className="w-full">
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
      <section className="space-y-6">
        <SectionTitle n="01" title="The problem" />
        <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">Great content shouldn&apos;t be one-and-done.</h2>
        <p className="label -mb-3 text-right text-xs text-muted sm:hidden">Swipe →</p>
        <ul className={`${SWIPE} sm:grid-cols-3 sm:gap-4`}>
          {pains.map(([t, d], i) => (
            <li key={t} className={`${SWIPE_ITEM} border border-border bg-card p-5`}>
              <p className="label text-xs text-muted">Problem / 0{i + 1}</p>
              <div className="mt-3 text-xl font-bold">{t}</div>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
        <Tip label="Operator tip">
          Uniq fixes all three. One upload, one minute, and your video is ready to go out again — on any account, any
          platform, as many times as you need.
        </Tip>
      </section>

      {/* Before / after */}
      <section className="space-y-6">
        <SectionTitle n="02" title="Spot the difference" />
        <div className="bg-panel p-4 text-panel-fg sm:p-8">
          <p className="label mb-4 text-xs opacity-70">Side by side / same look / new file</p>
          <CompareVideos />
        </div>
        <p className="label text-xs text-muted">Shot by Stani Flms / processed in 8 seconds</p>
      </section>

      {/* AI creators */}
      <section className="space-y-6">
        <SectionTitle n="03" title="For AI creators" />
        <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-stretch">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">Don&apos;t pay to generate it twice.</h2>
            <p className="font-poppins text-sm leading-relaxed text-muted sm:text-base">
              You spent credits, prompts and hours to land that perfect AI clip. Re-generating it for every account costs
              money and rarely comes out as good. Uniq turns one great generation into as many unique posts as you need —
              same quality, new file every time.
            </p>
            <p className="label text-xs text-muted">Runway / Kling / Sora / Veo / Higgsfield</p>
          </div>
          {fiveVersions && (
            <div className="flex flex-col justify-between bg-panel p-6 text-panel-fg">
              <p className="label text-xs opacity-70">5 versions of one video</p>
              <div className="font-display mt-4 text-8xl">{fiveVersions}</div>
              <p className="mt-3 text-sm opacity-70">On the Creator pack. No new prompts, no new generation credits.</p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <SectionTitle n="04" title="How it works" />
        <ol className="space-y-3">
          {how.map(([t, sub, d], i) => (
            <li key={t} className="flex gap-4 border border-border bg-card p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-panel font-display text-4xl text-panel-fg">
                {i + 1}
              </div>
              <div>
                <div className="text-xl font-bold">{t}</div>
                <p className="label mt-0.5 text-xs text-muted">{sub}</p>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Who it's for */}
      <section className="space-y-6">
        <SectionTitle n="05" title="Who it's for" />
        <ul className="space-y-3">
          {audiences.map(([t, sub, d]) => {
            const active = t === "AI creators";
            return (
              <li
                key={t}
                className={`flex items-start justify-between gap-4 border p-4 ${
                  active ? "border-panel bg-panel text-panel-fg" : "border-border bg-card"
                }`}
              >
                <div>
                  <div className="text-xl font-bold">{t}</div>
                  <p className={`label mt-0.5 text-xs ${active ? "opacity-70" : "text-muted"}`}>{sub}</p>
                  <p className={`mt-2 text-sm ${active ? "opacity-80" : "text-muted"}`}>{d}</p>
                </div>
                {active && <span className="mt-2 h-3 w-3 shrink-0 bg-dot" />}
              </li>
            );
          })}
        </ul>
      </section>

      {REELS.length >= 3 && (
        <section className="space-y-6">
          <SectionTitle n="06" title="Real videos / real views" />
          <ReelWall />
        </section>
      )}

      {/* What changes */}
      <section className="space-y-6">
        <SectionTitle n={num(6 + R)} title="Under the hood" />
        <dl className="divide-y divide-border border-y border-foreground">
          {changes.map(([t, d]) => (
            <div key={t} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr]">
              <dt className="label text-sm">{t}</dt>
              <dd className="text-muted">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Pricing */}
      <section className="space-y-6">
        <SectionTitle n={num(7 + R)} title="Pricing" />
        <p className="label text-xs text-muted">Pay per video / credits never expire / 3 videos free</p>
        <ul className="grid border border-foreground sm:grid-cols-3">
          {PACKS.map((p, i) => {
            const active = p.note === "Most popular";
            return (
              <li
                key={p.id}
                className={`relative p-6 ${active ? "bg-panel text-panel-fg" : "bg-card"} ${
                  i > 0 ? "border-t border-foreground sm:border-t-0 sm:border-l" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{p.name}</span>
                  {active && <span className="h-3 w-3 bg-dot" />}
                </div>
                {p.note && <p className={`label mt-1 text-[11px] ${active ? "opacity-70" : "text-muted"}`}>{p.note}</p>}
                <div className="font-display mt-5 text-7xl">{usd(p.priceCents)}</div>
                <p className={`label mt-2 text-xs ${active ? "opacity-70" : "text-muted"}`}>
                  {p.credits} videos / {usd(Math.round(p.priceCents / p.credits))} each
                </p>
              </li>
            );
          })}
        </ul>
        <Tip label="Bonus with every pack">
          <b>The Trial Reels Playbook</b> — a step-by-step guide to testing Uniq versions with Instagram Trial Reels and
          growing a new audience, plus 10 hooks to try.
        </Tip>
      </section>

      {/* FAQ */}
      <section className="space-y-6">
        <SectionTitle n={num(8 + R)} title="Good to know" />
        <div className="divide-y divide-border border-y border-foreground">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}
                <span className="font-mono text-xl transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-panel px-6 py-14 text-center text-panel-fg sm:px-12">
        <p className="label text-xs opacity-70">Your next upload</p>
        <h2 className="font-display mt-3 text-6xl sm:text-8xl">Make it unique</h2>
        <p className="mx-auto mt-4 max-w-md font-semibold text-dot">3 videos free. No card. About a minute per video.</p>
        <Link href="/login" className="mt-8 inline-block bg-accent px-8 py-4 font-semibold text-accent-fg hover:opacity-90">
          Start free
        </Link>
      </section>

      <StickyCta />
    </div>
  );
}

function SectionTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-foreground pb-3">
      <span className="font-mono text-4xl font-medium leading-none text-dot sm:text-5xl">{n}</span>
      <h2 className="kicker text-lg sm:text-xl">{title}</h2>
    </div>
  );
}

function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-foreground bg-card p-5">
      <p className="label flex items-center gap-3 text-xs">
        <span className="h-3 w-3 bg-dot" /> {label}
      </p>
      <p className="mt-3 text-lg leading-snug">{children}</p>
    </div>
  );
}
