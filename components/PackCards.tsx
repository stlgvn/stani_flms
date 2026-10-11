import Link from "next/link";
import { PACKS, usd } from "@/lib/plans";

// One pricing block for the landing page and the dashboard, so both look the same.
// mode "link": the button leads to the dashboard with the pack picked (sign-in first if needed).
// mode "buy": the button posts to Stripe Checkout.
export default function PackCards({ mode, selected }: { mode: "link" | "buy"; selected?: string | null }) {
  const highlight = selected ?? "creator";
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {PACKS.map((p) => {
        const on = p.id === highlight;
        const tag = selected && on ? "Your pick" : p.note;
        const button = (
          <span className="nudge shine mt-5 inline-block bg-[#c41d15] px-10 py-2.5 text-sm font-semibold tracking-wide text-white uppercase hover:bg-[#a8180f]">
            Buy
          </span>
        );
        const body = (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <span className={`kicker text-base ${p.id === "creator" ? "text-dot" : p.id === "pro" ? "text-[#7c3aed]" : ""}`}>
                {p.name}
              </span>
              {tag && <span className={`label text-[10px] ${on ? "text-dot" : "text-muted"}`}>{tag}</span>}
            </div>
            <div className="font-display mt-4 text-6xl">{usd(p.priceCents)}</div>
            <div className="label mt-2 text-[10px] text-muted">
              {p.credits} videos / {usd(Math.round(p.priceCents / p.credits))} each
            </div>
          </>
        );
        const box = `block h-full bg-card p-5 ${on ? "border-2 border-dot" : "border border-border"}`;
        return (
          <li key={p.id}>
            {mode === "link" ? (
              <Link href={`/dashboard?pack=${p.id}#buy`} className={`${box} transition hover:bg-border/30`}>
                {body}
                {button}
              </Link>
            ) : (
              <form action="/api/checkout" method="post" className={box}>
                <input type="hidden" name="pack" value={p.id} />
                {body}
                <button type="submit" className="block">
                  {button}
                </button>
              </form>
            )}
          </li>
        );
      })}
    </ul>
  );
}
