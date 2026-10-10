// Credit packs for sale. Change names, credits or prices here — nothing else needs editing.
export interface Pack {
  id: string;
  name: string;
  credits: number;
  priceCents: number; // in USD cents
  note?: string;
}

export const PACKS: Pack[] = [
  { id: "starter", name: "Starter", credits: 10, priceCents: 600 },
  { id: "creator", name: "Creator", credits: 60, priceCents: 1900, note: "Most popular" },
  { id: "pro", name: "Pro", credits: 300, priceCents: 6300, note: "Best value" },
];

export const findPack = (id: string) => PACKS.find((p) => p.id === id);
export const usd = (cents: number) => `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
