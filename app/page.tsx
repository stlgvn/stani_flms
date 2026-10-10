import Link from "next/link";

const changes = [
  ["Frame", "a subtle zoom and crop shift — captions and logos stay readable"],
  ["Color", "brightness, contrast, saturation, gamma, fine grain and a vignette"],
  ["Speed", "1–5% faster — video and audio stay in sync"],
  ["Audio", "slightly higher pitch and volume"],
  ["File", "re-encoded at 30 fps, metadata wiped, new creation date"],
];

const steps = [
  ["Sign in with email", "No password — we send you a magic link."],
  ["Upload a video", "MP4, MOV, WEBM or MKV, up to 500 MB and 11 minutes."],
  ["Download your version", "Ready in a minute or two. Every version gets its own random settings."],
];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="space-y-5 pt-4">
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
          One video — <span className="text-accent">endless unique versions</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          For Reels, Shorts and TikTok. Each new version differs from the original in both file and metadata, yet looks
          and sounds the same.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-xl bg-accent px-6 py-3 font-semibold text-accent-fg shadow-sm hover:opacity-90"
        >
          Try it — 3 videos free
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What changes</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {changes.map(([t, d]) => (
            <li key={t} className="rounded-xl border border-border bg-card p-4">
              <div className="font-medium">{t}</div>
              <div className="text-sm text-muted">{d}</div>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">The frame is never mirrored, so on-screen text never ends up backwards.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Three steps</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-fg">
                {i + 1}
              </div>
              <div className="font-medium">{t}</div>
              <div className="text-sm text-muted">{d}</div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
