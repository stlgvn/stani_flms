// Videos shown on the landing page. Files live in public/showcase/.
// `views` must be the real numbers from the platform - leave it out if you don't have them.
export interface ShowcaseReel {
  src: string;
  poster: string;
  title: string;
  platform: "Instagram" | "TikTok" | "YouTube Shorts";
  views?: string; // e.g. "1.2M"
}

export const COMPARE = {
  original: { src: "/showcase/levis-src.mp4", poster: "/showcase/levis-src.jpg" },
  uniq: { src: "/showcase/levis-uniq.mp4", poster: "/showcase/levis-uniq.jpg" },
  credit: "Levi's film - Stani Flms",
};

// Hero background: abstract motion graphic of growing reach (no real numbers shown).
export const HERO = { src: "/showcase/hero-growth.mp4", poster: "/showcase/hero-growth.jpg" };

// Real results reported by Stani Flms. Keep every number true.
export interface ShowcaseCase {
  src: string;
  poster: string;
  label: string;
  stats: { value: string; label: string; accent?: boolean }[];
  text: string;
}

export const CASES: ShowcaseCase[] = [
  {
    src: "/showcase/levis.mp4",
    poster: "/showcase/levis.jpg",
    label: "Case 01 / one film / shot by Stani Flms",
    stats: [
      { value: "9", label: "times posted" },
      { value: "6", label: "posts over 100K" },
      { value: "169K", label: "views on one post" },
      { value: "600K+", label: "total views", accent: true },
    ],
    text: "One film, posted 9 times. Six of those posts passed 100K each - over 600K views in total, about 6x what a single hit brings. Same video, much more reach.",
  },
];

// Optional wall of reels with real view counts (shown when there are 3 or more).
export const REELS: ShowcaseReel[] = [];
