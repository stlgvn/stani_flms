import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "The Trial Reels Playbook — Uniq" };

export default function GuidePage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <Guide />
    </Suspense>
  );
}

// The full guide is a bonus for paying customers; everyone else sees a preview.
async function Guide() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { count } = await supabase.from("payments").select("id", { count: "exact", head: true });
  const unlocked = (count ?? 0) > 0;

  return (
    <article className="mx-auto max-w-2xl space-y-10">
      <header className="space-y-3">
        <p className="font-hand text-2xl text-tan">your growth guide —</p>
        <h1 className="font-display text-6xl text-accent sm:text-8xl">The Trial Reels Playbook</h1>
        <p className="text-lg text-muted">
          How to use Instagram Trial Reels and Uniq together to test your videos on new audiences — without spamming the
          followers you already have.
        </p>
      </header>

      <Part n="01" title="What Trial Reels are">
        <p>
          Trial Reels is an Instagram feature for professional accounts: the Reel is shown to people who{" "}
          <b>don&apos;t follow you yet</b>. Your followers don&apos;t see it unless you decide to share it with them after
          you&apos;ve seen how it performed.
        </p>
        <p>
          That makes it a free testing lab — and Uniq gives you as many unique versions as you want to run through it.
        </p>
      </Part>

      {unlocked ? (
        <>
          <Part n="02" title="Why Uniq makes it work">
            <p>
              Posting the same file again and again is exactly what platforms are built to spot. Every Uniq version is a
              new file with fresh metadata and small changes to picture and sound — so each trial gets its own clean
              start, while the video still looks like your original.
            </p>
          </Part>

          <Part n="03" title="The playbook">
            <ol className="space-y-4">
              {[
                ["Pick one strong video", "A Reel that already did well, or a new one you believe in."],
                ["Make 3–5 versions in Uniq", "Use Medium strength. Download them all."],
                [
                  "Give each version a different hook",
                  "Uniq changes the file — you change the hook: the first 2 seconds of on-screen text, the first line of the caption, or the cover. One change per version, so you know what worked.",
                ],
                ["Post each one as a Trial Reel", "Space them out: one a day, or a few hours apart."],
                [
                  "Wait 24–72 hours and compare",
                  "Look at reach to non-followers, average watch time, shares, saves and new follows — not just likes.",
                ],
                [
                  "Share the winner with your followers",
                  "Then make one more Uniq version of it for TikTok and YouTube Shorts.",
                ],
                ["Repeat every week", "Keep a simple note of which hook won. After a month you'll know what your new audience wants."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="font-display w-8 shrink-0 text-4xl text-accent">{i + 1}</span>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <p className="text-sm text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Part>

          <Part n="04" title="10 hooks to test">
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "“Nobody talks about this…”",
                "“Stop scrolling if you…”",
                "“I tried ___ so you don't have to”",
                "“The ___ mistake everyone makes”",
                "“POV: you finally ___”",
                "“3 seconds to change how you ___”",
                "“This took me 2 years to learn”",
                "“Watch till the end”",
                "“Before vs after”",
                "A question your audience asks you all the time",
              ].map((h) => (
                <li key={h} className="rounded-2xl border border-border bg-card px-4 py-3 text-sm">
                  {h}
                </li>
              ))}
            </ul>
          </Part>

          <Part n="05" title="Ground rules">
            <ul className="list-disc space-y-2 pl-5">
              <li>Only post videos you own or have the rights to.</li>
              <li>Change the caption and hook for every version — don&apos;t copy-paste.</li>
              <li>Don&apos;t post all versions at the same minute; spread them out.</li>
              <li>Results vary, and platforms change their features — treat every week as a new test.</li>
            </ul>
          </Part>

          <div className="rounded-[2rem] bg-accent p-8 text-center text-accent-fg">
            <p className="font-hand text-2xl opacity-90">ready for this week&apos;s test? —</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block rounded-full bg-accent-fg px-8 py-4 font-semibold text-accent"
            >
              Make your versions
            </Link>
          </div>
        </>
      ) : (
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center">
          <p className="font-hand text-3xl text-tan">the rest is for customers —</p>
          <p className="mx-auto mt-2 max-w-md text-muted">
            The full step-by-step playbook, 10 hooks to test and the weekly routine unlock with any credit pack.
          </p>
          <Link
            href="/dashboard#buy"
            className="mt-6 inline-block rounded-full bg-accent px-8 py-4 font-semibold text-accent-fg"
          >
            Get a pack and unlock the guide
          </Link>
        </div>
      )}
    </article>
  );
}

function Part({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl text-accent/40">{n}</span>
        <h2 className="font-display text-4xl text-accent">{title}</h2>
      </div>
      <div className="space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}
