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
  original: { src: "/showcase/levis-original.mp4", poster: "/showcase/levis-original.jpg" },
  uniq: { src: "/showcase/levis-uniq.mp4", poster: "/showcase/levis-uniq.jpg" },
  credit: "Levi's × Stani Films",
};

export const REELS: ShowcaseReel[] = [
  { src: "/showcase/levis-vertical.mp4", poster: "/showcase/levis-vertical.jpg", title: "Levi's × Stani Films", platform: "Instagram" },
];
