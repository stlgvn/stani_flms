import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uniq — short video uniqualizer",
  description: "Fresh versions of your Reels, Shorts and TikToks from one source: a new file and metadata, the same look and sound.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-[70] border-b border-foreground bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-baseline gap-3">
              <span className="font-display text-3xl">
                Uniq<span className="text-dot">.</span>
              </span>
              <span className="label text-[7px] tracking-[0.12em] text-muted">by Stani Flms</span>
            </Link>
            <Link
              href="/dashboard"
              className="label border border-foreground px-3 py-1.5 text-[11px] hover:bg-foreground hover:text-background"
            >
              Dashboard
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
        <footer className="border-t border-foreground">
          <div className="mx-auto max-w-5xl space-y-3 px-4 py-6 text-xs text-muted">
            <p>
              Only upload videos you own or have the rights to. This service does not clear copyright and is not
              responsible for how the result is used.
            </p>
            <nav className="label flex flex-wrap gap-x-5 gap-y-1 text-[11px]">
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/refunds" className="hover:text-foreground">Refunds</Link>
              <a href={`mailto:${SITE.email}`} className="hover:text-foreground">Contact</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
