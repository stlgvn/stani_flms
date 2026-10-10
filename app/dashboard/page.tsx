import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import Dashboard from "@/components/Dashboard";
import { createClient } from "@/lib/supabase/server";
import { JOB_COLUMNS, type Job } from "@/lib/types";

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <DashboardData />
    </Suspense>
  );
}

// Reads the session from cookies, so it must sit behind a Suspense boundary (Cache Components rule).
async function DashboardData() {
  await connection(); // request time only: the Supabase client reads the current time
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: jobs }] = await Promise.all([
    supabase.from("profiles").select("credits").eq("id", user.id).single(),
    supabase.from("jobs").select(JOB_COLUMNS).order("created_at", { ascending: false }).limit(50),
  ]);

  return (
    <Dashboard
      userId={user.id}
      email={user.email ?? ""}
      initialCredits={profile?.credits ?? 0}
      initialJobs={(jobs ?? []) as Job[]}
    />
  );
}
