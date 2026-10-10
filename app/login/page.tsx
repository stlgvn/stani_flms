"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const creds = { email: email.trim(), password };
    const { data, error } =
      mode === "signup"
        ? await supabase.auth.signUp({
            ...creds,
            options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
          })
        : await supabase.auth.signInWithPassword(creds);
    setBusy(false);
    if (error) return setError(error.message);
    // With email confirmation turned on, sign-up returns no session until the link is clicked.
    if (!data.session) return setMessage(`Check ${creds.email} for a confirmation link.`);
    // Full page load, not router.push: a prefetched /dashboard from before sign-in would
    // still hold the "not signed in" redirect.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/dashboard");
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-6">
      <h1 className="text-2xl font-bold">{mode === "signup" ? "Create your account" : "Sign in"}</h1>
      {mode === "signup" && <p className="text-sm text-muted">3 free videos to start. No card needed.</p>}
      <form onSubmit={onSubmit} className="space-y-3">
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
        <input
          id="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (6+ characters)"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-accent-fg hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
        {error && <p className="text-sm text-bad">{error}</p>}
        {message && <p className="text-sm">{message}</p>}
      </form>
      <p className="text-sm text-muted">
        {mode === "signup" ? "Already have an account? " : "New here? "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signup" ? "signin" : "signup");
            setError(null);
            setMessage(null);
          }}
          className="text-accent underline"
        >
          {mode === "signup" ? "Sign in" : "Create an account"}
        </button>
      </p>
    </div>
  );
}
