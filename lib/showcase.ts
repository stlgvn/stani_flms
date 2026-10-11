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

// Hero clip: scrolling through real Instagram activity on the Stani Flms account.
export const HERO = { src: "/showcase/hero-bg.mp4", poster: "/showcase/hero-bg.jpg" };

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
      { value: "6", label: "posts over 100K", accent: true },
      { value: "169K", label: "views on one post" },
      { value: "5.2K", label: "likes on that post" },
    ],
    text: "We posted this one film about 9 times. Six of those posts passed 100,000 views each. One great video can keep working - it just needs a fresh file every time.",
  },
];

// Optional wall of reels with real view counts (shown when there are 3 or more).
export const REELS: ShowcaseReel[] = [];
