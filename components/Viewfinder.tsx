"use client";

import { useEffect, useState } from "react";

// Camera viewfinder overlay on top of a video: corner brackets, blinking REC, running timecode,
// battery, format, rule-of-thirds grid and a focus cross. Purely decorative.
export default function Viewfinder({
  children,
  label = "4K · 30 FPS",
  compact = false,
  grid = true,
  ink = false,
  className = "",
}: {
  children: React.ReactNode;
  label?: string;
  compact?: boolean;
  grid?: boolean; // rule-of-thirds grid and focus cross
  ink?: boolean; // black marks for light backgrounds instead of white
  className?: string;
}) {
  const [frames, setFrames] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const t = setInterval(() => setFrames(Math.floor(((performance.now() - start) / 1000) * 30)), 100);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  const tc = `${pad(Math.floor(frames / 108000))}:${pad(Math.floor(frames / 1800) % 60)}:${pad(Math.floor(frames / 30) % 60)}:${pad(frames % 30)}`;
  const text = compact ? "text-[9px]" : "text-[11px]";
  const inset = compact ? "inset-2.5" : "inset-4";
  const corner = compact ? "h-4 w-4" : "h-6 w-6";

  return (
    <div className={`relative z-[60] overflow-hidden ${ink ? "bg-background" : "bg-black"} ${className}`}>
      {children}
      <div className={`pointer-events-none absolute inset-0 font-mono ${ink ? "text-foreground/80" : "text-white/90 [text-shadow:0_1px_2px_rgb(0_0_0/0.6)]"}`}>
        {/* rule-of-thirds grid */}
        {grid && <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_calc(33.33%-0.5px),rgb(255_255_255/0.18)_calc(33.33%-0.5px),rgb(255_255_255/0.18)_calc(33.33%+0.5px),transparent_calc(33.33%+0.5px),transparent_calc(66.66%-0.5px),rgb(255_255_255/0.18)_calc(66.66%-0.5px),rgb(255_255_255/0.18)_calc(66.66%+0.5px),transparent_calc(66.66%+0.5px)),linear-gradient(to_bottom,transparent_calc(33.33%-0.5px),rgb(255_255_255/0.18)_calc(33.33%-0.5px),rgb(255_255_255/0.18)_calc(33.33%+0.5px),transparent_calc(33.33%+0.5px),transparent_calc(66.66%-0.5px),rgb(255_255_255/0.18)_calc(66.66%-0.5px),rgb(255_255_255/0.18)_calc(66.66%+0.5px),transparent_calc(66.66%+0.5px))]" />}
        {/* corner brackets */}
        <div className={`absolute ${inset}`}>
          <span className={`absolute top-0 left-0 ${corner} border-t-2 border-l-2 border-current`} />
          <span className={`absolute top-0 right-0 ${corner} border-t-2 border-r-2 border-current`} />
          <span className={`absolute bottom-0 left-0 ${corner} border-b-2 border-l-2 border-current`} />
          <span className={`absolute right-0 bottom-0 ${corner} border-r-2 border-b-2 border-current`} />
        </div>
        {/* focus cross */}
        {grid && (
          <div className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute top-1/2 left-0 h-px w-full bg-white/70" />
            <span className="absolute top-0 left-1/2 h-full w-px bg-white/70" />
          </div>
        )}
        {/* top bar */}
        <div className={`absolute ${compact ? "top-4 right-5 left-5" : "top-7 right-8 left-8"} flex items-center justify-between ${text}`}>
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="rec-dot h-2 w-2 rounded-full bg-[#ff2d20]" /> REC
          </span>
          <span className="tabular-nums">{tc}</span>
        </div>
        {/* bottom bar */}
        <div className={`absolute ${compact ? "right-5 bottom-4 left-5" : "right-8 bottom-7 left-8"} flex items-center justify-between ${text}`}>
          <span>{label}</span>
          <span className="flex items-center gap-1">
            <span className="relative inline-block h-2.5 w-5 rounded-[2px] border border-current p-[1.5px]">
              <span className="block h-full w-3/4 bg-current" />
              <span className="absolute top-1/2 -right-[3px] h-1 w-[2px] -translate-y-1/2 bg-current" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
