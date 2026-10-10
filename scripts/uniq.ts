// npm run uniq -- <input> <output> [light|medium|strong] ["Metadata title"]
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { STRENGTHS, uniqualize, type Strength } from "../lib/uniq";

async function main() {
  const [input, output, strengthArg = "medium", title = ""] = process.argv.slice(2);
  if (!input || !output) {
    console.error('Usage: npm run uniq -- <input> <output> [light|medium|strong] ["Title"]');
    process.exit(1);
  }
  if (!STRENGTHS.includes(strengthArg as Strength)) {
    console.error(`Strength must be one of: ${STRENGTHS.join(", ")}`);
    process.exit(1);
  }
  const inAbs = path.resolve(input);
  const outAbs = path.resolve(output);
  if (!existsSync(inAbs)) {
    console.error(`File not found: ${inAbs}`);
    process.exit(1);
  }
  if (inAbs === outAbs) {
    console.error("The output path is the same as the input — the original must never be overwritten.");
    process.exit(1);
  }
  mkdirSync(path.dirname(outAbs), { recursive: true });

  let last = -1;
  const res = await uniqualize(inAbs, outAbs, {
    strength: strengthArg as Strength,
    title,
    onProgress: (f) => {
      const pct = Math.floor(f * 100);
      if (pct >= last + 10 || pct === 100) {
        last = pct;
        process.stderr.write(`  ${pct}%\n`);
      }
    },
  });

  const s = res.source;
  const o = res.output;
  console.log(`Done in ${res.seconds}s → ${outAbs}`);
  console.log(`Source: ${s.width}x${s.height}, ${s.fps} fps, video ${s.videoDuration}s, audio ${s.audioDuration ?? "none"}s`);
  console.log(`Result: ${o.width}x${o.height}, ${o.fps} fps, video ${o.videoDuration}s, audio ${o.audioDuration ?? "none"}s, A/V drift ${res.avDrift}s`);
  console.log(`Params (${res.strength}): ${JSON.stringify(res.params)}`);
}

main().catch((e) => {
  console.error(`Error: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
