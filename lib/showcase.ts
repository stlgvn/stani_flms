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

export const REELS: ShowcaseReel[] = [
  { src: "/showcase/porsche-original.mp4", poster: "/showcase/porsche-original.jpg", title: "Porsche 911 — Stani Films", platform: "Instagram" },
];
