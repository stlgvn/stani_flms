// Videos shown on the landing page. Files live in public/showcase/.
// `views` must be the real numbers from the platform — leave it out if you don't have them.
export interface ShowcaseReel {
  src: string;
  poster: string;
  title: string;
  platform: "Instagram" | "TikTok" | "YouTube Shorts";
  views?: string; // e.g. "1.2M"
}

export const COMPARE = {
  original: { src: "/showcase/porsche-original.mp4", poster: "/showcase/porsche-original.jpg" },
  uniq: { src: "/showcase/porsche-uniq.mp4", poster: "/showcase/porsche-uniq.jpg" },
  credit: "Porsche 911 — Stani Films",
};

// Hero clip: scrolling through real Instagram activity on the Stani Flms account.
export const HERO = { src: "/showcase/ig-activity.mp4", poster: "/showcase/ig-activity.jpg" };

// Real result reported by Stani Flms for this film. Keep the numbers true.
export const CASE = {
  src: "/showcase/levis.mp4",
  poster: "/showcase/levis.jpg",
  posts: "≈9",
  hits: "6",
  views: "100K+",
};

// Optional wall of reels with real view counts (shown when there are 3 or more).
export const REELS: ShowcaseReel[] = [];
