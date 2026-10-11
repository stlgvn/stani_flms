import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import Dashboard from "@/components/Dashboard";
import { createClient } from "@/lib/supabase/server";
import { findPack } from "@/lib/plans";
import { JOB_COLUMNS, type Job } from "@/lib/types";

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <DashboardData searchParams={searchParams} />
    </Suspense>
  );
}

// Reads the session from cookies, so it must sit behind a Suspense boundary (Cache Components rule).
async function DashboardData({ searchParams }: { searchParams: PageProps<"/dashboard">["searchParams"] }) {
  await connection(); // request time only: the Supabase client reads the current time
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const query = await searchParams;
  if (!user) redirect(typeof query.pack === "string" ? `/login?pack=${encodeURIComponent(query.pack)}` : "/login");

  const [{ data: profile }, { data: jobs }] = await Promise.all([
    supabase.from("profiles").select("credits").eq("id", user.id).single(),
    supabase.from("jobs").select(JOB_COLUMNS).order("created_at", { ascending: false }).limit(50),
  ]);

  const notice = query.paid ? "paid" : query.payment_error ? "payment_error" : null;

  return (
    <Dashboard
      notice={notice}
      selectedPack={typeof query.pack === "string" ? (findPack(query.pack)?.id ?? null) : null}
      userId={user.id}
      email={user.email ?? ""}
      initialCredits={profile?.credits ?? 0}
      initialJobs={(jobs ?? []) as Job[]}
    />
  );
}
