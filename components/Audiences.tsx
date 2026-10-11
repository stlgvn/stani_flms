"use client";

import { useEffect, useState } from "react";

// "Who it's for" list: the highlight moves through the rows on its own; tapping a row selects it.
export default function Audiences({ items }: { items: string[][] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((i) => (i + 1) % items.length), 2600);
    return () => clearInterval(t);
  }, [paused, items.length]);

  return (
    <ul className="space-y-3">
      {items.map(([t, sub, d], i) => {
        const on = i === active;
        return (
          <li key={t}>
            <button
              type="button"
              onClick={() => {
                setActive(i);
                setPaused(true);
              }}
              className={`flex w-full items-start justify-between gap-4 border p-4 text-left transition-colors duration-500 ${
                on ? "border-panel bg-panel text-panel-fg" : "border-border bg-card hover:bg-border/30"
              }`}
            >
              <div>
                <div className="text-xl font-bold">{t}</div>
                <p className={`label mt-0.5 text-xs transition-opacity duration-500 ${on ? "opacity-70" : "text-muted"}`}>{sub}</p>
                <p className={`mt-2 text-sm transition-opacity duration-500 ${on ? "opacity-80" : "text-muted"}`}>{d}</p>
              </div>
              <span className={`mt-2 h-3 w-3 shrink-0 bg-dot transition-transform duration-500 ${on ? "scale-100" : "scale-0"}`} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
