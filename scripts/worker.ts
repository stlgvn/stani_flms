// Worker: takes jobs from the queue, runs them through the core and uploads the result.
// Run: npm run worker (or npm run worker:dev to restart on code changes).
// The service role key is used only here and is read from .env.local.

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { probe, uniqualize, type Strength } from "../lib/uniq";

config({ path: path.join(__dirname, "..", ".env.local"), quiet: true });

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env.local");
  process.exit(1);
}

const BUCKET = "videos";
const MAX_SECONDS = 11 * 60;
const KEEP_HOURS = 48;
const IDLE_MS = 3000;
const MAINTENANCE_MS = 10 * 60 * 1000;
const STUCK_MINUTES = 60;

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

interface Job {
  id: string;
  user_id: string;
  strength: Strength;
  original_name: string;
  input_path: string;
}

const log = (...a: unknown[]) => console.log(new Date().toISOString().slice(11, 19), ...a);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function processJob(job: Job) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "uniq-"));
  const ext = path.extname(job.input_path) || ".mp4";
  const input = path.join(dir, `in${ext}`);
  const output = path.join(dir, "out.mp4");
  const outputPath = `${path.posix.dirname(job.input_path)}/out.mp4`;
  try {
    const { data: blob, error: dlErr } = await db.storage.from(BUCKET).download(job.input_path);
    if (dlErr || !blob) throw new Error(`Could not download the source: ${dlErr?.message ?? "empty"}`);
    await writeFile(input, Buffer.from(await blob.arrayBuffer()));

    const info = await probe(input).catch(() => {
      throw new Error("The file is not a video or is corrupted.");
    });
    await db.from("jobs").update({ source_duration: info.duration }).eq("id", job.id);
    if (info.duration > MAX_SECONDS) throw new Error("The video is longer than 11 minutes.");

    let lastPct = 0;
    const title = job.original_name.replace(/\.[^.]+$/, "");
    const res = await uniqualize(input, output, {
      strength: job.strength,
      title,
      onProgress: (f) => {
        const pct = Math.floor(f * 100);
        if (pct >= lastPct + 5 && pct < 100) {
          lastPct = pct;
          void db.from("jobs").update({ progress: pct / 100 }).eq("id", job.id).then();
        }
      },
    });

    const { error: upErr } = await db.storage
      .from(BUCKET)
      .upload(outputPath, await readFile(output), { contentType: "video/mp4", upsert: true });
    if (upErr) throw new Error(`Could not save the result: ${upErr.message}`);

    await db
      .from("jobs")
      .update({
        status: "done",
        progress: 1,
        output_path: outputPath,
        params: res.params,
        finished_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + KEEP_HOURS * 3600 * 1000).toISOString(),
      })
      .eq("id", job.id);
    log(`✓ ${job.id} in ${res.seconds}s (${job.strength})`);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    log(`✗ ${job.id}: ${message}`);
    await db
      .from("jobs")
      .update({
        status: "failed",
        error: message.slice(0, 500),
        finished_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + KEEP_HOURS * 3600 * 1000).toISOString(),
      })
      .eq("id", job.id);
    await db.rpc("refund_credit", { p_user: job.user_id });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

// Every 10 minutes: delete expired files and requeue stuck jobs.
async function maintenance() {
  const now = new Date().toISOString();
  const { data: old } = await db
    .from("jobs")
    .select("id,status,input_path,output_path")
    .lt("expires_at", now)
    .in("status", ["done", "failed"])
    .limit(500);
  for (const j of old ?? []) {
    const paths = [j.input_path, j.output_path].filter(Boolean) as string[];
    const { error } = await db.storage.from(BUCKET).remove(paths);
    if (error) {
      log(`Could not delete files for ${j.id}: ${error.message}`);
      continue;
    }
    // Failed jobs stay "failed" so the error stays visible; clear the expiry so they are not cleaned twice.
    await db
      .from("jobs")
      .update(j.status === "done" ? { status: "expired", expires_at: null } : { expires_at: null })
      .eq("id", j.id);
  }
  if (old?.length) log(`Cleaned up jobs: ${old.length}`);

  const stuckBefore = new Date(Date.now() - STUCK_MINUTES * 60 * 1000).toISOString();
  const { data: stuck } = await db
    .from("jobs")
    .update({ status: "queued", progress: 0, started_at: null })
    .eq("status", "processing")
    .lt("started_at", stuckBefore)
    .select("id");
  if (stuck?.length) log(`Requeued stuck jobs: ${stuck.length}`);
}

async function main() {
  log(`Worker started, Supabase: ${SUPABASE_URL}`);
  let nextMaintenance = 0;
  let stopping = false;
  const stop = () => {
    if (stopping) process.exit(0);
    stopping = true;
    log("Stopping after the current job… (Ctrl+C again to quit now)");
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  while (!stopping) {
    try {
      if (Date.now() >= nextMaintenance) {
        nextMaintenance = Date.now() + MAINTENANCE_MS;
        await maintenance();
      }
      const { data, error } = await db.rpc("claim_job");
      if (error) throw error;
      const job = (data as Job[] | null)?.[0];
      if (!job) {
        await sleep(IDLE_MS);
        continue;
      }
      log(`→ ${job.id} «${job.original_name}» (${job.strength})`);
      await processJob(job);
    } catch (e) {
      log("Loop error:", e instanceof Error ? e.message : e);
      await sleep(5000);
    }
  }
}

main();
