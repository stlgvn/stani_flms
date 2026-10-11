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
    <article className="mx-auto max-w-2xl space-y-12">
      <header className="space-y-4">
        <p className="label text-xs text-muted">Your growth guide / by Stani Flms</p>
        <h1 className="font-display text-6xl leading-[0.95] sm:text-8xl">The Trial Reels Playbook</h1>
        <p className="font-poppins text-sm leading-relaxed sm:text-base">
          How to use Instagram Trial Reels and Uniq to reach new people - and get far more out of every video you make.
        </p>
      </header>

      {unlocked ? (
        <>
          <Part n="01" title="What Trial Reels are">
            <p>
              Trial Reels is an Instagram feature for professional accounts. A trial reel is shown{" "}
              <b>only to people who don&apos;t follow you yet</b>. Your followers don&apos;t see it - so you can test as
              much as you want without spamming your own audience.
            </p>
            <p>
              That makes it the best free tool there is for growing a new audience. Uniq gives you as many fresh copies
              of a video as you need to run through it.
            </p>
          </Part>

          <Part n="02" title="Why it's worth it">
            <p>A video that took off once usually isn&apos;t done. Post it again as a fresh file and it can keep going:</p>
            <div className="grid grid-cols-2 border border-foreground">
              <div className="p-4 sm:p-5">
                <p className="label text-[10px] text-muted">One post</p>
                <p className="font-display mt-2 text-4xl sm:text-5xl">100K</p>
                <p className="font-display text-4xl sm:text-5xl">1M</p>
              </div>
              <div className="border-l border-foreground bg-panel p-4 text-panel-fg sm:p-5">
                <p className="label text-[10px] opacity-70">9+ fresh copies</p>
                <p className="font-display mt-2 text-4xl text-dot sm:text-5xl">up to 1M</p>
                <p className="font-display text-4xl text-dot sm:text-5xl">6-10M</p>
              </div>
            </div>
            <p className="text-xs text-muted">
              From our own account. Every video and niche is different - these are possibilities, not promises.
            </p>
          </Part>

          <Part n="03" title="The schedule">
            <p>
              You can post up to <b>20 trial reels a day</b>. Don&apos;t upload them all in one hour - spread them out.
              Our rhythm: <b>morning, lunch and evening</b>, one fresh copy each time.
            </p>
            <div className="grid grid-cols-4 border border-foreground text-center text-xs sm:text-sm">
              <div className="border-b border-foreground p-2" />
              {["Morning", "Lunch", "Evening"].map((t) => (
                <div key={t} className="label border-b border-l border-foreground p-2 text-[10px]">
                  {t}
                </div>
              ))}
              {[1, 2, 3].map((day) => (
                <div key={day} className="contents">
                  <div className={`label p-2 text-[10px] ${day < 3 ? "border-b border-foreground" : ""}`}>Day {day}</div>
                  {[1, 2, 3].map((slot) => (
                    <div
                      key={slot}
                      className={`border-l border-foreground p-2 font-semibold ${day < 3 ? "border-b" : ""} ${
                        day === 1 && slot === 1 ? "bg-panel text-panel-fg" : ""
                      }`}
                    >
                      Copy {(day - 1) * 3 + slot}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p>Three days, nine posts - all from one video. Keep going for longer if it keeps working.</p>
          </Part>

          <Part n="04" title="Step by step">
            <ol className="space-y-4">
              {[
                [
                  "Pick a video that already took off",
                  "Use the best-quality file you have - the original export, not a copy downloaded from Instagram.",
                ],
                ["Make your copies in Uniq", "One credit per copy. Medium strength works for most videos. Download them all."],
                ["Post one copy as a Trial Reel - morning", "Then the next copy at lunch, and the next in the evening."],
                ["Repeat for 3 days or more", "One reel, nine posts or more. Each one is a new file, so each gets its own chance."],
                [
                  "Watch the numbers",
                  "Check reach to non-followers, watch time, shares, saves and new follows after 24-72 hours.",
                ],
                [
                  "Share the winners with your followers",
                  "When a trial does well, Instagram lets you share it to your main audience too.",
                ],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-panel font-display text-xl text-panel-fg">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <p className="text-sm text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Part>

          <Part n="05" title="Hits keep hitting">
            <p>
              In our experience, a reel that took off once takes off again in <b>about 8 out of 10</b> repeat posts. Same
              content, fresh file, new people.
            </p>
          </Part>

          <Part n="06" title="Not a hit yet? Post it anyway">
            <p>
              Videos that didn&apos;t take off are worth a trial too. Roughly <b>3 out of 10</b> start picking up on the
              second or third day. You lose nothing - your followers never see the trial.
            </p>
          </Part>

          <Part n="07" title="Ground rules">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <b>Only post your own videos</b> - or videos you have the rights to.
              </li>
              <li>Don&apos;t download other people&apos;s videos and don&apos;t remake them.</li>
              <li>Don&apos;t upload all your copies at once - spread them through the day.</li>
              <li>Results vary, and Instagram changes its features - treat every week as a new test.</li>
            </ul>
          </Part>

          <div className="bg-panel p-8 text-center text-panel-fg">
            <p className="label text-xs opacity-70">Got results? Tell me</p>
            <p className="font-display mt-3 text-4xl sm:text-5xl">DM me on Instagram</p>
            <a
              href="https://instagram.com/stlgv"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-semibold text-dot underline"
            >
              @stlgv
            </a>
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="nudge shine inline-block bg-accent px-8 py-4 font-semibold tracking-wide text-accent-fg uppercase"
              >
                Make your copies
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="border border-foreground bg-card p-8 text-center">
          <p className="label text-xs text-muted">The rest is for customers</p>
          <p className="font-poppins mx-auto mt-2 max-w-md text-sm text-muted sm:text-base">
            The full playbook - the posting schedule, the step-by-step routine and what to do with videos that
            haven&apos;t taken off yet - unlocks with any credit pack.
          </p>
          <Link
            href="/dashboard#buy"
            className="nudge shine mt-6 inline-block bg-accent px-8 py-4 font-semibold tracking-wide text-accent-fg uppercase"
          >
            Get a pack
          </Link>
        </div>
      )}
    </article>
  );
}

function Part({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-4 border-b border-foreground pb-3">
        <span className="font-mono text-4xl font-medium leading-none text-dot sm:text-5xl">{n}</span>
        <h2 className="font-display text-3xl tracking-wide sm:text-4xl">{title}</h2>
      </div>
      <div className="font-poppins space-y-4 text-sm leading-relaxed sm:text-base">{children}</div>
    </section>
  );
}
