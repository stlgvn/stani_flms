import Link from "next/link";
import { CompareVideos, ReelWall } from "@/components/Showcase";
import PackCards from "@/components/PackCards";
import StickyCta from "@/components/StickyCta";
import Viewfinder from "@/components/Viewfinder";
import { CASES, HERO, REELS, type ShowcaseCase } from "@/lib/showcase";

const pains = [
  [
    "Reposts get buried",
    "Upload the same file twice - on a second account, or a month later - and platforms can treat it as a duplicate and quietly cut its reach.",
  ],
  [
    "Re-editing eats your day",
    "A new cut, a new hook, a new color pass, a new export. Hours of work just to post something you already made.",
  ],
  [
    "Your best video gets one shot",
    "A reel that took off once deserves another run. Without a fresh file, it usually doesn't get one.",
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
  ["AI creators", "Runway / Kling / Sora / Veo", "Got an AI video that blew up? Make it unique and post it again for another shot at the same reach."],
  ["Brands & agencies", "Client accounts / A/B tests", "Deliver fresh variations for every account in minutes."],
  ["UGC creators", "Brand accounts / pages", "Run the same winning video across several brand accounts and pages."],
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
    "Yes - Runway, Kling, Sora, Veo, Higgsfield or anything else. If it exports as MP4 or MOV, Uniq can make new versions of it.",
  ],
  [
    "Can the platform still recognise it?",
    "Each version is a new file with new metadata and small changes to picture and sound. No tool can promise how Instagram, TikTok or YouTube will treat a video - we don't either.",
  ],
  ["Can I upload someone else's video?", "No. Only videos you own or have the rights to. Uniq doesn't clear copyright."],
  ["How long are my files kept?", "48 hours after processing, then they're deleted automatically."],
  ["What if processing fails?", "The credit goes straight back to your balance."],
];


// On phones the cards scroll sideways; on larger screens they become a grid.
const SWIPE = "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0";
// Section numbers shift when the "real views" block is shown.
const R = REELS.length >= 3 ? 1 : 0;
const num = (n: number) => String(n).padStart(2, "0");
const SWIPE_ITEM = "w-[82%] shrink-0 snap-start sm:w-auto";

export default function Home() {
  return (
    <div className="space-y-20 sm:space-y-28">
      {/* Hero: full-width, real Instagram activity playing behind the headline */}
      <Viewfinder grid={false} className="rise relative -mt-10 ml-[calc(50%-50vw)] w-screen">
        <video
          src={HERO.src}
          poster={HERO.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-[72%_50%] md:object-center"
        />
        <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-black/75 md:via-black/45 md:to-black/20" />
        <div className="relative mx-auto flex min-h-[calc(100svh-61px)] max-w-5xl flex-col justify-center space-y-6 px-8 py-20 text-white sm:px-12">
          <p className="label text-white/70">Reels / Shorts / TikTok / AI video</p>
          <h1 className="font-display text-[4.4rem] leading-[1] sm:text-[7.5rem]">
            One video.
            <br />
            Endless
            <br />
            versions.
          </h1>
          <p className="font-poppins max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
            Stop re-editing and re-generating.
            <br />
            Get a brand-new file that looks and sounds like your original, in about a minute.
          </p>
          <div className="flex flex-wrap items-center gap-4 border-t border-white/40 pt-6">
            <Link href="/login" className="bg-accent px-7 py-4 font-semibold tracking-wide text-accent-fg uppercase hover:opacity-90">
              Try It - 3 Videos Free
            </Link>
            <span className="label text-xs text-white/70">No card needed</span>
          </div>
        </div>
      </Viewfinder>

      {/* Pain */}
      <section className="space-y-6">
        <SectionTitle n="01" title="The problem" />
        <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Great content shouldn&apos;t be one-and-done.</h2>
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
          Uniq fixes all three. One upload, one minute, and your video is ready to go out again - on any account, any
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
        <p className="label text-xs text-muted">Shot by Stani Flms / real Uniq output / processed in 10 seconds</p>
      </section>

      {/* Real result */}
      <section className="space-y-6">
        <SectionTitle n="03" title="Real result" />
        {CASES.map((c) => (
          <CaseCard key={c.src} c={c} />
        ))}
        <Tip label="Operator tip">
          A video doesn&apos;t have to hit the first time. Ours often took off on the 2nd, 3rd or 4th post - that&apos;s
          why every try needs a fresh file.
        </Tip>
        <p className="label text-[10px] text-muted">Real numbers from our account / results vary by content and platform</p>
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
            const active = t === "Creators";
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
          <SectionTitle n={num(6)} title="Real videos / real views" />
          <ReelWall />
        </section>
      )}

      {/* What changes */}
      <section className="space-y-6">
        <SectionTitle n={num(6 + R)} title="Under the hood" />
        <p className="font-poppins max-w-2xl text-sm leading-relaxed sm:text-lg">
          Our own engine, built specifically to make reels unique. Every version gets its own random mix of changes,
          so no two files are ever the same. Invisible to the human eye - a brand-new upload to the algorithm.
        </p>
        <dl className="divide-y divide-border border-y border-foreground">
          {changes.map(([t, d]) => (
            <div key={t} className="grid gap-0.5 py-2.5 sm:grid-cols-[200px_1fr] sm:gap-1 sm:py-4">
              <dt className="label text-[10px] sm:text-sm">{t}</dt>
              <dd className="text-xs text-muted sm:text-base">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Pricing */}
      <section className="space-y-6">
        <SectionTitle n={num(7 + R)} title="Pricing" />
        <p className="label text-xs text-muted">Pay per video / credits never expire / 3 Videos Free</p>
        <PackCards mode="link" />
        <Tip label="Bonus with every pack">
          <b>The Trial Reels Playbook</b> - a step-by-step guide to testing Uniq versions with Instagram Trial Reels and
          growing a new audience, plus 10 hooks to try.
        </Tip>
      </section>

      {/* Final CTA */}
      <section className="bg-panel px-6 py-14 text-center text-panel-fg sm:px-12">
        <p className="label text-xs opacity-70">Your next upload</p>
        <h2 className="font-display mt-3 text-6xl sm:text-8xl">Make it unique</h2>
        <p className="mx-auto mt-4 max-w-md font-semibold text-dot">3 Videos Free. No card. About a minute per video.</p>
        <Link href="/login" className="mt-10 inline-block bg-accent px-12 py-6 text-xl font-bold tracking-wide text-accent-fg uppercase hover:opacity-90 sm:px-16 sm:text-2xl">
          Start Free
        </Link>
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

      <StickyCta />
    </div>
  );
}

function SectionTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-foreground pb-3">
      <span className="font-mono text-4xl font-medium leading-none text-dot sm:text-5xl">{n}</span>
      <h2 className="font-display text-3xl tracking-wide sm:text-4xl">{title}</h2>
    </div>
  );
}

function CaseCard({ c }: { c: ShowcaseCase }) {
  return (
    <div className="grid bg-panel text-panel-fg md:grid-cols-[1.5fr_1fr]">
      <div className="relative z-[60] bg-black">
        <video
          src={c.src}
          poster={c.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="block aspect-[4/5] w-full object-cover sm:aspect-video md:aspect-auto md:h-full"
        />
      </div>
      <div className="flex flex-col justify-between gap-5 p-5 sm:gap-6 sm:p-8">
        <p className="label text-xs opacity-70">{c.label}</p>
        <div className="grid grid-cols-2 border-t border-panel-fg/30">
          {c.stats.map((s, i) => (
            <div
              key={s.label}
              className={`border-b border-panel-fg/30 py-3 sm:py-4 ${i % 2 ? "border-l pl-4" : "pr-4"}`}
            >
              <div className={`font-display text-4xl sm:text-7xl ${s.accent ? "text-dot" : ""}`}>{s.value}</div>
              <p className="label mt-2 text-[10px] opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="font-poppins text-sm leading-relaxed opacity-80 sm:text-base">{c.text}</p>
      </div>
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
