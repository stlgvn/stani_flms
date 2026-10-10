"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PACKS, usd } from "@/lib/plans";
import { JOB_COLUMNS, type Job, type JobStrength } from "@/lib/types";

const STRENGTHS: { id: JobStrength; label: string; hint: string }[] = [
  { id: "light", label: "Light", hint: "barely noticeable" },
  { id: "medium", label: "Medium", hint: "recommended" },
  { id: "strong", label: "Strong", hint: "maximum difference" },
];

const STATUS: Record<Job["status"], string> = {
  queued: "Queued",
  processing: "Processing",
  done: "Done",
  failed: "Failed",
  expired: "Expired",
};

const ACCEPT = ".mp4,.mov,.webm,.mkv,video/mp4,video/quicktime,video/webm,video/x-matroska";
const MAX_BYTES = 500 * 1024 * 1024;

function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|]+/g, " ").trim() || "video";
}

// fetch cannot report upload progress, hence XMLHttpRequest.
function putWithProgress(url: string, file: File, onProgress: (f: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("cacheControl", "3600");
    form.append("", file);
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("apikey", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText.slice(0, 200)}`));
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(form);
  });
}

export default function Dashboard(props: {
  userId: string;
  email: string;
  initialCredits: number;
  initialJobs: Job[];
  notice: "paid" | "payment_error" | null;
}) {
  const supabase = useRef(createClient()).current;
  const [credits, setCredits] = useState(props.initialCredits);
  const [jobs, setJobs] = useState<Job[]>(props.initialJobs);
  const [strength, setStrength] = useState<JobStrength>("medium");
  const [upload, setUpload] = useState<{ name: string; progress: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const [{ data: j }, { data: p }] = await Promise.all([
      supabase.from("jobs").select(JOB_COLUMNS).order("created_at", { ascending: false }).limit(50),
      supabase.from("profiles").select("credits").eq("id", props.userId).single(),
    ]);
    if (j) setJobs(j as Job[]);
    if (p) setCredits(p.credits);
  }, [supabase, props.userId]);

  // After checkout the webhook may land a few seconds after the redirect — keep refreshing the balance briefly.
  useEffect(() => {
    if (props.notice !== "paid") return;
    window.history.replaceState(null, "", "/dashboard");
    let n = 0;
    const t = setInterval(() => (++n > 10 ? clearInterval(t) : refresh()), 2000);
    return () => clearInterval(t);
  }, [props.notice, refresh]);

  const pending = jobs.some((j) => j.status === "queued" || j.status === "processing");
  useEffect(() => {
    if (!pending) return;
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, [pending, refresh]);

  async function handleFile(file: File) {
    setError(null);
    if (credits <= 0) return setError("You’re out of credits — buy a pack below.");
    if (file.size > MAX_BYTES) return setError("The file is larger than 500 MB.");
    const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
    if (!["mp4", "mov", "webm", "mkv"].includes(ext)) return setError("Please use an MP4, MOV, WEBM or MKV file.");

    const path = `${props.userId}/${crypto.randomUUID()}/in.${ext}`;
    setUpload({ name: file.name, progress: 0 });
    try {
      const { data, error } = await supabase.storage.from("videos").createSignedUploadUrl(path);
      if (error || !data) throw new Error(error?.message ?? "Could not start the upload");
      await putWithProgress(data.signedUrl, file, (f) => setUpload({ name: file.name, progress: f }));
      const { error: rpcError } = await supabase.rpc("create_job", {
        p_input_path: path,
        p_original_name: file.name,
        p_strength: strength,
      });
      if (rpcError) throw new Error(rpcError.message);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setUpload(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function download(job: Job) {
    if (!job.output_path) return;
    const { data, error } = await supabase.storage.from("videos").createSignedUrl(job.output_path, 600);
    if (error || !data) return setError(error?.message ?? "Could not get a download link");
    // Add the file name ourselves: the { download } option in supabase-js double-encodes non-ASCII names.
    const name = encodeURIComponent(`${baseName(job.original_name)}_v2.mp4`);
    window.location.assign(`${data.signedUrl}&download=${name}`);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted">{props.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
            Balance: <b data-testid="credits">{credits}</b> {credits === 1 ? "video" : "videos"}
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-muted hover:text-foreground">Sign out</button>
          </form>
        </div>
      </div>

      {props.notice === "paid" && (
        <p className="rounded-xl border border-ok/40 bg-ok/10 p-3 text-sm">
          Thanks for your purchase! Your credits will appear on your balance in a few seconds.
        </p>
      )}
      {props.notice === "payment_error" && (
        <p className="rounded-xl border border-bad/40 bg-bad/10 p-3 text-sm">
          We couldn’t open the payment page. Please try again in a minute.
        </p>
      )}

      <section className="space-y-3">
        <h2 className="font-semibold">Strength</h2>
        <div className="grid grid-cols-3 gap-2">
          {STRENGTHS.map((s) => (
            <button
              key={s.id}
              onClick={() => setStrength(s.id)}
              className={`rounded-xl border px-3 py-3 text-left ${
                strength === s.id ? "border-accent bg-accent/10" : "border-border bg-card hover:border-muted"
              }`}
            >
              <div className="font-medium">{s.label}</div>
              <div className="text-xs text-muted">{s.hint}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div
          role="button"
          tabIndex={0}
          onClick={() => !upload && inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && !upload && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f && !upload) handleFile(f);
          }}
          className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
            drag ? "border-accent bg-accent/10" : "border-border bg-card hover:border-muted"
          }`}
        >
          {upload ? (
            <div className="w-full max-w-sm space-y-2">
              <div className="truncate text-sm">{upload.name}</div>
              <Bar value={upload.progress} />
              <div className="text-xs text-muted">Uploading {Math.round(upload.progress * 100)}%</div>
            </div>
          ) : (
            <>
              <div className="font-medium">Drop a video here or click to choose one</div>
              <div className="mt-1 text-xs text-muted">MP4, MOV, WEBM, MKV · up to 500 MB · up to 11 min · 1 video = 1 credit</div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
        {error && <p className="mt-2 text-sm text-bad">{error}</p>}
      </section>

      <section className="space-y-3" id="buy">
        <h2 className="font-semibold">Buy credits</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {PACKS.map((p) => (
            <form key={p.id} action="/api/checkout" method="post" className="rounded-xl border border-border bg-card p-4">
              <input type="hidden" name="pack" value={p.id} />
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{p.name}</span>
                {p.note && <span className="text-xs text-accent">{p.note}</span>}
              </div>
              <div className="mt-1 text-2xl font-bold">{usd(p.priceCents)}</div>
              <div className="text-xs text-muted">
                {p.credits} videos · {usd(Math.round(p.priceCents / p.credits))} each
              </div>
              <button className="mt-3 w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90">
                Buy
              </button>
            </form>
          ))}
        </div>
        <p className="text-xs text-muted">Secure payment by Stripe. Credits never expire.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">My videos</h2>
        {jobs.length === 0 && <p className="text-sm text-muted">Nothing here yet.</p>}
        <ul className="space-y-2">
          {jobs.map((j) => (
            <li key={j.id} className="rounded-xl border border-border bg-card p-4" data-testid="job">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium">{j.original_name}</div>
                  <div className="text-xs text-muted">
                    {new Date(j.created_at).toLocaleString("en-US")} · {STRENGTHS.find((s) => s.id === j.strength)?.label}
                  </div>
                </div>
                {j.status === "done" ? (
                  <button
                    onClick={() => download(j)}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90"
                  >
                    Download
                  </button>
                ) : (
                  <span
                    data-testid="status"
                    className={`text-sm ${j.status === "failed" ? "text-bad" : "text-muted"}`}
                  >
                    {STATUS[j.status]}
                  </span>
                )}
              </div>
              {(j.status === "queued" || j.status === "processing") && (
                <div className="mt-3 space-y-1">
                  <Bar value={j.progress} />
                  <div className="text-xs text-muted">{Math.round(j.progress * 100)}%</div>
                </div>
              )}
              {j.status === "failed" && j.error && (
                <p className="mt-2 text-xs text-bad">{j.error} The credit has been refunded.</p>
              )}
              {j.status === "done" && j.expires_at && (
                <p className="mt-2 text-xs text-muted">
                  Available until {new Date(j.expires_at).toLocaleString("en-US")}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}
