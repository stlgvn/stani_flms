// Credit packs for sale. Change names, credits or prices here — nothing else needs editing.
export interface Pack {
  id: string;
  name: string;
  credits: number;
  priceCents: number; // in USD cents
  note?: string;
  blurb: string; // one short line shown on the pricing card
}

export const PACKS: Pack[] = [
  { id: "starter", name: "Starter", credits: 10, priceCents: 600, blurb: "Try it on your best reel. Post a few versions and see what lands." },
  { id: "creator", name: "Creator", credits: 60, priceCents: 1900, note: "Most popular", blurb: "Post every day. Fresh versions for all your accounts, all month." },
  { id: "pro", name: "Pro", credits: 300, priceCents: 6300, note: "Best value", blurb: "For agencies and many accounts. The lowest price per video." },
];

export const findPack = (id: string) => PACKS.find((p) => p.id === id);
export const usd = (cents: number) => `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
