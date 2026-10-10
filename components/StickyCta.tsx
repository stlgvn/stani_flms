"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Phone-only "Try it" bar that slides in once the hero button has scrolled out of view.
export default function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-background/90 p-3 backdrop-blur transition-transform duration-300 sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link
        href="/login"
        className="block rounded-full bg-accent py-3.5 text-center font-semibold text-accent-fg shadow-lg shadow-accent/30"
      >
        Try it — 3 videos free
      </Link>
    </div>
  );
}
