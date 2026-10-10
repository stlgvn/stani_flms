"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    if (error) {
      setError(error.message);
      setState("idle");
    } else {
      setState("sent");
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-6">
      <h1 className="text-2xl font-bold">Sign in</h1>
      {state === "sent" ? (
        <div className="rounded-xl border border-border bg-card p-4">
          We sent a sign-in link to <b>{email}</b>. Open it on this same device.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm text-muted" htmlFor="email">
            Email — no password needed, we’ll send you a link
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-accent-fg hover:opacity-90 disabled:opacity-60"
          >
            {state === "sending" ? "Sending…" : "Send me a link"}
          </button>
          {error && <p className="text-sm text-bad">{error}</p>}
        </form>
      )}
    </div>
  );
}
