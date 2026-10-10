import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uniq — уникализатор коротких роликов",
  description: "Новые версии Reels, Shorts и TikTok из одного исходника: другой файл и метаданные, тот же вид и звук.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e12" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Uniq<span className="text-accent">.</span>
            </Link>
            <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
              Личный кабинет →
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-4xl px-4 py-4 text-xs text-muted">
            Загружайте только ролики, на которые у вас есть права. Сервис не снимает авторские права и не отвечает за
            использование результата.
          </div>
        </footer>
      </body>
    </html>
  );
}
