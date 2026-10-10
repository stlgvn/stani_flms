"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Phone-only "Try it" bar, shown once the hero button has scrolled out of view.
export default function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-foreground bg-background/95 p-3 backdrop-blur sm:hidden">
      <Link href="/login" className="block bg-accent py-3.5 text-center font-semibold text-accent-fg">
        Try It: 3 Videos Free
      </Link>
    </div>
  );
}
