// Uniqualizer core: turns one video into a new version with random
// parameters (zoom, crop shift, speed, pitch, color, noise, volume).
// ffmpeg/ffprobe run via spawn with an argument array — no shell —
// so non-Latin characters, spaces and emoji in paths are safe.

import { spawn } from "node:child_process";

export type Strength = "light" | "medium" | "strong";
export const STRENGTHS: Strength[] = ["light", "medium", "strong"];

export interface UniqParams {
  zoom: number;
  cropX: number;
  cropY: number;
  speed: number;
  pitch: number;
  brightness: number;
  contrast: number;
  saturation: number;
  gamma: number;
  noise: number;
  volume: number;
}

type Range = [number, number];

const RANGES: Record<Strength, Record<keyof UniqParams, Range>> = {
  light: {
    zoom: [1.02, 1.032],
    cropX: [0.35, 0.65],
    cropY: [0.35, 0.65],
    speed: [1.01, 1.02],
    pitch: [1.004, 1.008],
    brightness: [0.005, 0.015],
    contrast: [1.02, 1.04],
    saturation: [1.03, 1.06],
    gamma: [0.98, 1.0],
    noise: [1, 2],
    volume: [1.02, 1.05],
  },
  medium: {
    zoom: [1.035, 1.05],
    cropX: [0.3, 0.7],
    cropY: [0.3, 0.7],
    speed: [1.025, 1.035],
    pitch: [1.008, 1.012],
    brightness: [0.01, 0.025],
    contrast: [1.04, 1.07],
    saturation: [1.06, 1.1],
    gamma: [0.97, 0.99],
    noise: [2, 4],
    volume: [1.03, 1.07],
  },
  strong: {
    zoom: [1.05, 1.07],
    cropX: [0.25, 0.75],
    cropY: [0.25, 0.75],
    speed: [1.035, 1.05],
    pitch: [1.01, 1.02],
    brightness: [0.015, 0.035],
    contrast: [1.06, 1.1],
    saturation: [1.08, 1.14],
    gamma: [0.96, 0.98],
    noise: [3, 6],
    volume: [1.04, 1.1],
  },
};

const rand = ([a, b]: Range) => a + Math.random() * (b - a);
const round = (x: number, d = 4) => Number(x.toFixed(d));
const even = (x: number) => Math.round(x / 2) * 2;

export function randomParams(strength: Strength = "medium"): UniqParams {
  const r = RANGES[strength];
  const [n0, n1] = r.noise;
  return {
    zoom: round(rand(r.zoom)),
    cropX: round(rand(r.cropX), 3),
    cropY: round(rand(r.cropY), 3),
    speed: round(rand(r.speed)),
    pitch: round(rand(r.pitch)),
    brightness: round(rand(r.brightness)),
    contrast: round(rand(r.contrast)),
    saturation: round(rand(r.saturation)),
    gamma: round(rand(r.gamma)),
    noise: n0 + Math.floor(Math.random() * (n1 - n0 + 1)),
    volume: round(rand(r.volume)),
  };
}

// ---------- ffprobe ----------

export interface MediaInfo {
  width: number; // rotation applied
  height: number;
  fps: number;
  duration: number; // whole-file duration, s
  videoDuration: number;
  audioDuration: number | null; // null — no audio
  sampleRate: number | null;
  sizeBytes: number;
}

function run(cmd: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    p.stdout.on("data", (d) => (stdout += d));
    p.stderr.on("data", (d) => (stderr += d));
    p.on("error", reject);
    p.on("close", (code) => resolve({ code: code ?? -1, stdout, stderr }));
  });
}

// "00:01:02.500000000" (mkv/webm tags) → seconds
function parseClock(s: string | undefined): number {
  if (!s) return NaN;
  const m = s.match(/^(\d+):(\d+):([\d.]+)$/);
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : parseFloat(s);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function streamDuration(s: any, fallback: number): number {
  const d = parseFloat(s?.duration);
  if (Number.isFinite(d)) return d;
  const t = parseClock(s?.tags?.DURATION);
  return Number.isFinite(t) ? t : fallback;
}

export async function probe(file: string): Promise<MediaInfo> {
  const { code, stdout, stderr } = await run("ffprobe", [
    "-v", "error", "-print_format", "json", "-show_streams", "-show_format", file,
  ]);
  if (code !== 0) throw new Error(`ffprobe could not read the file: ${stderr.trim().slice(-500)}`);
  const j = JSON.parse(stdout);
  const v = j.streams?.find((s: any) => s.codec_type === "video" && !s.disposition?.attached_pic);
  if (!v) throw new Error("The file has no video track");
  const a = j.streams?.find((s: any) => s.codec_type === "audio");

  let rotation = 0;
  for (const sd of v.side_data_list ?? []) if (sd.rotation != null) rotation = Number(sd.rotation);
  if (!rotation && v.tags?.rotate) rotation = Number(v.tags.rotate);
  const rotated = Math.abs(rotation) % 180 === 90;

  const [fn, fd] = String(v.avg_frame_rate || v.r_frame_rate || "30/1").split("/").map(Number);
  const total = parseFloat(j.format?.duration) || 0;

  return {
    width: rotated ? v.height : v.width,
    height: rotated ? v.width : v.height,
    fps: fd ? round(fn / fd, 3) : 30,
    duration: total,
    videoDuration: streamDuration(v, total),
    audioDuration: a ? streamDuration(a, total) : null,
    sampleRate: a ? Number(a.sample_rate) || 48000 : null,
    sizeBytes: Number(j.format?.size) || 0,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------- render ----------

export interface UniqOptions {
  strength?: Strength;
  title?: string;
  params?: UniqParams; // random if omitted
  onProgress?: (fraction: number) => void; // 0..1
}

export interface UniqResult {
  params: UniqParams;
  strength: Strength;
  source: MediaInfo;
  output: MediaInfo;
  seconds: number; // render time
  avDrift: number; // how much the A/V gap differs from the source, s
}

export function buildArgs(input: string, output: string, src: MediaInfo, p: UniqParams, title: string): string[] {
  // Frame size must be even for yuv420p/libx264.
  const w = src.width - (src.width % 2);
  const h = src.height - (src.height % 2);
  const zw = even(w * p.zoom);
  const zh = even(h * p.zoom);
  const cx = Math.round((zw - w) * p.cropX);
  const cy = Math.round((zh - h) * p.cropY);

  // fps=30 must come BEFORE setpts, otherwise the video keeps its original length and drifts from the audio.
  // No hflip: burned-in captions and watermarks would end up mirrored.
  const video =
    `[0:v]fps=30,setpts=(PTS-STARTPTS)/${p.speed},scale=${zw}:${zh},crop=${w}:${h}:${cx}:${cy},` +
    `eq=brightness=${p.brightness}:contrast=${p.contrast}:saturation=${p.saturation}:gamma=${p.gamma},` +
    `unsharp=5:5:0.4,noise=alls=${p.noise}:allf=t,vignette=PI/6[v]`;

  const hasAudio = src.audioDuration !== null;
  // asetrate raises pitch and tempo by `pitch`; atempo brings the tempo to exactly `speed`.
  const audio = hasAudio
    ? `;[0:a]asetrate=${Math.round(src.sampleRate! * p.pitch)},atempo=${round(p.speed / p.pitch, 6)},` +
      `aresample=48000,volume=${p.volume}[a]`
    : "";

  return [
    "-hide_banner", "-y", "-nostats", "-progress", "pipe:1",
    "-i", input,
    "-filter_complex", video + audio,
    "-map", "[v]",
    ...(hasAudio ? ["-map", "[a]"] : []),
    "-map_metadata", "-1", "-map_chapters", "-1",
    "-r", "30",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
    ...(hasAudio ? ["-c:a", "aac", "-b:a", "160k"] : []),
    "-movflags", "+faststart",
    "-metadata", `creation_time=${new Date().toISOString()}`,
    "-metadata", `title=${title}`,
    output,
  ];
}

export async function uniqualize(input: string, output: string, opts: UniqOptions = {}): Promise<UniqResult> {
  const strength = opts.strength ?? "medium";
  const params = opts.params ?? randomParams(strength);
  const title = opts.title ?? "";
  const src = await probe(input);
  const expected = src.duration / params.speed;
  const args = buildArgs(input, output, src, params, title);

  const started = Date.now();
  await new Promise<void>((resolve, reject) => {
    const p = spawn("ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    let buf = "";
    p.stdout.on("data", (d) => {
      buf += d;
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        const m = line.match(/^out_time_us=(\d+)/);
        if (m && expected > 0 && opts.onProgress) {
          opts.onProgress(Math.min(1, Number(m[1]) / 1e6 / expected));
        }
      }
    });
    p.stderr.on("data", (d) => {
      stderr += d;
      if (stderr.length > 20000) stderr = stderr.slice(-10000);
    });
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}: ${stderr.trim().slice(-800)}`)),
    );
  });
  const seconds = round((Date.now() - started) / 1000, 1);
  opts.onProgress?.(1);

  // Sync check: fail only on a NEW A/V gap, since many sources already
  // have audio 0.1–0.2 s shorter than the video.
  const out = await probe(output);
  let avDrift = 0;
  if (src.audioDuration !== null && out.audioDuration !== null) {
    const srcGap = (src.videoDuration - src.audioDuration) / params.speed;
    const outGap = out.videoDuration - out.audioDuration;
    avDrift = round(Math.abs(outGap - srcGap), 3);
    if (avDrift > 0.15) {
      throw new Error(
        `Audio drifted from video by ${avDrift}s (video ${out.videoDuration}s, audio ${out.audioDuration}s)`,
      );
    }
  }
  return { params, strength, source: src, output: out, seconds, avDrift };
}
