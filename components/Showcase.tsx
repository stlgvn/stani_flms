"use client";

import { useEffect, useRef } from "react";
import { COMPARE, REELS } from "@/lib/showcase";
import Viewfinder from "./Viewfinder";

// Original and unique version side by side, kept in sync so the viewer can compare frame by frame.
export function CompareVideos() {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const t = setInterval(() => {
      if (a.current && b.current && Math.abs(a.current.currentTime - b.current.currentTime) > 0.15) {
        b.current.currentTime = a.current.currentTime;
      }
    }, 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:gap-6">
      {[
        { ref: a, v: COMPARE.original, label: "Original", note: "your upload" },
        { ref: b, v: COMPARE.uniq, label: "Uniq version", note: "brand-new file" },
      ].map(({ ref, v, label, note }) => (
        <figure key={label} className="relative z-[60] overflow-hidden rounded-3xl bg-card">
          <Viewfinder compact label={label === "Original" ? "ORIGINAL" : "UNIQ · NEW FILE"}>
            <video
              ref={ref}
              src={v.src}
              poster={v.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="block aspect-[9/16] w-full object-cover"
            />
          </Viewfinder>
          <figcaption className="flex flex-wrap items-baseline justify-between gap-x-2 px-4 py-3">
            <span className="font-display text-2xl">{label}</span>
            <span className="font-hand text-2xl text-tan">{note}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function ReelWall() {
  return (
    <div className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
      {REELS.map((r) => (
        <figure
          key={r.src}
          className="relative z-[60] w-56 shrink-0 snap-start overflow-hidden rounded-[2rem] border-4 border-foreground/90 bg-black shadow-xl sm:w-64"
        >
          <video
            src={r.src}
            poster={r.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="aspect-[9/16] w-full object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <div className="text-xs opacity-80">{r.platform}</div>
            <div className="text-sm font-semibold">{r.title}</div>
            {r.views && (
              <div className="font-display mt-1 text-3xl">
                {r.views} <span className="text-base">views</span>
              </div>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
