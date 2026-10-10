// npm run uniq -- <вход> <выход> [light|medium|strong] ["Название для метаданных"]
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { STRENGTHS, uniqualize, type Strength } from "../lib/uniq";

async function main() {
  const [input, output, strengthArg = "medium", title = ""] = process.argv.slice(2);
  if (!input || !output) {
    console.error('Использование: npm run uniq -- <вход> <выход> [light|medium|strong] ["Название"]');
    process.exit(1);
  }
  if (!STRENGTHS.includes(strengthArg as Strength)) {
    console.error(`Сила должна быть одной из: ${STRENGTHS.join(", ")}`);
    process.exit(1);
  }
  const inAbs = path.resolve(input);
  const outAbs = path.resolve(output);
  if (!existsSync(inAbs)) {
    console.error(`Файл не найден: ${inAbs}`);
    process.exit(1);
  }
  if (inAbs === outAbs) {
    console.error("Выходной файл совпадает с исходником — оригинал перезаписывать нельзя.");
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
  console.log(`Готово за ${res.seconds} с → ${outAbs}`);
  console.log(`Исходник: ${s.width}x${s.height}, ${s.fps} fps, видео ${s.videoDuration} с, звук ${s.audioDuration ?? "нет"} с`);
  console.log(`Результат: ${o.width}x${o.height}, ${o.fps} fps, видео ${o.videoDuration} с, звук ${o.audioDuration ?? "нет"} с, сдвиг дорожек ${res.avDrift} с`);
  console.log(`Параметры (${res.strength}): ${JSON.stringify(res.params)}`);
}

main().catch((e) => {
  console.error(`Ошибка: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
